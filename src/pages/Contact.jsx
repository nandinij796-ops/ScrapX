import "../contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>Have any questions? We'd love to hear from you.</p>

      <div className="contact-info">
        <p><strong>📞 Phone:</strong> +91 98765 43210</p>
        <p><strong>📧 Email:</strong> support@scrapx.com</p>
        <p><strong>📍 Address:</strong> Jaipur, Rajasthan, India</p>
      </div>

      <form className="contact-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="text" placeholder="Subject" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;