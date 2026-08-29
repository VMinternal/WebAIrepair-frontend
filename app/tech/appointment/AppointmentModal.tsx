'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';
import { appointmentService } from '@/services/appointment.service';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess: () => void;
}

// Interface quản lý trạng thái Alert Modal
interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: AppointmentModalProps) {
  const [techNotes, setTechNotes] = useState('');
  const [partInput, setPartInput] = useState('');
  const [usedParts, setUsedParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // State điều khiển Alert Modal thay cho window.alert
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Sync data from the passed-in appointment.
  useEffect(() => {
    if (appointment) {
      setTechNotes(appointment.techNotes || '');
      setUsedParts(appointment.usedParts || []);
    } else {
      setTechNotes('');
      setUsedParts([]);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  // Add components to the array
  const handleAddPart = () => {
    if (!partInput.trim()) return;
    if (!usedParts.includes(partInput.trim())) {
      setUsedParts([...usedParts, partInput.trim()]);
    }
    setPartInput('');
  };

  // Remove component from array
  const handleRemovePart = (indexToRemove: number) => {
    setUsedParts(usedParts.filter((_, index) => index !== indexToRemove));
  };

  // Submit Technical Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate data on the client side.
    if (!techNotes.trim()) {
      setAlertState({
        isOpen: true,
        title: 'Validation Warning',
        message: 'Technical notes must not be left blank.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);

    // Send API
    try {
      await appointmentService.updateReportByTech(appointment.id, {
        techNotes,
        usedParts,
      });

      setAlertState({
        isOpen: true,
        title: 'Success',
        message: 'Technical report successfully updated!',
        type: 'success',
      });
    } catch (error: any) {
      setAlertState({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'An error occurred while saving the report!',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle closing the alert modal
  const handleCloseAlert = () => {
    const isSuccess = alertState.type === 'success';
    setAlertState((prev) => ({ ...prev, isOpen: false }));

    // If saving is successful, execute the success trigger and close the main modal.
    if (isSuccess) {
      onSuccess();
      onClose();
    }
  };

  return (
    <>
      {/* --- MAIN MODAL --- */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col space-y-5 overflow-y-auto text-slate-100">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Repair Details & Report</h2>
              <p className="text-xs text-slate-400 mt-1">Order ID: {appointment.id}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Customer & Device Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-sm">
            <div>
              <p className="text-slate-400 text-xs">Customer</p>
              <p className="font-semibold text-white">{appointment.customerName}</p>
              <p className="text-slate-300">{appointment.phone}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Equipment requiring repair</p>
              <p className="font-semibold text-amber-400">
                {appointment.device?.model || 'Undetermined'}
              </p>
              <p className="text-slate-300">
                Error: {appointment.issueDescription || appointment.issue?.title || 'No description available.'}
              </p>
            </div>
          </div>

          {/* Technical Report Form */}
          <form onSubmit={handleSubmitReport} className="space-y-4">
            {/* Technical Note */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Technical Notes
              </label>
              <textarea
                rows={3}
                value={techNotes}
                onChange={(e) => setTechNotes(e.target.value)}
                placeholder="Enter the actual condition of the device, the steps taken..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            {/* Used components */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Replaced / used components
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={partInput}
                  onChange={(e) => setPartInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPart())}
                  placeholder="Enter the component name (e.g., iPhone 13 OLED screen) and click Add."
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Tags: parts */}
              <div className="flex flex-wrap gap-2 pt-1">
                {usedParts.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No part have been added yet.</span>
                ) : (
                  usedParts.map((part, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1.5 rounded-lg"
                    >
                      {part}
                      <button
                        type="button"
                        onClick={() => handleRemovePart(idx)}
                        className="hover:text-red-400 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
              >
                {loading ? 'Saving...' : 'Save report'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- CUSTOM ALERT MODAL (Thay thế window.alert) --- */}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
            
            {/* Icon theo từng loại thông báo */}
            <div
              className={`mx-auto w-12 h-12 rounded-full border flex items-center justify-center mb-4 ${
                alertState.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : alertState.type === 'error'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : alertState.type === 'warning'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {alertState.type === 'success' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {alertState.type === 'error' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {alertState.type === 'warning' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {alertState.type === 'info' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white tracking-tight">
              {alertState.title}
            </h3>

            {/* Message */}
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {alertState.message}
            </p>

            {/* Action Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCloseAlert}
                className={`w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-200 ${
                  alertState.type === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                    : alertState.type === 'error'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                    : alertState.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}