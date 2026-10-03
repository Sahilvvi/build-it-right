import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MessageSquareQuote, Star, Plus, Trash2, CheckCircle2, X, Edit2 } from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  type TestimonialItem,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsPage,
});

export function AdminTestimonialsPage() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    cfaLevel: "",
    content: "",
    rating: 5,
    featured: true,
  });

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: "",
      role: "",
      cfaLevel: "",
      content: "",
      rating: 5,
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      cfaLevel: item.cfaLevel || "",
      content: item.content,
      rating: item.rating,
      featured: item.featured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;

    let updated: TestimonialItem[];
    if (editingId) {
      updated = store.testimonials.map((t) => (t.id === editingId ? { ...t, ...form } : t));
    } else {
      const newItem: TestimonialItem = {
        id: `t-${Date.now()}`,
        ...form,
      };
      updated = [newItem, ...store.testimonials];
    }

    saveAdminStore(
      { ...store, testimonials: updated },
      { action: editingId ? "Updated Testimonial" : "Added Testimonial", target: form.name },
    );
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete testimonial by ${name}?`)) {
      const updated = store.testimonials.filter((t) => t.id !== id);
      saveAdminStore(
        { ...store, testimonials: updated },
        { action: "Deleted Testimonial", target: name },
      );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-blue-600" />
            Student Reviews & Testimonials Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase first-attempt success stories, placement reviews, and Google rating
            testimonials.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Student Review
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                {item.featured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 italic leading-relaxed mb-4">"{item.content}"</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{item.role}</p>
                {item.cfaLevel && (
                  <p className="text-[10px] text-blue-600 font-semibold">{item.cfaLevel}</p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">
                {editingId ? "Edit Student Review" : "Add Student Review"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Karan Joshi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Role & Company</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Equity Research Analyst @ Nomura"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Exam / Course Cleared
                </label>
                <input
                  type="text"
                  value={form.cfaLevel}
                  onChange={(e) => setForm({ ...form, cfaLevel: e.target.value })}
                  placeholder="e.g. Cleared CFA Level 2 (First Attempt)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Review Statement *</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Describe how Fin-Envision helped prepare for the exams..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-700 font-medium">Feature on Homepage</span>
                </label>

                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Rating:</span>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="border border-slate-300 rounded px-2 py-1 bg-white font-bold"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
