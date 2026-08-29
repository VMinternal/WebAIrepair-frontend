'use client';

import { useTechAppointments } from './useTechAppointments';
import AppointmentModal from './AppointmentModal';
import { Appointment, AppointmentStatus } from '@/types/appointment';

export default function TechAppointmentsPage() {
  const {
    activeTab,
    setActiveTab,
    availableJobs,
    myJobs,
    meta,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedAppointment,
    setSelectedAppointment,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleResetSearch,
    handleClaimJob,
    handleUpdateStatus,
    refreshData,
  } = useTechAppointments();

  const currentJobs = activeTab === 'AVAILABLE' ? availableJobs : myJobs;

  const handleOpenReportModal = (job: Appointment) => {
    setSelectedAppointment(job);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 min-h-screen">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Technical Appointment Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor available jobs and manage your assigned repair tasks.
          </p>
        </div>

        <div className="flex gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50">
          <button
            type="button"
            onClick={() => setActiveTab('AVAILABLE')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'AVAILABLE'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            Job Market (Pending)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MY_JOBS')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'MY_JOBS'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            My Assigned Jobs
          </button>
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
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md shadow-blue-600/20"
        >
          Search
        </button>
        {searchQuery && (
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
          <p className="text-sm font-medium">Loading task list...</p>
        </div>
      ) : currentJobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 font-medium">
            {activeTab === 'AVAILABLE'
              ? 'There are currently no jobs waiting to be claimed.'
              : 'You have not accepted any tasks yet.'}
          </p>
        </div>
      ) : (
        /* List / Grid Render */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentJobs.map((job) => (
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
                        : job.status === AppointmentStatus.ASSIGNED
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : job.status === AppointmentStatus.IN_PROGRESS
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : job.status === AppointmentStatus.COMPLETED
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {job.status === AppointmentStatus.PENDING && 'Pending Claim'}
                    {job.status === AppointmentStatus.ASSIGNED && 'Order Assigned'}
                    {job.status === AppointmentStatus.IN_PROGRESS && 'Under Repair'}
                    {job.status === AppointmentStatus.COMPLETED && 'Completed'}
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
                    <span className="text-slate-400">Issue:</span>{' '}
                    {job.issueDescription || job.issue?.title || 'No notes available'}
                  </p>
                </div>

                {/* Tech notes / Parts used (if any) */}
                {activeTab === 'MY_JOBS' && (job.techNotes || (job.usedParts && job.usedParts.length > 0)) && (
                  <div className="text-xs space-y-1 bg-slate-800/20 p-2.5 rounded-lg border border-slate-800">
                    {job.techNotes && (
                      <p className="text-slate-400 italic">
                        <strong className="text-slate-300 not-italic">Tech Note:</strong>{' '}
                        {job.techNotes}
                      </p>
                    )}
                    {job.usedParts && job.usedParts.length > 0 && (
                      <p className="text-slate-400">
                        <strong className="text-slate-300">Parts Used:</strong>{' '}
                        {job.usedParts.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                {activeTab === 'AVAILABLE' ? (
                  <button
                    type="button"
                    onClick={() => handleClaimJob(job.id)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20"
                  >
                    Accept Job
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {job.status === AppointmentStatus.ASSIGNED && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(job.id, AppointmentStatus.IN_PROGRESS)
                        }
                        className="flex-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                      >
                        Start Repair
                      </button>
                    )}

                    {job.status === AppointmentStatus.IN_PROGRESS && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(job.id, AppointmentStatus.COMPLETED)
                        }
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenReportModal(job)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium py-2 rounded-lg transition-colors"
                    >
                      Report / Details
                    </button>
                  </div>
                )}
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
              Previous
            </button>
            <button
              type="button"
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => refreshData(meta.currentPage + 1)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg border border-slate-700 text-xs transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onSuccess={refreshData}
      />
    </div>
  );
}