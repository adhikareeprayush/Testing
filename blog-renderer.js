/**
 * Blog Markdown Renderer
 * Fetches and renders markdown content for blog posts
 */

class BlogRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.marked = null;
  }

  /**
   * Initialize the markdown parser
   */
  async init() {
    // Configure marked options for better rendering
    if (typeof marked !== "undefined") {
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
      });
      this.marked = marked;
    }
  }

  /**
   * Fetch markdown content from a file
   * @param {string} url - Path to the markdown file
   * @returns {Promise<string>} - The markdown content
   */
  async fetchMarkdown(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch markdown: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error fetching markdown:", error);
      return null;
    }
  }

  /**
   * Parse markdown to HTML
   * @param {string} markdown - The markdown content
   * @returns {string} - The HTML content
   */
  parseMarkdown(markdown) {
    if (!this.marked) {
      console.error("Marked library not loaded");
      return markdown;
    }
    return this.marked.parse(markdown);
  }

  /**
   * Extract metadata from markdown frontmatter (if present)
   * @param {string} markdown - The markdown content
   * @returns {Object} - Object containing metadata and content
   */
  extractMetadata(markdown) {
    const metadata = {
      title: "",
      author: "",
      date: "",
      readTime: "",
      category: "",
      image: "",
    };

    let content = markdown;

    // Check for YAML frontmatter (---...---)
    const frontmatterMatch = markdown.match(
      /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    );
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      content = frontmatterMatch[2];

      // Parse frontmatter
      frontmatter.split("\n").forEach((line) => {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts.length) {
          const value = valueParts
            .join(":")
            .trim()
            .replace(/^["']|["']$/g, "");
          metadata[key.trim()] = value;
        }
      });
    }

    // Extract title from first H1 if not in frontmatter
    if (!metadata.title) {
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        metadata.title = titleMatch[1];
      }
    }

    return { metadata, content };
  }

  /**
   * Apply custom styling to rendered HTML
   * @param {string} html - The rendered HTML
   * @returns {string} - HTML with Tailwind classes applied
   */
  applyStyles(html) {
    // Create a temporary container to manipulate the HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Style headings
    temp.querySelectorAll("h1").forEach((el) => {
      el.className = "text-3xl lg:text-4xl font-bold text-dark mb-6 mt-8";
    });
    temp.querySelectorAll("h2").forEach((el) => {
      el.className =
        "text-2xl lg:text-3xl font-bold text-dark mb-4 mt-8 border-b border-gray-200 pb-2";
    });
    temp.querySelectorAll("h3").forEach((el) => {
      el.className = "text-xl lg:text-2xl font-semibold text-dark mb-3 mt-6";
    });
    temp.querySelectorAll("h4").forEach((el) => {
      el.className = "text-lg lg:text-xl font-semibold text-dark mb-2 mt-4";
    });

    // Style paragraphs
    temp.querySelectorAll("p").forEach((el) => {
      el.className = "text-muted text-base lg:text-lg leading-relaxed mb-4";
    });

    // Style lists
    temp.querySelectorAll("ul").forEach((el) => {
      el.className = "list-disc list-inside space-y-2 mb-6 text-muted";
    });
    temp.querySelectorAll("ol").forEach((el) => {
      el.className = "list-decimal list-inside space-y-2 mb-6 text-muted";
    });
    temp.querySelectorAll("li").forEach((el) => {
      el.className = "text-base lg:text-lg leading-relaxed";
    });

    // Style blockquotes
    temp.querySelectorAll("blockquote").forEach((el) => {
      el.className =
        "border-l-4 border-primary-700 pl-6 py-4 my-6 bg-primary-50 rounded-r-lg italic text-dark";
    });

    // Style code blocks
    temp.querySelectorAll("pre").forEach((el) => {
      el.className =
        "bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 text-sm";
    });
    temp.querySelectorAll("code").forEach((el) => {
      if (!el.parentElement.matches("pre")) {
        el.className =
          "bg-gray-100 text-primary-700 px-2 py-1 rounded text-sm font-mono";
      }
    });

    // Style tables
    temp.querySelectorAll("table").forEach((el) => {
      el.className = "w-full border-collapse mb-6 text-base";
      el.innerHTML = `<div class="overflow-x-auto">${el.outerHTML}</div>`;
    });
    temp.querySelectorAll("th").forEach((el) => {
      el.className =
        "bg-primary-700 text-white px-4 py-3 text-left font-semibold";
    });
    temp.querySelectorAll("td").forEach((el) => {
      el.className = "border border-gray-200 px-4 py-3";
    });
    temp.querySelectorAll("tr:nth-child(even)").forEach((el) => {
      el.className = "bg-gray-50";
    });

    // Style links
    temp.querySelectorAll("a").forEach((el) => {
      el.className =
        "text-primary-700 hover:text-primary-800 underline transition-colors duration-300";
    });

    // Style horizontal rules
    temp.querySelectorAll("hr").forEach((el) => {
      el.className = "border-t border-gray-200 my-8";
    });

    // Style strong/bold
    temp.querySelectorAll("strong").forEach((el) => {
      el.className = "font-semibold text-dark";
    });

    // Style images
    temp.querySelectorAll("img").forEach((el) => {
      el.className = "rounded-2xl shadow-lg my-6 w-full object-cover";
    });

    return temp.innerHTML;
  }

  /**
   * Render markdown content to the container
   * @param {string} markdownUrl - Path to the markdown file
   */
  async render(markdownUrl) {
    if (!this.container) {
      console.error("Container not found");
      return;
    }

    // Show loading state
    this.container.innerHTML = `
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-700 border-t-transparent"></div>
      </div>
    `;

    await this.init();

    const markdown = await this.fetchMarkdown(markdownUrl);
    if (!markdown) {
      this.container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-red-500 text-lg">Failed to load blog content. Please try again later.</p>
        </div>
      `;
      return;
    }

    const { metadata, content } = this.extractMetadata(markdown);
    const html = this.parseMarkdown(content);
    const styledHtml = this.applyStyles(html);

    this.container.innerHTML = styledHtml;

    // Dispatch event when rendering is complete
    document.dispatchEvent(
      new CustomEvent("blogRendered", { detail: metadata })
    );
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = BlogRenderer;
}
