import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-8 lg:px-12 lg:py-6 bg-black">
      <div className="flex flex-col lg:flex-row w-full justify-between items-start lg:items-center border-b border-white/20 pb-8 gap-6">
        <div className="flex flex-col gap-3 sm:gap-6 max-w-full lg:max-w-[500px]">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Subscribe To Our News letter
          </h3>
          <p className="text-white text-xs sm:text-sm lg:text-base leading-relaxed">
            Sign up today Writing copy is time-consuming and difficult.
            Headlime&apos;s artificial intelligence can take your thoughts.
          </p>
        </div>
        <div className="flex flex-col w-full sm:flex-row lg:w-[450px] rounded-lg sm:rounded-full overflow-hidden bg-white py-3 px-4 sm:py-2 sm:px-2 gap-3 sm:gap-0">
          <input
            type="text"
            placeholder="Enter email address"
            className="flex-1 rounded-md sm:rounded-l-full px-3 sm:px-4 focus:outline-0 border-0 text-xs sm:text-sm lg:text-base py-2 sm:py-0"
          />
          <button className="bg-[#39A116] py-2 sm:py-3 px-4 sm:px-4 lg:px-6 text-white text-xs sm:text-sm lg:text-base font-bold rounded-md sm:rounded-full hover:bg-[#2d8011] transition-colors duration-300 whitespace-nowrap">
            Get Listed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 w-full py-8 text-white gap-8 lg:gap-4">
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
          <Image
            src="/assets/logo.png"
            alt="Farm Commerce"
            width={72}
            height={72}
            className="object-contain hover:opacity-80 transition-opacity duration-300"
          />
          <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
            Fresh organic groceries from local Nepali farms, delivered to your door.
          </p>
        </div>
        <div className="col-span-1">
          <h4 className="text-xl lg:text-2xl font-semibold mb-4">INFO</h4>
          <ul className="flex flex-col gap-2 text-base lg:text-lg text-gray-400">
            {["About Us", "Blog", "Contact Us", "FAQs"].map((item) => (
              <li key={item}>
                <Link
                  href={item === "About Us" ? "/about" : item === "Blog" ? "/blogs" : item === "Contact Us" ? "/contact" : "#"}
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="text-xl lg:text-2xl font-semibold mb-4">About us</h4>
          <ul className="flex flex-col gap-2 text-base lg:text-lg text-gray-400">
            {[
              { label: "Gallery", href: "/gallery" },
              { label: "Technologies", href: "#" },
              { label: "Contacts", href: "/contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-xl lg:text-2xl font-semibold mb-4">Contact us</h4>
          <ul className="flex flex-col gap-2 text-base lg:text-lg text-gray-400">
            <li>
              <a
                href="tel:+19999999999"
                className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
              >
                +1 (999) 999-99-99
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@farmcommerce.com"
                className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
              >
                hello@farmcommerce.com
              </a>
            </li>
            <li>
              <span className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300 cursor-default">
                Kathmandu, Nepal
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center w-full justify-between gap-6 pt-6 border-t border-white/20">
        <div className="flex items-center gap-3">
          {["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube"].map((platform) => (
            <a
              key={platform}
              href="#"
              className="p-2.5 flex items-center justify-center border-2 border-gray-600 rounded-full hover:border-white hover:bg-white hover:scale-110 transition-all duration-300 group"
            >
              <Image
                src="/assets/Homepage/fb.svg"
                alt={platform}
                width={16}
                height={16}
                className="group-hover:brightness-0"
              />
            </a>
          ))}
        </div>
        <p className="text-gray-400 text-sm lg:text-base">© 2025 — Farm Commerce</p>
      </div>
    </footer>
  );
}
