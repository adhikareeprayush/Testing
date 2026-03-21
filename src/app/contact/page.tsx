export default function ContactPage() {
  return (
    <div className="px-6 lg:px-12 py-8 flex flex-col gap-12 2xl:max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-dark">
          Get In <span className="text-primary-700">Touch</span>
        </h1>
        <p className="text-center text-muted max-w-2xl">
          Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-primary-700">Contact Details</h2>
          {[
            { icon: "📍", title: "Address", value: "Thamel, Kathmandu, Nepal" },
            { icon: "📞", title: "Phone", value: "+977-1-4123456" },
            { icon: "✉️", title: "Email", value: "hello@farmcommerce.com" },
            { icon: "🕒", title: "Hours", value: "Mon–Sat: 8am – 8pm" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-primary-700 text-sm">{item.title}</h4>
                <p className="text-dark mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}

          {/* Social links */}
          <div className="p-4 bg-primary-700 rounded-2xl flex flex-col gap-3">
            <h4 className="text-white font-semibold">Follow Us</h4>
            <div className="flex gap-3 flex-wrap">
              {["Facebook", "Instagram", "Twitter", "YouTube"].map((s) => (
                <a key={s} href="#"
                  className="text-xs bg-white/20 hover:bg-white hover:text-primary-700 text-white px-3 py-1.5 rounded-full transition-all font-medium">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-primary-700">Send a Message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Your Name", type: "text", placeholder: "John Doe" },
              { label: "Email Address", type: "email", placeholder: "john@example.com" },
              { label: "Phone Number", type: "tel", placeholder: "+977 98XXXXXXXX" },
              { label: "Subject", type: "text", placeholder: "How can we help?" },
            ].map((field) => (
              <div key={field.label} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-dark">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-dark">Message</label>
            <textarea
              rows={5}
              placeholder="Your message..."
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
            />
          </div>
          <button className="bg-primary-700 text-white py-3.5 px-8 rounded-xl font-bold text-base hover:bg-primary-800 transition-colors w-fit">
            Send Message →
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-[300px] bg-primary-50 border-2 border-primary-100 rounded-2xl flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">📍</span>
        <p className="text-primary-700 font-semibold text-lg">Thamel, Kathmandu, Nepal</p>
        <p className="text-muted text-sm">Interactive map coming soon</p>
      </div>
    </div>
  );
}
