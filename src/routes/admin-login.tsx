import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { signInAdmin, requestPasswordReset, setNewPassword } from "@/lib/admin-store";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("admin-body-override");
    return () => {
      document.body.classList.remove("admin-body-override");
    };
  }, []);

  // Arriving from the reset-password email: Supabase signs the user into a recovery session.
  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your admin work email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setBusy(true);
    try {
      await signInAdmin(trimmedEmail, password);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleSendReset = async () => {
    setForgotError("");
    const target = forgotEmail.trim().toLowerCase();
    if (!target) {
      setForgotError("Enter your registered administrator email.");
      return;
    }
    try {
      await requestPasswordReset(target);
      setForgotSent(true);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Could not send the recovery email.");
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (recoveryPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      await setNewPassword(recoveryPassword);
      await supabase?.auth.signOut();
      setRecoveryMode(false);
      setRecoveryPassword("");
      setPassword("");
      setNotice("Password updated. Sign in with your new password.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the password.");
    }
  };

  return (
    <div
      className="admin-scope min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased selection:bg-blue-600 selection:text-white"
      data-admin-portal="true"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-xs ring-1 ring-blue-700/20 group-hover:scale-105 transition-transform">
            FE
          </div>
          <div className="text-left">
            <span className="font-bold text-base text-slate-900 tracking-tight block leading-tight">
              Fin-Envision
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
              Learning Portal
            </span>
          </div>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Administrator Access</h2>
        <p className="mt-1.5 text-xs text-slate-500">
          Enter your authorized administrator credentials to manage courses, content, and inquiries.
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-200/80 rounded-2xl relative overflow-hidden">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {recoveryMode ? (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Choose a new password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoFocus
                  value={recoveryPassword}
                  onChange={(e) => setRecoveryPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
                  placeholder="At least 8 characters"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
              >
                Update password
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Work Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white font-medium placeholder:text-slate-400"
                    placeholder="name@finenvision.com"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotModal(true);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white placeholder:text-slate-400"
                    placeholder="Enter administrator password"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  <span>{busy ? "Signing in..." : "Sign in to Dashboard"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Role-Based Access Control
            </span>
            <Link to="/" className="text-blue-600 hover:underline font-semibold">
              Return to Website
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Reset Administrator Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered administrator email to dispatch recovery instructions.
            </p>

            {forgotSent ? (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  If that address belongs to an administrator, a reset link is on its way.
                </span>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  placeholder="admin@finenvision.com"
                />
                {forgotError && <p className="text-xs text-rose-600">{forgotError}</p>}
                <button
                  type="button"
                  onClick={handleSendReset}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setForgotModal(false);
                setForgotSent(false);
                setForgotError("");
              }}
              className="mt-4 w-full py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
