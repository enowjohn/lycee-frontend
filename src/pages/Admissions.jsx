import { useState, useEffect, useRef } from 'react';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  DownloadIcon,
  PrinterIcon,
  ArrowNarrowRightIcon,
  UploadIcon,
  TrashIcon,
  XIcon,
  MailIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import jsPDF from 'jspdf';
import { API_BASE_URL } from '../config/api';

// ------------------------------------------------------------------
// EDIT THESE with the school's real bank details before going live.
// The application number is used as the payment reference so the
// bank/accountant can match a deposit back to the correct applicant.
// ------------------------------------------------------------------
const BANK_NAME = 'REPLACE_WITH_BANK_NAME';
const BANK_ACCOUNT_NAME = 'REPLACE_WITH_ACCOUNT_NAME';
const BANK_ACCOUNT_NUMBER = 'REPLACE_WITH_ACCOUNT_NUMBER';

const STORAGE_KEY = 'obessa_admission_receipt';

// Public admissions contact used in the scholarship "Learn More" panel.
const SCHOOL_CONTACT_EMAIL = 'school@lycee-obessa.com';

// Accepted photo types/size for the applicant photo upload.
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const requirements = [
  'Completed application form',
  'Birth certificate',
  'Previous school reports',
  'Parent/guardian ID',
  'Passport-size photographs',
  'Medical certificate'
];

const feeStructure = [
  { level: 'Form 1-3', fee: '500,000 XAF' },
  { level: 'Form 4-5', fee: '550,000 XAF' },
  { level: 'Lower Sixth', fee: '600,000 XAF' },
  { level: 'Upper Sixth', fee: '650,000 XAF' }
];

// Best-effort match of the applicant's free-text class level to the fee table.
function findFeeForClass(classLevel) {
  if (!classLevel) return null;
  const normalized = classLevel.trim().toLowerCase();
  return (
    feeStructure.find(
      (item) =>
        normalized.includes(item.level.toLowerCase()) ||
        item.level.toLowerCase().includes(normalized)
    ) || null
  );
}

const emptyFormData = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  previous_school: '',
  parent_name: '',
  parent_phone: '',
  parent_email: '',
  address: '',
  stream_preference: 'english',
  class_level: '',
  amount_paid: ''
};

const Admissions = () => {
  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(false);

  // Holds the full record (form data + application_number + timestamp)
  // once an application has been submitted. Restored from localStorage
  // on load so a page refresh doesn't lose the receipt.
  const [receipt, setReceipt] = useState(null);

  // Applicant photo: the actual File (sent to the server) plus a
  // base64 preview (shown on screen, saved to the receipt, and
  // embedded in the PDF).
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [showScholarshipInfo, setShowScholarshipInfo] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setReceipt(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Could not read saved admission receipt:', err);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WEBP image.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      toast.error('Photo must be smaller than 5MB.');
      e.target.value = '';
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submission = new FormData();
      Object.entries(formData).forEach(([key, value]) => submission.append(key, value));
      if (photoFile) {
        submission.append('photo', photoFile);
      }

      const response = await axios.post(`${API_BASE_URL}/api/applications`, submission);

      const newReceipt = {
        ...formData,
        application_number: response.data.application_number,
        photo_url: response.data.photo_url || null,
        photoDataUrl: photoPreview || null,
        submitted_at: new Date().toISOString()
      };

      setReceipt(newReceipt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReceipt));

      toast.success('Application submitted successfully!');
      setFormData(emptyFormData);
      handleRemovePhoto();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    localStorage.removeItem(STORAGE_KEY);
    setReceipt(null);
    setFormData(emptyFormData);
    handleRemovePhoto();
  };

  const handleDeleteApplication = async () => {
    if (!receipt) return;

    const confirmed = window.confirm(
      `Delete application ${receipt.application_number}? This permanently removes it from our records and cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/applications/${receipt.application_number}`);
      toast.success('Application deleted. You can now submit a new one.');
      localStorage.removeItem(STORAGE_KEY);
      setReceipt(null);
      setFormData(emptyFormData);
      handleRemovePhoto();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not delete the application. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const checkStatus = async () => {
    const appNumber = prompt('Enter your application number:');
    if (appNumber) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/applications/${appNumber}`);
        alert(`Application Status: ${response.data.status}`);
      } catch (error) {
        toast.error('Application not found');
      }
    }
  };

  const generatePdf = (record) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    let y = 60;

    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Lycée Bilingue Obessa', pageWidth / 2, y, { align: 'center' });
    y += 22;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Admission Application Receipt', pageWidth / 2, y, { align: 'center' });
    y += 30;

    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    // Application number, prominent
    doc.setFontSize(11);
    doc.setTextColor(90);
    doc.text('APPLICATION NUMBER', margin, y);
    y += 20;
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(20);
    doc.text(record.application_number, margin, y);
    y += 30;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Submitted: ${new Date(record.submitted_at).toLocaleString()}`, margin, y);
    y += 20;

    // Applicant photo, top-right, if one was uploaded
    const photoWidth = 90;
    const photoHeight = 110;
    let detailsStartY = y;
    if (record.photoDataUrl) {
      try {
        const format = record.photoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        doc.addImage(
          record.photoDataUrl,
          format,
          pageWidth - margin - photoWidth,
          y,
          photoWidth,
          photoHeight
        );
        doc.setDrawColor(200);
        doc.rect(pageWidth - margin - photoWidth, y, photoWidth, photoHeight);
      } catch (imgErr) {
        console.error('Could not embed photo in PDF:', imgErr);
      }
    }
    y += 10;

    // Applicant details
    const rows = [
      ['First Name', record.first_name],
      ['Last Name', record.last_name],
      ['Date of Birth', record.date_of_birth],
      ['Gender', record.gender],
      ['Previous School', record.previous_school || '—'],
      ['Stream Preference', record.stream_preference],
      ['Class Level', record.class_level],
      ['Parent/Guardian Name', record.parent_name],
      ['Parent Phone', record.parent_phone],
      ['Parent Email', record.parent_email],
      ['Address', record.address],
      ['Amount Already Paid', record.amount_paid ? `${record.amount_paid} XAF` : 'None recorded']
    ];

    doc.setFontSize(11);
    rows.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.setTextColor(60);
      doc.text(`${label}:`, margin, y);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(20);
      const wrapped = doc.splitTextToSize(String(value || '—'), pageWidth - margin * 2 - 160);
      doc.text(wrapped, margin + 160, y);
      y += Math.max(16, wrapped.length * 14);
    });

    y += 10;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    // Fee / payment section
    const matchedFee = findFeeForClass(record.class_level);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(20);
    doc.text('Payment Instructions', margin, y);
    y += 22;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    doc.text('Pay your tuition fee at the bank below, using the application number', margin, y);
    y += 14;
    doc.text('shown above as the payment reference so it is matched to your record:', margin, y);
    y += 26;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text(`Bank: ${BANK_NAME}`, margin, y);
    y += 16;
    doc.text(`Account Name: ${BANK_ACCOUNT_NAME}`, margin, y);
    y += 16;
    doc.text(`Account Number: ${BANK_ACCOUNT_NUMBER}`, margin, y);
    y += 26;

    if (matchedFee) {
      doc.text(`Amount Due (${matchedFee.level}): ${matchedFee.fee}`, margin, y);
      y += 26;
    }

    // Highlighted reference number box with an arrow pointing at it
    doc.setFillColor(255, 247, 220);
    doc.setDrawColor(230, 180, 60);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 46, 6, 6, 'FD');
    doc.setFontSize(10);
    doc.setTextColor(120, 90, 10);
    doc.setFont(undefined, 'normal');
    doc.text('PAYMENT REFERENCE →', margin + 14, y + 28);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(20);
    doc.text(record.application_number, margin + 170, y + 30);

    doc.save(`Admission_Receipt_${record.application_number}.pdf`);
  };

  const matchedFee = receipt ? findFeeForClass(receipt.class_level) : null;

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Admissions
          </h1>
          <p className="text-xl text-blue-100">
            Join Our Community of Excellence
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Application Form / Receipt */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Online Application</h2>

            {receipt ? (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="flex items-start bg-green-50 border border-green-200 rounded-xl p-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800">Application Submitted!</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Keep this page or the downloaded PDF for your records.
                    </p>
                  </div>
                </div>

                {/* Applicant summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Applicant Details
                  </h4>
                  {receipt.photoDataUrl && (
                    <img
                      src={receipt.photoDataUrl}
                      alt={`${receipt.first_name} ${receipt.last_name}`}
                      className="h-24 w-24 object-cover rounded-lg border border-gray-300 mb-4"
                    />
                  )}
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Name</dt>
                      <dd className="text-gray-800 font-medium">
                        {receipt.first_name} {receipt.last_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Date of Birth</dt>
                      <dd className="text-gray-800 font-medium">{receipt.date_of_birth}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Stream</dt>
                      <dd className="text-gray-800 font-medium capitalize">{receipt.stream_preference}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Class Level</dt>
                      <dd className="text-gray-800 font-medium">{receipt.class_level}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Parent/Guardian</dt>
                      <dd className="text-gray-800 font-medium">{receipt.parent_name}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Submitted</dt>
                      <dd className="text-gray-800 font-medium">
                        {new Date(receipt.submitted_at).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Payment reference, highlighted with arrow */}
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                  <p className="text-sm text-amber-800 mb-2">
                    Pay your tuition fee at the bank using this number as your{' '}
                    <strong>payment reference</strong>:
                  </p>
                  <div className="flex items-center">
                    <ArrowNarrowRightIcon className="h-6 w-6 text-amber-600 mr-2 flex-shrink-0" />
                    <span className="text-2xl font-bold text-amber-900 tracking-wide">
                      {receipt.application_number}
                    </span>
                  </div>
                  {matchedFee && (
                    <p className="text-sm text-amber-800 mt-2">
                      Amount due for {matchedFee.level}: <strong>{matchedFee.fee}</strong>
                    </p>
                  )}
                  {receipt.amount_paid && (
                    <p className="text-sm text-amber-800 mt-1">
                      Amount already paid: <strong>{receipt.amount_paid} XAF</strong>
                    </p>
                  )}
                  <p className="text-xs text-amber-700 mt-2">
                    Bank details are on your downloadable PDF receipt.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => generatePdf(receipt)}
                    className="flex-1 flex items-center justify-center py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold"
                  >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download Receipt (PDF)
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    <PrinterIcon className="h-5 w-5 mr-2" />
                    Print This Page
                  </button>
                </div>

                <button
                  onClick={handleStartNew}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Submit a different application
                </button>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Made a mistake during registration? You can permanently delete this
                    application and start over.
                  </p>
                  <button
                    onClick={handleDeleteApplication}
                    disabled={deleting}
                    className="w-full flex items-center justify-center py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {deleting ? 'Deleting...' : 'Delete This Application'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      required
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
                    <input
                      type="text"
                      name="previous_school"
                      value={formData.previous_school}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stream Preference</label>
                    <select
                      name="stream_preference"
                      required
                      value={formData.stream_preference}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="english">English</option>
                      <option value="french">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                    <input
                      type="text"
                      name="class_level"
                      required
                      value={formData.class_level}
                      onChange={handleChange}
                      placeholder="e.g., Form 1, 6ème"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                    <input
                      type="text"
                      name="parent_name"
                      required
                      value={formData.parent_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                    <input
                      type="tel"
                      name="parent_phone"
                      required
                      value={formData.parent_phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                    <input
                      type="email"
                      name="parent_email"
                      required
                      value={formData.parent_email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Already Paid (XAF) <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="number"
                      name="amount_paid"
                      min="0"
                      step="1"
                      value={formData.amount_paid}
                      onChange={handleChange}
                      placeholder="e.g., 100000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      If you have already made a deposit towards the fee, enter the amount here.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Photo <span className="text-gray-400 font-normal">(optional)</span>
                    </label>

                    {photoPreview ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={photoPreview}
                          alt="Student preview"
                          className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="flex items-center px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload a passport-size photo</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP, up to 5MB</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}

            <button
              onClick={checkStatus}
              className="w-full mt-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
              Check Application Status
            </button>
          </div>

          {/* Requirements & Fees */}
          <div className="space-y-8">
            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AcademicCapIcon className="h-6 w-6 text-blue-800 mr-2" />
                Requirements
              </h3>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee Structure */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Fee Structure</h3>
              <div className="space-y-3">
                {feeStructure.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">{item.level}</span>
                    <span className="font-semibold text-blue-800">{item.fee}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Fees are per academic year and subject to change
              </p>
            </div>

            {/* Scholarships */}
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Scholarships Available</h3>
              <p className="text-gray-700 mb-4">
                We offer merit-based scholarships to outstanding students. Contact our admissions office for more information.
              </p>
              <button
                onClick={() => setShowScholarshipInfo(true)}
                className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarship info modal */}
      {showScholarshipInfo && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setShowScholarshipInfo(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowScholarshipInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Merit-Based Scholarships</h3>
            <p className="text-gray-700 mb-4">
              Lycée Bilingue Obessa awards merit-based scholarships each academic year to
              outstanding students. Awards are considered based on:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Overall academic performance in the previous school year',
                'Performance in the entrance assessment',
                'Extracurricular achievement (sports, arts, leadership)',
                'Demonstrated financial need, where applicable'
              ].map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 text-sm mb-4">
              Scholarship applications are reviewed after your admission application is
              submitted. There is no separate form — simply mention your interest in a
              scholarship when contacting the admissions office below.
            </p>

            <a
              href={`mailto:${SCHOOL_CONTACT_EMAIL}?subject=Scholarship%20Inquiry`}
              className="flex items-center justify-center w-full py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
            >
              <MailIcon className="h-5 w-5 mr-2" />
              Email Admissions Office
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;