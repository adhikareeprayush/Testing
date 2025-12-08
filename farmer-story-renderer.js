/**
 * Farmer Story Renderer
 * Renders markdown farmer stories with YAML frontmatter for metadata
 * Uses marked.js for markdown parsing
 */

class FarmerStoryRenderer {
  constructor(containerId, metadataContainerId = null) {
    this.container = document.getElementById(containerId);
    this.metadataContainer = metadataContainerId
      ? document.getElementById(metadataContainerId)
      : null;
    this.metadata = {};

    // Configure marked.js options
    if (typeof marked !== "undefined") {
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
      });
    }
  }

  /**
   * Load and render a farmer story from markdown file
   * @param {string} filename - The markdown filename in farmers_stories/
   */
  async loadStory(filename) {
    try {
      const response = await fetch(`farmers_stories/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load story: ${response.status}`);
      }

      const content = await response.text();
      const { metadata, body } = this.parseFrontmatter(content);

      this.metadata = metadata;
      this.updateMetadataUI();

      const html = this.parseMarkdown(body);
      this.container.innerHTML = html;
      this.applyStyles();

      return { metadata, body };
    } catch (error) {
      console.error("Error loading farmer story:", error);
      this.container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-red-500 text-lg">Failed to load story</p>
          <p class="text-muted mt-2">${error.message}</p>
        </div>
      `;
      return null;
    }
  }

  /**
   * Parse YAML-like frontmatter from markdown content
   * @param {string} content - Raw markdown content with frontmatter
   */
  parseFrontmatter(content) {
    const frontmatterRegex = /^#\s+(.+)\n\n---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (match) {
      const title = match[1];
      const frontmatter = match[2];
      const body = match[3];

      // Parse YAML-like frontmatter
      const metadata = { title };
      const lines = frontmatter.split("\n");
      let currentKey = null;
      let inStats = false;

      lines.forEach((line) => {
        if (line.trim() === "") return;

        if (line.startsWith("stats:")) {
          inStats = true;
          metadata.stats = {};
          return;
        }

        if (inStats && line.startsWith("  ")) {
          const [key, ...valueParts] = line.trim().split(":");
          const value = valueParts.join(":").trim();
          metadata.stats[key.trim()] = value;
        } else if (!line.startsWith("  ")) {
          inStats = false;
          const colonIndex = line.indexOf(":");
          if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            metadata[key] = value;
          }
        }
      });

      return { metadata, body };
    }

    // No frontmatter found, return content as-is
    return { metadata: {}, body: content };
  }

  /**
   * Update the UI elements with farmer metadata
   */
  updateMetadataUI() {
    const m = this.metadata;

    // Update hero section
    const heroImage = document.getElementById("heroImage");
    if (heroImage && m.hero_image) {
      heroImage.src = m.hero_image;
    }

    const farmerName = document.getElementById("farmerName");
    if (farmerName && m.name) {
      farmerName.textContent = m.name;
    }

    const farmerTitle = document.getElementById("farmerTitle");
    if (farmerTitle && m.title) {
      farmerTitle.textContent = `${m.title} | ${m.experience} Experience`;
    }

    const farmerBadge = document.getElementById("farmerBadge");
    if (farmerBadge && m.badge) {
      farmerBadge.textContent = m.badge;
    }

    const locationBadge = document.getElementById("locationBadge");
    if (locationBadge && m.location) {
      locationBadge.textContent = m.location.split(",")[0];
    }

    // Update sidebar profile
    const profileImage = document.getElementById("profileImage");
    if (profileImage && m.profile_image) {
      profileImage.src = m.profile_image;
    }

    const sidebarName = document.getElementById("sidebarName");
    if (sidebarName && m.name) {
      sidebarName.textContent = m.name;
    }

    const sidebarTitle = document.getElementById("sidebarTitle");
    if (sidebarTitle && m.title) {
      sidebarTitle.textContent = m.title;
    }

    // Update sidebar info
    const locationText = document.getElementById("locationText");
    if (locationText && m.location) {
      locationText.textContent = m.location;
    }

    const experienceText = document.getElementById("experienceText");
    if (experienceText && m.experience) {
      experienceText.textContent = m.experience;
    }

    const farmSizeText = document.getElementById("farmSizeText");
    if (farmSizeText && m.farm_size) {
      farmSizeText.textContent = m.farm_size;
    }

    const certificationText = document.getElementById("certificationText");
    if (certificationText && m.certification) {
      certificationText.textContent = m.certification;
    }

    // Update products
    const productsContainer = document.getElementById("productsContainer");
    if (productsContainer && m.products) {
      const products = m.products.split(",").map((p) => p.trim());
      productsContainer.innerHTML = products
        .map(
          (product) =>
            `<span class="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">${product}</span>`
        )
        .join("");
    }

    // Update stats
    if (m.stats) {
      const statsMapping = {
        customers: "statCustomers",
        years_organic: "statYears",
        crop_varieties: "statVarieties",
        dairy_products: "statVarieties",
        chemical_free: "statChemicalFree",
      };

      Object.entries(m.stats).forEach(([key, value]) => {
        const elementId = statsMapping[key];
        const element = document.getElementById(elementId);
        if (element) {
          element.textContent = value;
        }
      });
    }

    // Update breadcrumb
    const breadcrumbName = document.getElementById("breadcrumb-name");
    if (breadcrumbName && m.name) {
      breadcrumbName.textContent = m.name;
    }

    // Update page title
    if (m.name) {
      document.title = `${m.name} - Farmer Story | Organic Shop Nepal`;
    }
  }

  /**
   * Parse markdown to HTML using marked.js
   * @param {string} markdown - Markdown content
   */
  parseMarkdown(markdown) {
    if (typeof marked === "undefined") {
      console.error("marked.js is not loaded");
      return `<p>${markdown}</p>`;
    }
    return marked.parse(markdown);
  }

  /**
   * Apply Tailwind CSS styles to rendered markdown elements
   */
  applyStyles() {
    // Style headings
    this.container.querySelectorAll("h1").forEach((el) => {
      el.classList.add(
        "text-2xl",
        "lg:text-3xl",
        "font-bold",
        "text-dark",
        "mb-6",
        "mt-8",
        "first:mt-0"
      );
    });

    this.container.querySelectorAll("h2").forEach((el) => {
      el.classList.add("text-xl", "font-bold", "text-dark", "mt-8", "mb-4");
    });

    this.container.querySelectorAll("h3").forEach((el) => {
      el.classList.add("text-lg", "font-bold", "text-dark", "mt-6", "mb-3");
    });

    // Style paragraphs
    this.container.querySelectorAll("p").forEach((el) => {
      if (!el.closest("blockquote")) {
        el.classList.add("text-muted", "leading-relaxed", "mb-6");
      }
    });

    // Style blockquotes
    this.container.querySelectorAll("blockquote").forEach((el) => {
      el.classList.add(
        "border-l-4",
        "border-primary-700",
        "pl-6",
        "py-4",
        "my-8",
        "bg-primary-50",
        "rounded-r-xl"
      );
      el.querySelectorAll("p").forEach((p) => {
        p.classList.add("text-xl", "text-dark", "italic", "mb-0");
      });
    });

    // Style unordered lists
    this.container.querySelectorAll("ul").forEach((el) => {
      el.classList.add(
        "list-disc",
        "list-inside",
        "space-y-2",
        "text-muted",
        "mb-6",
        "ml-4"
      );
    });

    // Style ordered lists
    this.container.querySelectorAll("ol").forEach((el) => {
      el.classList.add(
        "list-decimal",
        "list-inside",
        "space-y-3",
        "text-muted",
        "mb-6",
        "ml-4"
      );
    });

    // Style list items
    this.container.querySelectorAll("li").forEach((el) => {
      el.classList.add("text-muted", "leading-relaxed");
    });

    // Style strong/bold
    this.container.querySelectorAll("strong").forEach((el) => {
      el.classList.add("text-dark", "font-semibold");
    });

    // Style links
    this.container.querySelectorAll("a").forEach((el) => {
      el.classList.add("text-primary-700", "hover:underline");
    });

    // Style horizontal rules
    this.container.querySelectorAll("hr").forEach((el) => {
      el.classList.add("my-8", "border-gray-200");
    });

    // Style images - create gallery grid
    const images = this.container.querySelectorAll("img");
    if (images.length > 1) {
      // Group consecutive images into a gallery
      let currentGallery = null;
      images.forEach((img, index) => {
        const parent = img.parentElement;

        if (parent.tagName === "P") {
          if (
            !currentGallery ||
            parent.previousElementSibling !== currentGallery
          ) {
            currentGallery = document.createElement("div");
            currentGallery.classList.add(
              "grid",
              "grid-cols-2",
              "md:grid-cols-3",
              "gap-4",
              "my-8"
            );
            parent.parentNode.insertBefore(currentGallery, parent);
          }

          const wrapper = document.createElement("div");
          wrapper.classList.add(
            "relative",
            "group",
            "cursor-pointer",
            "overflow-hidden",
            "rounded-xl"
          );

          img.classList.add(
            "w-full",
            "h-40",
            "lg:h-48",
            "object-cover",
            "group-hover:scale-110",
            "transition-transform",
            "duration-500"
          );

          const overlay = document.createElement("div");
          overlay.classList.add(
            "absolute",
            "inset-0",
            "bg-dark/0",
            "group-hover:bg-dark/30",
            "transition-colors",
            "duration-300"
          );

          wrapper.appendChild(img.cloneNode(true));
          wrapper.appendChild(overlay);
          currentGallery.appendChild(wrapper);

          parent.remove();
        }
      });
    } else {
      // Single image styling
      images.forEach((img) => {
        img.classList.add("rounded-xl", "my-6", "w-full", "max-w-2xl");
      });
    }

    // Style emphasis/italic
    this.container.querySelectorAll("em").forEach((el) => {
      if (!el.closest("blockquote")) {
        el.classList.add("text-muted", "italic");
      }
    });
  }

  /**
   * Get the parsed metadata
   */
  getMetadata() {
    return this.metadata;
  }
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = FarmerStoryRenderer;
}
