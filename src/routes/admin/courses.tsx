import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Save,
  X,
  Clock,
  Layers,
  Calendar,
  Users,
  AlertCircle,
  Tag,
  Check,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  addCourseItem,
  deleteCourseItem,
} from "@/lib/admin-store";
import type { Course } from "@/data/site";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCoursesPage,
});

export function AdminCoursesPage() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // New course template
  const [newCourse, setNewCourse] = useState<Course>({
    slug: "",
    title: "",
    category: "cfa",
    duration: "4 Months · Weekend Live Cohort",
    level: "Beginner",
    format: "Hybrid",
    price: "₹38,000",
    rating: 4.9,
    learners: 120,
    badge: "Admissions Open",
    nextBatchDate: "15 Nov 2026",
    batchSchedule: "Sat & Sun (10:00 AM - 1:30 PM)",
    seatsRemaining: 15,
    enrollmentStatus: "Open",
    highlights: [
      "100% Curriculum coverage with practice questions",
      "Handwritten lecture notes & LMS recorded backup",
      "Weekly 1:1 mentor doubt-clearing sessions",
    ],
    outcomes: [
      "Deep conceptual clarity for first-attempt pass",
      "Hands-on problem solving on official mock papers",
    ],
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [outcomeInput, setOutcomeInput] = useState("");

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const handleSaveEditedCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourseIndex === null) return;
    const targetCourse = store.courses[editingCourseIndex];
    saveAdminStore(store, {
      action: "Updated Course & Batch Details",
      target: targetCourse.title,
    });
    setIsSaved(true);
    setEditingCourseIndex(null);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;

    const slug =
      newCourse.slug.trim() ||
      newCourse.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const created: Course = {
      ...newCourse,
      slug,
    };

    addCourseItem(created);
    setIsNewCourseModalOpen(false);
    setIsSaved(true);
    setStore(getAdminStore());
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDeleteCourse = (slug: string, title: string) => {
    if (
      confirm(
        `Are you sure you want to delete course "${title}"? This will remove it from the website catalog immediately.`,
      )
    ) {
      deleteCourseItem(slug);
      setStore(getAdminStore());
    }
  };

  const editingCourse = editingCourseIndex !== null ? store.courses[editingCourseIndex] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Courses, Batches & Pricing Operations
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              {store.courses.length} Active Courses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time control over CFA Level 1, 2, 3 and Financial Modeling syllabus, batch dates,
            seats, and fees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved to draft
            </span>
          )}
          <button
            onClick={() => setIsNewCourseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Course / Batch</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {store.courses.map((course, idx) => (
          <div
            key={course.slug}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wide">
                    {course.level} · {course.format}
                  </span>
                  {course.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      {course.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    course.enrollmentStatus === "Closed"
                      ? "bg-slate-100 text-slate-600"
                      : course.enrollmentStatus === "Filling Fast"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {course.enrollmentStatus || "Admissions Open"}
                </span>
              </div>

              <h2 className="font-bold text-base text-slate-900 leading-snug">{course.title}</h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {course.duration}
              </p>

              {/* Batch Intake Details Pillbox */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    Next Batch:
                  </span>
                  <span className="font-bold text-slate-900">
                    {course.nextBatchDate || "Upcoming Cohort"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500 text-[11px]">Schedule:</span>
                  <span className="text-slate-700 font-semibold">
                    {course.batchSchedule || "Sat & Sun 10:00 AM"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500 text-[11px]">Seats Left:</span>
                  <span className="text-blue-700 font-bold">
                    {course.seatsRemaining
                      ? `${course.seatsRemaining} seats left`
                      : "12 seats left"}
                  </span>
                </div>
              </div>

              {/* Pricing & Enrolled */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Pricing / Fees
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{course.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Trained Learners
                  </span>
                  <span className="font-semibold text-slate-900">{course.learners}+ enrolled</span>
                </div>
              </div>

              {/* Highlights count */}
              <div className="mt-3 text-[11px] text-slate-500">
                {course.highlights?.length || 0} curriculum modules · {course.outcomes?.length || 0}{" "}
                core outcomes
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteCourse(course.slug, course.title)}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                type="button"
                onClick={() => setEditingCourseIndex(idx)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Syllabus & Batches</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && editingCourseIndex !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  Program & Batch Editor
                </span>
                <h3 className="font-bold text-base text-slate-900">{editingCourse.title}</h3>
              </div>
              <button
                onClick={() => setEditingCourseIndex(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.title}
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        title: e.target.value,
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category Slug</label>
                  <input
                    type="text"
                    value={editingCourse.category}
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        category: e.target.value,
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Format</label>
                  <select
                    value={editingCourse.format}
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        format: e.target.value as Course["format"],
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Live cohort">Live cohort</option>
                    <option value="Online Pre-recorded">Online Pre-recorded</option>
                    <option value="Self-paced">Self-paced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        level: e.target.value as Course["level"],
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingCourse.badge || ""}
                    placeholder="e.g. Most popular"
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        badge: e.target.value,
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Batch Operations */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-blue-900">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Live Batch & Intake Scheduling
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Next Batch Start Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Nov 2026"
                      value={editingCourse.nextBatchDate || ""}
                      onChange={(e) => {
                        const updated = [...store.courses];
                        updated[editingCourseIndex] = {
                          ...updated[editingCourseIndex],
                          nextBatchDate: e.target.value,
                        };
                        setStore({ ...store, courses: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Batch Schedule / Timings
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sat & Sun (10:00 AM - 1:30 PM)"
                      value={editingCourse.batchSchedule || ""}
                      onChange={(e) => {
                        const updated = [...store.courses];
                        updated[editingCourseIndex] = {
                          ...updated[editingCourseIndex],
                          batchSchedule: e.target.value,
                        };
                        setStore({ ...store, courses: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Seats Remaining
                    </label>
                    <input
                      type="number"
                      value={editingCourse.seatsRemaining || 12}
                      onChange={(e) => {
                        const updated = [...store.courses];
                        updated[editingCourseIndex] = {
                          ...updated[editingCourseIndex],
                          seatsRemaining: parseInt(e.target.value, 10) || 0,
                        };
                        setStore({ ...store, courses: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Enrollment Status
                    </label>
                    <select
                      value={editingCourse.enrollmentStatus || "Open"}
                      onChange={(e) => {
                        const updated = [...store.courses];
                        updated[editingCourseIndex] = {
                          ...updated[editingCourseIndex],
                          enrollmentStatus: e.target.value as Course["enrollmentStatus"],
                        };
                        setStore({ ...store, courses: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="Open">Admissions Open</option>
                      <option value="Filling Fast">Filling Fast (Urgent)</option>
                      <option value="Waitlist">Waitlist Only</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pricing Text</label>
                  <input
                    type="text"
                    value={editingCourse.price}
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        price: e.target.value,
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Duration Text</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        duration: e.target.value,
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Enrolled Learners Count
                  </label>
                  <input
                    type="number"
                    value={editingCourse.learners}
                    onChange={(e) => {
                      const updated = [...store.courses];
                      updated[editingCourseIndex] = {
                        ...updated[editingCourseIndex],
                        learners: parseInt(e.target.value, 10) || 0,
                      };
                      setStore({ ...store, courses: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Highlights Modules */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Curriculum Highlights (Modules / Features)
                </label>
                <div className="space-y-1.5 mb-2">
                  {editingCourse.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const updated = [...store.courses];
                          const newHighlights = [...updated[editingCourseIndex].highlights];
                          newHighlights[hIdx] = e.target.value;
                          updated[editingCourseIndex] = {
                            ...updated[editingCourseIndex],
                            highlights: newHighlights,
                          };
                          setStore({ ...store, courses: updated });
                        }}
                        className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...store.courses];
                          updated[editingCourseIndex].highlights = updated[
                            editingCourseIndex
                          ].highlights.filter((_, i) => i !== hIdx);
                          setStore({ ...store, courses: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add curriculum module..."
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!highlightInput.trim()) return;
                      const updated = [...store.courses];
                      updated[editingCourseIndex].highlights.push(highlightInput.trim());
                      setStore({ ...store, courses: updated });
                      setHighlightInput("");
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md font-semibold hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourseIndex(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Program Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Course / Batch Modal */}
      {isNewCourseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  New Program Creator
                </span>
                <h3 className="font-bold text-base text-slate-900">Add Course or Batch</h3>
              </div>
              <button
                onClick={() => setIsNewCourseModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CFA® Level 3 Advanced Portfolio Strategy"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Format</label>
                  <select
                    value={newCourse.format}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, format: e.target.value as Course["format"] })
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Live cohort">Live cohort</option>
                    <option value="Online Pre-recorded">Online Pre-recorded</option>
                    <option value="Self-paced">Self-paced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Level</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, level: e.target.value as Course["level"] })
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fee / Pricing</label>
                  <input
                    type="text"
                    required
                    placeholder="₹42,000"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Next Batch Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1st Dec 2026"
                    value={newCourse.nextBatchDate || ""}
                    onChange={(e) => setNewCourse({ ...newCourse, nextBatchDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batch Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. Sat & Sun (10:00 AM - 1:30 PM)"
                    value={newCourse.batchSchedule || ""}
                    onChange={(e) => setNewCourse({ ...newCourse, batchSchedule: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCourseModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Publish New Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
