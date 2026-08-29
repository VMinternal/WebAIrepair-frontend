'use client';

import { useAdminAppointments } from './useAdminAppointments';
import AdminAppointmentModal from './AdminAppointmentModal';
import { Appointment, AppointmentStatus } from '@/types/appointment';

export default function AdminAppointmentsPage() {
  const {
    appointments,
    meta,
    loading,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    selectedAppointment,
    setSelectedAppointment,
    handleSearch,
    handleResetSearch,
    handleDeleteAppointment,
    refreshData,
  } = useAdminAppointments();

  const handleOpenModal = (job: Appointment) => {
    setSelectedAppointment(job);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Appointment Management (Admin)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track all repair appointments and assign tasks or update system status.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone number..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter Dropdown for Admins */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'ALL')}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="ALL">All statuses</option>
          <option value={AppointmentStatus.PENDING}>Awaiting acceptance (PENDING)</option>
          <option value={AppointmentStatus.ASSIGNED}>Assigned (ASSIGNED)</option>
          <option value={AppointmentStatus.IN_PROGRESS}>Under repair (IN_PROGRESS)</option>
          <option value={AppointmentStatus.WAITING_PARTS}>Waiting for parts (WAITING_PARTS)</option>
          <option value={AppointmentStatus.COMPLETED}>Completed (COMPLETED)</option>
          <option value={AppointmentStatus.CANCELLED}>Cancelled (CANCELLED)</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md shadow-blue-600/20"
        >
          Search
        </button>
        {(searchQuery || statusFilter !== 'ALL') && (
          <button
            type="button"
            onClick={handleResetSearch}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-700"
          >
            Clear filters
          </button>
        )}
      </form>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading appointment list...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 font-medium">No appointments found.</p>
        </div>
      ) : (
        /* List / Grid Render */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Header Card Status */}
                <div className="flex justify-between items-start gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      job.status === AppointmentStatus.PENDING
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : job.status === AppointmentStatus.IN_PROGRESS
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : job.status === AppointmentStatus.COMPLETED
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : job.status === AppointmentStatus.CANCELLED
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}
                  >
                    {job.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </span>
                </div>

                {/* Main Content */}
                <div>
                  <h3 className="text-lg font-bold text-white transition-colors">
                    {job.customerName}
                  </h3>
                  <p className="text-sm text-slate-400 font-mono mt-0.5">{job.phone}</p>
                </div>

                <div className="space-y-1 text-sm bg-slate-800/40 p-3 rounded-xl border border-slate-800/80">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Device:</span>{' '}
                    <strong className="text-amber-400 font-medium">
                      {job.device?.model || 'Undetermined'}
                    </strong>
                  </p>
                  <p className="text-slate-300 line-clamp-2">
                    <span className="text-slate-400">Error description:</span>{' '}
                    {job.issueDescription || job.issue?.title || 'No notes'}
                  </p>
                </div>

                {/* Technician Notes / Parts */}
                {(job.techNotes || (job.usedParts && job.usedParts.length > 0)) && (
                  <div className="text-xs space-y-1 bg-slate-800/20 p-2.5 rounded-lg border border-slate-800">
                    {job.techNotes && (
                      <p className="text-slate-400 italic">
                        <strong className="text-slate-300 not-italic">Technician's Note:</strong>{' '}
                        {job.techNotes}
                      </p>
                    )}
                    {job.usedParts && job.usedParts.length > 0 && (
                      <p className="text-slate-400">
                        <strong className="text-slate-300">Accessory:</strong>{' '}
                        {job.usedParts.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons for Admins */}
              <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenModal(job)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 rounded-lg transition-colors shadow-md shadow-blue-600/20"
                >
                  Details & Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAppointment(job.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6 text-sm">
          <p className="text-slate-400">
            Page <span className="text-white font-medium">{meta.currentPage}</span> of{' '}
            {meta.totalPages} ({meta.totalItems} total items)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={meta.currentPage <= 1}
              onClick={() => refreshData(meta.currentPage - 1)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg border border-slate-700 text-xs transition-colors"
            >
              Previous page
            </button>
            <button
              type="button"
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => refreshData(meta.currentPage + 1)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg border border-slate-700 text-xs transition-colors"
            >
              Next page
            </button>
          </div>
        </div>
      )}

      {/* Admin Appointment Modal */}
      <AdminAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onSuccess={refreshData}
      />
    </div>
  );
}