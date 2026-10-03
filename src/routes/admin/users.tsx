import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  User,
  Power,
  X,
  KeyRound,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  getCurrentAdmin,
  type AdminStoreData,
  type AdminUser,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

export function AdminUsersPage() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [currentAdmin, setCurrentAdminUser] = useState(getCurrentAdmin());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState("");

  // Add User Form
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "admin" as "super_admin" | "admin",
  });

  // Password Change Form
  const [passForm, setPassForm] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });

  useEffect(() => {
    const handleUpdate = () => {
      setStore(getAdminStore());
      setCurrentAdminUser(getCurrentAdmin());
    };
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const user: AdminUser = {
      id: `u-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: "active",
      lastLogin: "Never",
    };

    const updated = [...store.users, user];
    saveAdminStore({ ...store, users: updated }, { action: "Added Admin User", target: user.name });
    setIsAddModalOpen(false);
    setNewUser({ name: "", email: "", role: "admin" });
  };

  const handleToggleStatus = (id: string) => {
    const userToToggle = store.users.find((u) => u.id === id);
    if (userToToggle?.role === "super_admin") {
      alert("Super Admin cannot be deactivated.");
      return;
    }

    const updated = store.users.map((u) =>
      u.id === id
        ? {
            ...u,
            status: (u.status === "active" ? "inactive" : "active") as "active" | "inactive",
          }
        : u,
    );
    saveAdminStore(
      { ...store, users: updated },
      { action: "Toggled User Status", target: userToToggle?.name || id },
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) {
      setPasswordNotice("No active admin session found.");
      return;
    }
    const currentActiveUser = store.users.find((u) => u.id === currentAdmin.id);
    const expected = currentActiveUser?.password || "admin123";
    if (passForm.currentPass !== expected) {
      setPasswordNotice("Current password does not match records.");
      return;
    }
    if (passForm.newPass !== passForm.confirmPass) {
      setPasswordNotice("New passwords do not match.");
      return;
    }
    if (passForm.newPass.length < 6) {
      setPasswordNotice("New password must be at least 6 characters.");
      return;
    }

    const updated = store.users.map((u) =>
      u.id === currentAdmin.id ? { ...u, password: passForm.newPass } : u,
    );
    saveAdminStore(
      { ...store, users: updated },
      { action: "Updated Password", target: currentAdmin.name },
    );
    setPasswordNotice("Password updated successfully.");
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setPasswordNotice("");
      setPassForm({ currentPass: "", newPass: "", confirmPass: "" });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            User Management & Role Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control administrator access levels (Super Admin & Admin Staff), invites, and credential
            security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            Change My Password
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Administrator
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Administrator Accounts</span>
          <span className="text-[11px] text-slate-400">
            {store.users.length} registered accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Admin Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Access</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {store.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {user.name[0]}
                      </div>
                      <span className="font-semibold text-slate-900">{user.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{user.email}</td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        user.role === "super_admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {user.role === "super_admin" ? "Super Admin" : "Staff Admin"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Deactivated"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {user.lastLogin || "Recent"}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {user.role !== "super_admin" && (
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`text-[11px] font-medium px-2 py-1 rounded border transition-colors ${
                          user.status === "active"
                            ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                            : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        }`}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">Add New Administrator</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Rahul Patil"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="rahul@finenvision.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Role Permission</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as "super_admin" | "admin",
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="admin">Staff Admin (Leads & Content)</option>
                  <option value="super_admin">Super Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Change My Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {passwordNotice && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg">
                {passwordNotice}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passForm.currentPass}
                  onChange={(e) => setPassForm({ ...passForm, currentPass: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passForm.newPass}
                  onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passForm.confirmPass}
                  onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
