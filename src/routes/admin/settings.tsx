import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Settings,
  Mail,
  Building,
  Save,
  CheckCircle2,
  Clock,
  Send,
  ShieldCheck,
  Phone,
  LogOut,
  UserCheck,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  getCurrentAdmin,
  setCurrentAdmin,
  flushPersist,
} from "@/lib/admin-store";
import { supabase } from "@/lib/supabase";
import { sendTestEmailFn } from "@/lib/leads";

export const Route = createFileRoute("/admin/settings")({
  beforeLoad: () => {
    // UI guard only: the database enforces the real rule.
    if (typeof window !== "undefined" && getCurrentAdmin()?.role !== "super_admin") {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminSettingsPage,
});

export function AdminSettingsPage() {
  const navigate = useNavigate();
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [currentUser, setCurrentUser] = useState(getCurrentAdmin());
  const [isSaved, setIsSaved] = useState(false);
  const [testState, setTestState] = useState<{
    status: "idle" | "sending" | "ok" | "error";
    message?: string;
  }>({ status: "idle" });

  useEffect(() => {
    setCurrentUser(getCurrentAdmin());
    const handleUpdate = () => {
      setStore(getAdminStore());
      setCurrentUser(getCurrentAdmin());
    };
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const handleLogout = () => {
    setCurrentAdmin(null);
    navigate({ to: "/admin-login" });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminStore(store, { action: "Updated Global Settings & SMTP", target: "System Settings" });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendTestEmail = async () => {
    setTestState({ status: "sending" });
    try {
      // The server reads the SMTP settings from the database, so save what is on screen first.
      saveAdminStore(store, { action: "Updated SMTP settings", target: "System Settings" });
      await flushPersist();
      const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
      if (!data.session) throw new Error("Your session expired. Please sign in again.");
      const res = await sendTestEmailFn({ data: { accessToken: data.session.access_token } });
      setTestState({ status: "ok", message: `Test email sent to ${res.sentTo}.` });
    } catch (err) {
      setTestState({
        status: "error",
        message: err instanceof Error ? err.message : "The test email could not be sent.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Global Settings & Email Notification Integrations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure institute contact details, SMTP email credentials for lead alerts, and view
            activity history.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Global Institute Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Global Institute Identity & Contact Channels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={store.identity.name}
                onChange={(e) =>
                  setStore({ ...store, identity: { ...store.identity, name: e.target.value } })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={store.identity.tagline}
                onChange={(e) =>
                  setStore({ ...store, identity: { ...store.identity, tagline: e.target.value } })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Official Contact Phone
              </label>
              <input
                type="text"
                value={store.identity.phone}
                onChange={(e) =>
                  setStore({ ...store, identity: { ...store.identity, phone: e.target.value } })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Official WhatsApp Number
              </label>
              <input
                type="text"
                value={store.identity.whatsapp}
                onChange={(e) =>
                  setStore({ ...store, identity: { ...store.identity, whatsapp: e.target.value } })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Classroom Physical Address
              </label>
              <input
                type="text"
                value={store.identity.address}
                onChange={(e) =>
                  setStore({ ...store, identity: { ...store.identity, address: e.target.value } })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* SMTP & Lead Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Email Integrations & Instant Lead Alerts (SOW 5)
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={store.smtp.sendLeadAlerts}
                onChange={(e) =>
                  setStore({
                    ...store,
                    smtp: { ...store.smtp, sendLeadAlerts: e.target.checked },
                  })
                }
                className="rounded text-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800">
                Enable Lead Email Notifications
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Lead Notification Recipient Email
              </label>
              <input
                type="email"
                value={store.smtp.leadNotificationEmail}
                onChange={(e) =>
                  setStore({
                    ...store,
                    smtp: { ...store.smtp, leadNotificationEmail: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Instant email triggered when candidate submits any inquiry form.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">SMTP Host Server</label>
              <input
                type="text"
                value={store.smtp.smtpHost}
                onChange={(e) =>
                  setStore({
                    ...store,
                    smtp: { ...store.smtp, smtpHost: e.target.value },
                  })
                }
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">SMTP Port</label>
              <input
                type="number"
                value={store.smtp.smtpPort}
                onChange={(e) =>
                  setStore({
                    ...store,
                    smtp: { ...store.smtp, smtpPort: Number(e.target.value) },
                  })
                }
                placeholder="587"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                SMTP Username / Account
              </label>
              <input
                type="text"
                value={store.smtp.smtpUser}
                onChange={(e) =>
                  setStore({
                    ...store,
                    smtp: { ...store.smtp, smtpUser: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
            The SMTP <strong>password is never stored in the database</strong>. Add it as a server
            environment variable named <code className="font-mono">SMTP_PASS</code> (for Gmail, an
            App Password). Without it, enquiries are still saved to the CRM, just without the email
            alert.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSendTestEmail}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-slate-500" />
              {testState.status === "sending" ? "Sending…" : "Send Test Lead Alert Email"}
            </button>
            {testState.status === "ok" && (
              <span className="text-emerald-600 font-medium text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {testState.message}
              </span>
            )}
            {testState.status === "error" && (
              <span className="max-w-sm text-right text-rose-600 font-medium text-[11px]">
                {testState.message}
              </span>
            )}
          </div>
        </div>

        {/* Activity History View */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Activity History Log
            </h2>
            <span className="text-[11px] text-slate-400">
              {store.activityHistory?.length || 0} recent actions recorded
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {store.activityHistory && store.activityHistory.length > 0 ? (
              store.activityHistory.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{act.action}</span>
                    <span className="text-slate-500 text-[11px] ml-2">({act.target})</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(act.timestamp).toLocaleString()} · {act.user}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No logged activity.</p>
            )}
          </div>
        </div>

        {/* Administrator Session & Sign Out */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Active Administrator Session
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current authenticated operator identity on this browser
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Session Verified
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {currentUser?.name?.[0] || "M"}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {currentUser?.name || "Manoj Rajgopal"}
                </div>
                <div className="text-slate-500 text-xs flex items-center gap-2">
                  <span>{currentUser?.email || "manoj@finenvision.com"}</span>
                  <span>•</span>
                  <span className="capitalize font-semibold text-blue-600">
                    {currentUser?.role === "super_admin"
                      ? "Charterholder / Super Admin"
                      : "Staff Administrator"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Admin Console</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
