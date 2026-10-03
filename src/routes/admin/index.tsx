import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Users2,
  TrendingUp,
  UserCheck,
  BookOpen,
  ArrowUpRight,
  Clock,
  Phone,
  MessageCircle,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  Layers,
  Award,
  Zap,
} from "lucide-react";
import {
  getAdminStore,
  type AdminStoreData,
  type Lead,
  type LeadStage,
  updateLeadStage,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardOverview,
});

export function AdminDashboardOverview() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const totalLeads = store.leads.length;
  const enrolledLeads = store.leads.filter((l) => l.leadStage === "Enrolled").length;
  const activeInquiries = store.leads.filter(
    (l) =>
      l.leadStage === "Inquiry" ||
      l.leadStage === "Interested" ||
      l.leadStage === "Coming for Meeting",
  ).length;
  const conversionRate = totalLeads > 0 ? Math.round((enrolledLeads / totalLeads) * 100) : 0;

  // Stages count
  const stagesCount: Record<LeadStage, number> = {
    Inquiry: 0,
    Contacted: 0,
    Interested: 0,
    "Coming for Meeting": 0,
    Enrolled: 0,
    "Not Interested": 0,
    Lost: 0,
    Invalid: 0,
  };
  store.leads.forEach((l) => {
    if (stagesCount[l.leadStage] !== undefined) {
      stagesCount[l.leadStage]++;
    }
  });

  return (
    <div className="space-y-8">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome Back, Manoj Rajgopal
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Here is your daily snapshot of CFA & Financial Modeling inquiries, batch conversions,
              and site content performance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin/leads"
              className="btn-sheen inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-[0_3px_10px_rgba(37,99,235,0.35)] hover:shadow-[0_5px_16px_rgba(37,99,235,0.45)] transition-all"
            >
              <Users2 className="w-4 h-4" />
              <span>Candidate Pipeline</span>
            </Link>

            <Link
              to="/admin/pages"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs shadow-2xs hover:bg-slate-50 transition-all hover:shadow-xs"
            >
              <span>Edit Website CMS</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Subtle decorative mesh background */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-96 bg-gradient-to-l from-blue-50/50 via-slate-50/20 to-transparent" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.12)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Inquiries
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                <Users2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {totalLeads}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Website + Ad forms</span>
            <span className="text-blue-600 font-semibold hover:underline">
              <Link to="/admin/leads">View all →</Link>
            </span>
          </div>
        </div>

        {/* Active Pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-amber-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(217,119,6,0.12)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Inquiries
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {activeInquiries}
              </span>
              <span className="text-xs font-bold text-amber-600">Action required</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Inquiry & Meeting stages</span>
            <span className="text-slate-600 font-semibold">
              {stagesCount["Coming for Meeting"]} meetings
            </span>
          </div>
        </div>

        {/* Enrolled Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-emerald-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,0.12)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Enrolled Students
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {enrolledLeads}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {conversionRate}% conversion
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Classroom & Online</span>
            <span className="text-emerald-700 font-semibold">Verified batches</span>
          </div>
        </div>

        {/* Course Catalog & Batches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-purple-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(147,51,234,0.12)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Programs
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {store.courses.length}
              </span>
              <span className="text-xs font-bold text-purple-600">All Levels</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>CFA L1, L2, L3 & Modeling</span>
            <span className="text-purple-700 font-semibold hover:underline">
              <Link to="/admin/courses">Edit →</Link>
            </span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Funnel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Inquiry Pipeline Conversion Funnel
            </h2>
            <p className="text-xs text-slate-500">
              Live status progression from first visitor inquiry to classroom enrollment
            </p>
          </div>
          <Link
            to="/admin/leads"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>Open CRM Lead Grid</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {(
            [
              {
                key: "Inquiry",
                label: "Inquiry",
                bg: "bg-slate-50 border-slate-200",
                dot: "bg-slate-400",
              },
              {
                key: "Contacted",
                label: "Contacted",
                bg: "bg-blue-50/60 border-blue-200/60",
                dot: "bg-blue-500",
              },
              {
                key: "Interested",
                label: "Interested",
                bg: "bg-indigo-50/60 border-indigo-200/60",
                dot: "bg-indigo-500",
              },
              {
                key: "Coming for Meeting",
                label: "Meeting",
                bg: "bg-amber-50/60 border-amber-200/60",
                dot: "bg-amber-500",
              },
              {
                key: "Enrolled",
                label: "Enrolled",
                bg: "bg-emerald-50/70 border-emerald-200/80",
                dot: "bg-emerald-500",
              },
              {
                key: "Not Interested",
                label: "Not Interested",
                bg: "bg-slate-50 border-slate-200/60",
                dot: "bg-slate-300",
              },
              {
                key: "Lost",
                label: "Lost",
                bg: "bg-rose-50/60 border-rose-200/60",
                dot: "bg-rose-400",
              },
              {
                key: "Invalid",
                label: "Invalid",
                bg: "bg-red-50/60 border-red-200/60",
                dot: "bg-red-400",
              },
            ] as const
          ).map((s) => (
            <div
              key={s.key}
              className={`p-3.5 rounded-xl border ${s.bg} flex flex-col justify-between transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <span className="text-[11px] font-semibold text-slate-700 truncate">{s.label}</span>
              </div>
              <div className="text-xl font-black text-slate-900 tabular-nums">
                {stagesCount[s.key]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Section: Leads Table & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Candidate Inquiries (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Candidate Leads
              </h2>
              <p className="text-xs text-slate-500">
                Live inquiries with one-click counselor actions
              </p>
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>View All ({totalLeads})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Program Interest</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.leads.slice(0, 5).map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hi ${lead.name}, this is Manoj from Fin-Envision Learning regarding your CFA inquiry.`,
                  )}`;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {lead.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {lead.phone} · {lead.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 max-w-[200px] truncate">
                          {lead.courseInterest}
                        </div>
                        {lead.utmSource ? (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                            via {lead.utmSource}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Organic direct</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={lead.leadStage}
                          onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                          className="text-[11px] font-semibold rounded-lg px-2.5 py-1 border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
                        >
                          <option value="Inquiry">Inquiry</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Coming for Meeting">Meeting</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Lost">Lost</option>
                          <option value="Invalid">Invalid</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
                            title="Call Phone"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity & Quick Actions (1 Column) */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/admin/announcements"
                className="p-2.5 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-slate-700 font-semibold transition-all flex flex-col justify-between"
              >
                <span>Notice Marquee</span>
                <span className="text-[10px] text-slate-400 font-normal">Active tickers</span>
              </Link>
              <Link
                to="/admin/courses"
                className="p-2.5 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-slate-700 font-semibold transition-all flex flex-col justify-between"
              >
                <span>Edit Batch Fees</span>
                <span className="text-[10px] text-slate-400 font-normal">CFA & Modeling</span>
              </Link>
              <Link
                to="/admin/media"
                className="p-2.5 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-slate-700 font-semibold transition-all flex flex-col justify-between"
              >
                <span>Media Assets</span>
                <span className="text-[10px] text-slate-400 font-normal">Brochures & PDFs</span>
              </Link>
              <Link
                to="/admin/seo"
                className="p-2.5 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 hover:bg-white text-slate-700 font-semibold transition-all flex flex-col justify-between"
              >
                <span>SEO & Meta</span>
                <span className="text-[10px] text-slate-400 font-normal">Google Snippets</span>
              </Link>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Live Operation Logs
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Real-time</span>
            </div>

            <div className="space-y-3.5 max-h-64 overflow-y-auto">
              {store.activityHistory && store.activityHistory.length > 0 ? (
                store.activityHistory.map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0 ring-4 ring-blue-50" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 leading-tight truncate">
                        {item.action}
                      </p>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5">
                        Target: <span className="font-medium text-slate-700">{item.target}</span>
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {item.user}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
