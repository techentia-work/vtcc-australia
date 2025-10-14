"use client";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-white text-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Google Map */}
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.141893383126!2d145.2144852756837!3d-37.9876793718971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad63a2fef2d8c6d%3A0x5db8e6bde1c8f2!2sVictorian%20Tamil%20Community%20Centre!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Right - Contact Info */}
          <div className="text-lg leading-relaxed">
            <p className="mb-6">
              <strong>Opening times for customer tours and inquiries:</strong>
              <br />– Tuesday & Thursday : 4.30pm to 6.30pm
              <br />– Saturday: 10.00am to 12.30pm
            </p>

            <p className="mb-6">
              40 Lonsdale Street, Dandenong <br />
              Victoria 3175 <br />
              (Corner of Quinn St and Lonsdale St)
            </p>

            <p>
              Phone:{" "}
              <a href="tel:0389006498" className="text-blue-600 hover:underline">
                03 8900 6498
              </a>
              <br />
              Mobile:{" "}
              <a href="tel:0451480410" className="text-blue-600 hover:underline">
                0451 480 410
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;