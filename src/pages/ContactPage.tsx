import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  School,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const { settings } = useSchool();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill in your name, contact phone, and message.');
      return;
    }

    setLoading(true);
    try {
      // Re-use admission/contact enquiry endpoint
      await api.admissions.submit({
        student_name: formData.name,
        parent_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        class_applying: `Contact Form: ${formData.subject}`,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'General Enquiry',
        message: '',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Phone className="w-4 h-4" />
            <span>Connect with College</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            Contact & Campus Location
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Reach out to Bhartal Inter College. Find campus directions, office contact numbers, visiting hours, or submit a message.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Official Contact Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-serif border-b border-slate-100 pb-3">
                Official Contact Information
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Institution */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">School Name</span>
                    <span className="text-slate-600 font-medium">{settings.school_name}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Campus Address</span>
                    <span className="text-slate-600 leading-relaxed block">{settings.address}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Hasanpur Road, Bhartal (Sirsi), District Sambhal, Uttar Pradesh, India
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Official Telephone</span>
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-blue-900 hover:text-blue-700 font-semibold text-sm"
                    >
                      {settings.phone}
                    </a>
                    <span className="text-[11px] text-slate-400 block">Office telephone & admission desk</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Official Email Address</span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-blue-900 hover:text-blue-700 font-semibold text-sm break-all"
                    >
                      {settings.email}
                    </a>
                    <span className="text-[11px] text-slate-400 block">General administrative queries</span>
                  </div>
                </div>

                {/* Office Timings */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Administrative Office Hours</span>
                    <span className="text-slate-700 font-medium">{settings.office_hours?.timings || '08:00 AM - 02:00 PM'}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {settings.office_hours?.days || 'Monday to Saturday'} ({settings.office_hours?.closed || 'Closed on Sundays & Gazetted Holidays'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder / Coordinates */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-bold text-slate-900">Campus Location Map</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Bhartal+Sirsi+Sambhal+Uttar+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map embed / visual container */}
              <div className="h-64 bg-slate-200 relative flex items-center justify-center text-center p-6">
                <div className="bg-white/95 backdrop-blur-xs p-5 rounded-xl border border-slate-300 shadow-md max-w-sm space-y-2">
                  <MapPin className="w-7 h-7 text-amber-600 mx-auto" />
                  <h3 className="font-bold text-slate-900 text-xs">Bhartal Inter College</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Hasanpur Road, Bhartal, Sirsi, District Sambhal, Uttar Pradesh
                  </p>
                  <a
                    href="https://maps.google.com/?q=Bhartal+Sirsi+Sambhal+Uttar+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1.5 rounded bg-blue-900 text-white text-[11px] font-bold"
                  >
                    View Satellite Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message & Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Direct Communication</span>
                <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">Send a Message</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Have a question about admissions, staff, or examinations? Leave your inquiry below.
                </p>
              </div>

              {success && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Message Sent Successfully</span>
                  </div>
                  <p>Thank you for contacting Bhartal Inter College. We will attend to your inquiry promptly.</p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 90124 93127"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject of Inquiry</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="General Enquiry">General Information</option>
                    <option value="Admissions">Admissions & Eligibility</option>
                    <option value="Examinations & Results">Examinations & Marksheets</option>
                    <option value="Faculty & Academic Guidance">Faculty & Academic Guidance</option>
                    <option value="Transfer Certificate / TC">Transfer Certificate (TC) Request</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="btn-submit-contact-form"
                  className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Message...' : 'Send Message to College'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
