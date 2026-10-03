import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Users2,
  Search,
  Filter,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Calendar,
  X,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ChevronDown,
  ExternalLink,
  Tag,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  addLead,
  updateLeadStage,
  addLeadNote,
  importLeadsFromCsv,
  type Lead,
  type LeadStage,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeadsPage,
});

const ALL_STAGES: LeadStage[] = [
  "Inquiry",
  "Contacted",
  "Interested",
  "Not Interested",
  "Coming for Meeting",
  "Enrolled",
  "Lost",
  "Invalid",
];

const STAGE_THEMES: Record<LeadStage, { bg: string; text: string; border: string; dot: string }> = {
  Inquiry: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  Contacted: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  Interested: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  "Coming for Meeting": {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Enrolled: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  "Not Interested": {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  Lost: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-400" },
  Invalid: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-400" },
};

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");

  // Selection & Details Slide-over
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");

  // Modals
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    courseInterest: "Chartered Financial Analyst (CFA®) Level 1",
    city: "Mumbai",
    leadStage: "Inquiry" as LeadStage,
    sourcePage: "/admin-manual",
    utmSource: "direct_walkin",
    utmMedium: "offline",
    utmCampaign: "",
  });

  const loadData = useCallback(() => {
    const store = getAdminStore();
    setLeads(store.leads);
    if (selectedLead) {
      const refreshed = store.leads.find((l) => l.id === selectedLead.id);
      if (refreshed) setSelectedLead(refreshed);
    }
  }, [selectedLead]);

  useEffect(() => {
    loadData();
    window.addEventListener("finenvision_store_updated", loadData);
    return () => window.removeEventListener("finenvision_store_updated", loadData);
  }, [loadData]);

  // Unique sources for filter
  const availableSources = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => {
      if (l.utmSource) s.add(l.utmSource);
    });
    return Array.from(s);
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage = stageFilter === "ALL" || lead.leadStage === stageFilter;
      const matchesCourse = courseFilter === "ALL" || lead.courseInterest === courseFilter;
      const matchesSource = sourceFilter === "ALL" || lead.utmSource === sourceFilter;

      return matchesSearch && matchesStage && matchesCourse && matchesSource;
    });
  }, [leads, searchTerm, stageFilter, courseFilter, sourceFilter]);

  // Handlers
  const handleStageChange = (leadId: string, newStage: LeadStage) => {
    updateLeadStage(leadId, newStage);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    addLeadNote(selectedLead.id, newNoteText);
    setNewNoteText("");
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.phone.trim()) {
      alert("Name and phone number are required.");
      return;
    }
    const created = addLead(newLeadForm);
    setIsNewLeadModalOpen(false);
    setSelectedLead(created);
    setNewLeadForm({
      name: "",
      email: "",
      phone: "",
      courseInterest: "Chartered Financial Analyst (CFA®) Level 1",
      city: "Mumbai",
      leadStage: "Inquiry",
      sourcePage: "/admin-manual",
      utmSource: "direct_walkin",
      utmMedium: "offline",
      utmCampaign: "",
    });
  };

  // CSV Export
  const handleExportCsv = () => {
    if (filteredLeads.length === 0) {
      alert("No leads to export.");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
      "Phone",
      "Course Interest",
      "Lead Stage",
      "City",
      "Source Page",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Content",
      "UTM Term",
      "Notes Count",
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.courseInterest.replace(/"/g, '""')}"`,
      `"${l.leadStage}"`,
      `"${l.city}"`,
      `"${l.sourcePage}"`,
      `"${l.utmSource || ""}"`,
      `"${l.utmMedium || ""}"`,
      `"${l.utmCampaign || ""}"`,
      `"${l.utmContent || ""}"`,
      `"${l.utmTerm || ""}"`,
      l.notes.length,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `FinEnvision_Leads_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        alert("CSV file seems empty or invalid.");
        return;
      }

      const parsed: Array<Partial<Lead>> = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.replace(/^["']|["']$/g, "").trim());
        if (cols[0] || cols[1] || cols[2]) {
          parsed.push({
            name: cols[0] || "Imported Candidate",
            email: cols[1] || "",
            phone: cols[2] || "",
            courseInterest: cols[3] || "Chartered Financial Analyst (CFA®) Level 1",
            city: cols[4] || "Mumbai",
            utmSource: cols[5] || "csv_bulk_upload",
            leadStage: "Inquiry",
          });
        }
      }

      const count = importLeadsFromCsv(parsed);
      setIsCsvModalOpen(false);
      alert(`Successfully imported ${count} candidate leads into the CRM.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Executive CRM Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Candidate Leads CRM</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 tabular-nums">
              {leads.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-channel pipeline with complete UTM campaign attribution & counselor
            touchpoints.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export ({filteredLeads.length})</span>
          </button>

          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Lead</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate by name, phone, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs"
          >
            <option value="ALL">All Stages ({leads.length})</option>
            {ALL_STAGES.map((s) => (
              <option key={s} value={s}>
                {s} ({leads.filter((l) => l.leadStage === s).length})
              </option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs"
          >
            <option value="ALL">All Programs</option>
            <option value="Chartered Financial Analyst (CFA®) Level 1">CFA Level 1</option>
            <option value="Chartered Financial Analyst (CFA®) Level 2">CFA Level 2</option>
            <option value="Chartered Financial Analyst (CFA®) Level 3">CFA Level 3</option>
            <option value="Holistic Finance (Equity Research and Financial Modeling)">
              Financial Modeling
            </option>
          </select>

          {/* UTM Source Filter */}
          {availableSources.length > 0 && (
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs"
            >
              <option value="ALL">All Marketing Channels</option>
              {availableSources.map((src) => (
                <option key={src} value={src}>
                  Source: {src}
                </option>
              ))}
            </select>
          )}

          {(searchTerm ||
            stageFilter !== "ALL" ||
            courseFilter !== "ALL" ||
            sourceFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStageFilter("ALL");
                setCourseFilter("ALL");
                setSourceFilter("ALL");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main CRM Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Program Interest</th>
                <th className="py-3.5 px-4">Lead Status</th>
                <th className="py-3.5 px-4">Campaign (UTM)</th>
                <th className="py-3.5 px-4">Captured</th>
                <th className="py-3.5 px-4 text-right">Instant Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <Users2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No candidate inquiries found matching the active filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hi ${lead.name}, this is Manoj from Fin-Envision Learning regarding your CFA inquiry.`,
                  )}`;
                  const theme = STAGE_THEMES[lead.leadStage] || STAGE_THEMES.Inquiry;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition-all duration-150 ${
                        selectedLead?.id === lead.id ? "bg-blue-50/70" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {lead.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{lead.city || "Mumbai"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-semibold">{lead.phone}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {lead.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium max-w-[210px] truncate">
                          {lead.courseInterest}
                        </div>
                        <div className="text-[10px] text-slate-400">Page: {lead.sourcePage}</div>
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center">
                          <select
                            value={lead.leadStage}
                            onChange={(e) =>
                              handleStageChange(lead.id, e.target.value as LeadStage)
                            }
                            className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border ${theme.border} ${theme.bg} ${theme.text} focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs cursor-pointer`}
                          >
                            {ALL_STAGES.map((st) => (
                              <option key={st} value={st} className="bg-white text-slate-900">
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {lead.utmSource ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                              {lead.utmSource}
                            </span>
                            {lead.utmCampaign && (
                              <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                                {lead.utmCampaign}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Direct / Organic</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {lead.notes.length > 0 && (
                          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                            {lead.notes.length} note{lead.notes.length > 1 ? "s" : ""}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-all shadow-2xs"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
                            title="Call Phone"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer: Lead Details & Notes Timeline */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedLead.name[0]}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {selectedLead.name}
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Captured {new Date(selectedLead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Selector */}
            <div className="py-4 border-b border-slate-100">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Current Qualification Stage
              </label>
              <select
                value={selectedLead.leadStage}
                onChange={(e) => handleStageChange(selectedLead.id, e.target.value as LeadStage)}
                className="w-full text-xs font-bold rounded-xl px-3.5 py-2.5 border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-2xs"
              >
                {ALL_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="py-4 border-b border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hi ${selectedLead.name}, this is Manoj from Fin-Envision Learning regarding your CFA inquiry.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Candidate
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
              >
                <Phone className="w-4 h-4" />
                Call Phone
              </a>
            </div>

            {/* Contact Details Grid */}
            <div className="py-4 border-b border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold text-slate-900">{selectedLead.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-900">{selectedLead.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program Interest:</span>
                <span className="font-bold text-slate-900 text-right">
                  {selectedLead.courseInterest}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City / Location:</span>
                <span className="font-bold text-slate-900">{selectedLead.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Landing URL:</span>
                <span className="font-bold text-slate-900 font-mono text-[11px]">
                  {selectedLead.sourcePage}
                </span>
              </div>
            </div>

            {/* Marketing UTM Attribution */}
            <div className="py-4 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Marketing Campaign Attribution
              </h3>
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-[11px] border border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-500">UTM Source:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLead.utmSource || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">UTM Medium:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLead.utmMedium || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">UTM Campaign:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLead.utmCampaign || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">UTM Content:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLead.utmContent || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">UTM Term:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLead.utmTerm || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Counselor Notes Timeline */}
            <div className="py-4 flex-1 flex flex-col">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Counselor Follow-up Notes
              </h3>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add note (e.g. wants Saturday Thane batch)..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {selectedLead.notes.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No notes recorded yet.</p>
                ) : (
                  selectedLead.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs"
                    >
                      <p className="text-slate-900 font-medium leading-snug">{note.text}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600">{note.author}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record New Lead Manually */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Record Candidate Lead Manually</h3>
              <button onClick={() => setIsNewLeadModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Priya Deshmukh"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+91 98200 12345"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="priya@gmail.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Course Interest</label>
                <select
                  value={newLeadForm.courseInterest}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, courseInterest: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="Chartered Financial Analyst (CFA®) Level 1">CFA® Level 1</option>
                  <option value="Chartered Financial Analyst (CFA®) Level 2">CFA® Level 2</option>
                  <option value="Chartered Financial Analyst (CFA®) Level 3">CFA® Level 3</option>
                  <option value="Holistic Finance (Equity Research and Financial Modeling)">
                    Financial Modeling
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    placeholder="Thane / Mumbai"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lead Stage</label>
                  <select
                    value={newLeadForm.leadStage}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, leadStage: e.target.value as LeadStage })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    {ALL_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Marketing Source (UTM)
                </label>
                <input
                  type="text"
                  value={newLeadForm.utmSource}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, utmSource: e.target.value })}
                  placeholder="direct_walkin / phone_inquiry"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: CSV Upload */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Bulk Upload Leads (CSV)</h3>
              <button onClick={() => setIsCsvModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Upload a .csv file containing columns: Name, Email, Phone, Course, City, UTM Source.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-4 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs"
              >
                Select CSV File
              </button>
              <p className="text-[10px] text-slate-400 mt-2">
                Supports Google Ads, Meta Ads & Excel
              </p>
            </div>

            <button
              onClick={() => setIsCsvModalOpen(false)}
              className="mt-4 w-full py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
