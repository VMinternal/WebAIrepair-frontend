'use client';

import { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { appointmentService } from '@/services/appointment.service';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess: () => void;
}

export default function AdminAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: AppointmentModalProps) {
  const [techNotes, setTechNotes] = useState('');
  const [partInput, setPartInput] = useState('');
  const [usedParts, setUsedParts] = useState<string[]>([]);
  const [status, setStatus] = useState<AppointmentStatus>(AppointmentStatus.PENDING);
  const [loading, setLoading] = useState(false);

  // Sync data from the passed-in appointment.
  useEffect(() => {
    if (appointment) {
      setTechNotes(appointment.techNotes || '');
      setUsedParts(appointment.usedParts || []);
      setStatus(appointment.status || AppointmentStatus.PENDING);
    } else {
      setTechNotes('');
      setUsedParts([]);
      setStatus(AppointmentStatus.PENDING);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleAddPart = () => {
    if (!partInput.trim()) return;
    if (!usedParts.includes(partInput.trim())) {
      setUsedParts([...usedParts, partInput.trim()]);
    }
    setPartInput('');
  };

  const handleRemovePart = (indexToRemove: number) => {
    setUsedParts(usedParts.filter((_, index) => index !== indexToRemove));
  };

  // Submit data updates for administrators
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the Admin's general update API (instead of the Tech team's API).
      await appointmentService.updateStatusByTech(appointment.id, {
        techNotes,
        usedParts,
        status,
      });
      alert('Appointment successfully updated!');
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'An error occurred during the update.!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col space-y-5 overflow-y-auto text-slate-100">

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Manage & Edit Appointments (Admin)</h2>
            <p className="text-xs text-slate-400 mt-1">Order ID: {appointment.id}</p>
          </div>
          <button
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
            <p className="text-slate-400 text-xs">Devices & Errors</p>
            <p className="font-semibold text-amber-400">
              {appointment.device?.model || 'Undetermined'}
            </p>
            <p className="text-slate-300">
              Lỗi: {appointment.issueDescription || appointment.issue?.title || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Admin Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Update Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              Order status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value={AppointmentStatus.PENDING}>Awaiting acceptance (PENDING)</option>
              <option value={AppointmentStatus.ASSIGNED}>Assigned</option>
              <option value={AppointmentStatus.IN_PROGRESS}>Under repair (IN_PROGRESS)</option>
              <option value={AppointmentStatus.WAITING_PARTS}>Waiting for parts (WAITING_PARTS)</option>
              <option value={AppointmentStatus.COMPLETED}>Completed (COMPLETED)</option>
              <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          {/* Technical Note */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              Technical Note
            </label>
            <textarea
              rows={3}
              value={techNotes}
              onChange={(e) => setTechNotes(e.target.value)}
              placeholder="Enter notes on device status or repair progress..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          {/* Used components */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Replacement / service parts
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={partInput}
                onChange={(e) => setPartInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPart())}
                placeholder="Enter the component name, then click Add..."
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

            <div className="flex flex-wrap gap-2 pt-1">
              {usedParts.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No Parts have been added yet.</span>
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

          {/* Modal Actions */}
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
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}