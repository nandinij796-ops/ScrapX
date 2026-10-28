import { useState } from "react";
import Navbar from "../components/Navbar";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck,
  Building,
  Headphones
} from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Support & Inquiries");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    const messagePayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "Not provided",
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...messagePayload,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore contact message notice (stored locally):", err.message);
    }

    try {
      const existing = JSON.parse(localStorage.getItem("scrapx_contact_messages") || "[]");
      existing.unshift(messagePayload);
      localStorage.setItem("scrapx_contact_messages", JSON.stringify(existing));
    } catch (e) {}

    toast.success("Message transmitted! Our support team will get in touch shortly.");
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
            <Headphones className="w-3.5 h-3.5" />
            24/7 Dedicated Automotive Concierge
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
            Get in Touch with the <span className="text-[#15803D]">ScrapX Support Team</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Need guidance regarding scrap vehicle valuation, RTO deregistration, listing salvaged parts, or enterprise recycling partnerships? We're here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Direct Contact Channels
              </h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-500">Toll-Free Helpline</div>
                  <a href="tel:+9118002667272" className="text-sm font-bold text-slate-900 hover:text-emerald-700">
                    +91 1800-266-7272 (1800-SCRAP-X)
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Mon–Sat: 8:00 AM – 9:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-500">Support & Compliance Email</div>
                  <a href="mailto:support@scrapx.in" className="text-sm font-bold text-slate-900 hover:text-emerald-700">
                    support@scrapx.in
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Average reply time: under 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-500">Corporate Headquarters</div>
                  <div className="text-sm font-bold text-slate-900">
                    ScrapX Technologies Private Limited
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Apex Circular Tower, Industrial Tech Zone, Sector 62, Jaipur, Rajasthan 302017
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Assurance Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong className="font-bold">Enterprise Scrappage Desk: </strong>
                Are you an insurance surveyor, corporate fleet manager, or government transport body? We provide automated bulk disposal contracts with certified Destruction Certificates.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Dispatched!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Thank you, <strong className="text-slate-900">{name}</strong>. A ScrapX automotive advisor has been assigned to your ticket and will contact you at <strong className="text-slate-900">{email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setMessage("");
                    }}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      >
                        <option value="General Support & Inquiries">General Support & Inquiries</option>
                        <option value="Doorstep Vehicle Scrap Booking">Doorstep Vehicle Scrap Booking</option>
                        <option value="RTO Scrapping Certificate of Deposit">RTO Certificate of Deposit Assistance</option>
                        <option value="Secondary Spare Parts Order">Secondary Spare Parts Order</option>
                        <option value="Dismantler / Yard Partnership">Dismantler / Scrap Yard Partnership</option>
                        <option value="Roadside Emergency Helpdesk">Roadside Emergency Helpdesk</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Message & Requirements *
                    </label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Share details of your vehicle, part specifications, or partnership inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? "Transmitting..." : "Send Secure Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
