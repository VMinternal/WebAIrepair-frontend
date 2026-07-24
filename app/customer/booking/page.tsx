'use client';

import { useState } from 'react';

export default function BookingPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceType, setDeviceType] = useState('Laptop');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Gọi API sang NestJS (cổng 8000)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          phone,
          deviceType,
          description,
        }),
      });

      if (res.ok) {
        setMessage('🎉 Appointment booked successfully! A technician will contact you shortly.');
        // Reset form
        setCustomerName('');
        setPhone('');
        setDescription('');
      } else {
        setMessage('❌ An error occurred. Please try again!');
      }
    } catch (error) {
      setMessage('❌ Unable to connect to the server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Schedule a Repair Appointment</h1>
        <p className="text-slate-400 mt-1">Please fill in the information about the device that needs repair in the form below.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Customer name</label>
            <input
              type="text"
              required
              placeholder="For example: Nguyen Van A"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Phone number</label>
            <input
              type="tel"
              required
              placeholder="For example: 0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Type of device */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Type of device needs repair</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            >
              <option value="Phone">Cellular phone</option>
            </select>
          </div>

          {/* Error description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Provide a detailed description of the error.</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the malfunction (e.g., won't power on, screen has blue lines...)."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
            />
          </div>

          {/*Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-lg transition duration-200"
          >
            {loading ? 'Sending information...' : 'Submitting Appointment Request 🛠️'}
          </button>
        </form>

        {/* Status notification */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg text-sm text-center font-medium ${
            message.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}