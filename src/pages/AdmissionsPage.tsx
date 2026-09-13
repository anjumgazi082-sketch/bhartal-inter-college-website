import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  FileText,
  Clock,
  Send,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { useSchool } from '../context/SchoolContext';

export const AdmissionsPage: React.FC = () => {
  const { settings } = useSchool();
  const [formData, setFormData] = useState({
    student_name: '',
    dob: '',
    class_applying: 'Class 9',
    parent_name: '',
    phone: '',
    email: '',
    address: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Validation
    if (!formData.student_name.trim()) {
      setErrorMessage('Please enter the student full name');
      return;
    }
    if (!formData.parent_name.trim()) {
      setErrorMessage('Please enter the parent or guardian name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      setErrorMessage('Please enter a valid contact phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await api.admissions.submit(formData);
      if (res.success) {
        setSuccessMessage(res.message || 'Admission enquiry submitted successfully! Reference ID: #' + res.id);
        setFormData({
          student_name: '',
          dob: '',
          class_applying: 'Class 9',
          parent_name: '',
          phone: '',
          email: '',
          address: '',
          message: '',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit enquiry';
      setErrorMessage(msg);
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
            <GraduationCap className="w-4 h-4" />
            <span>Admissions Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            Admission & Enquiries
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Join Bhartal Inter College. Review the admission process, eligibility guidelines, required documents, or submit an online enquiry below.
          </p>
        </div>
      </section>

      {/* Process & Eligibility & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Guidelines, Steps & Documents */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step-by-Step Process */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                Admission Procedure
              </h2>

              <ol className="space-y-4 text-xs sm:text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Obtain & Submit Application Form</strong>
                    <span>
                      Collect the official application form from the college administrative office or submit the online enquiry below.
                    </span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Verification of Documents</strong>
                    <span>
                      Submit academic records from the previous institution, transfer certificate (TC), and identity proof for verification.
                    </span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Student & Parent Interaction</strong>
                    <span>
                      Brief counseling session to discuss stream selection, academic expectations, and college discipline norms.
                    </span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong className="text-slate-900 block">Enrollment Confirmation</strong>
                    <span>
                      Completion of registration formalities and issuance of the student roll number and identity card.
                    </span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Required Documents */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-900" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                  Documents Required at Time of Admission
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Original Transfer Certificate (TC) from previous school</span>
                </div>
                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Marksheet / Report card of last qualifying exam</span>
                </div>
                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Copy of Student Aadhar Card & Parent ID</span>
                </div>
                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>4 Passport-sized recent color photographs</span>
                </div>
                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Birth Certificate (for age verification)</span>
                </div>
                <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Caste / Category certificate (if applicable)</span>
                </div>
              </div>
            </div>

            {/* Important Dates & Fees Notice */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Academic Session Schedule
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">
                  Demo Placeholder
                </span>
              </div>
              <p>
                Admissions for the upcoming academic session commence in April. Exact deadlines and fee structures
                are notified in official college circulars or can be confirmed directly with the college office.
              </p>
            </div>
          </div>

          {/* Right: Interactive Admission Enquiry Form */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md sticky top-24 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  <Send className="w-3.5 h-3.5" />
                  <span>Online Submission</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">Admission Enquiry Form</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill in your details and our admission desk will reach out with guidance and requirements.
                </p>
              </div>

              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Submission Received!</span>
                  </div>
                  <p>{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Student Name */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.student_name}
                    onChange={e => setFormData({ ...formData, student_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* DOB */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Class Applying For */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Class Applying For <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.class_applying}
                      onChange={e => setFormData({ ...formData, class_applying: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white"
                    >
                      <option value="Class 9">Class 9 (High School)</option>
                      <option value="Class 10">Class 10 (High School)</option>
                      <option value="Class 11 Science">Class 11 (Science Stream)</option>
                      <option value="Class 11 Arts">Class 11 (Arts / Humanities)</option>
                      <option value="Class 12 Science">Class 12 (Science Stream)</option>
                      <option value="Class 12 Arts">Class 12 (Arts / Humanities)</option>
                    </select>
                  </div>
                </div>

                {/* Parent / Guardian Name */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Parent / Guardian Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Father or Guardian Name"
                    value={formData.parent_name}
                    onChange={e => setFormData({ ...formData, parent_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Contact Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 90124 93127"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="optional@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                {/* Residential Address */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Residential Address / Village</label>
                  <input
                    type="text"
                    placeholder="Village / Town, Sirsi / Sambhal"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                {/* Queries / Message */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Message or Specific Query</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific questions regarding stream selection, transport, or timing..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="btn-submit-admission"
                  className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Enquiry...' : 'Submit Admission Enquiry'}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Your information is submitted directly to the Bhartal Inter College admissions office.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
