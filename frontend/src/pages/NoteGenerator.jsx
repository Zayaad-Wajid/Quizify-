import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Layers, Sparkles, Target, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { notesAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function NoteGenerator() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    detail_level: "medium",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to generate notes");
      navigate("/login");
      return;
    }

    if (!formData.subject.trim() || !formData.topic.trim()) {
      toast.error("Please enter both subject and topic");
      return;
    }

    setIsGenerating(true);

    try {
      await notesAPI.generateNotes(formData);
      toast.success("Notes generated successfully!");
      navigate("/notes");
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to generate notes";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <section className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 p-8 md:p-10 shadow-2xl">
            <div className="absolute -top-16 right-8 w-56 h-56 bg-fuchsia-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300 font-semibold">
                Smart Notes Engine
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2 leading-tight">
                Generate structured, professional study notes
              </h1>
              <p className="text-slate-300 mt-4 max-w-2xl">
                Build clean note packs with key concepts, examples, summaries,
                and revision questions tailored to your topic.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                  <p className="text-xs text-slate-400">Structure</p>
                  <p className="text-lg font-semibold text-slate-100 mt-1">9 Sections</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                  <p className="text-xs text-slate-400">Format</p>
                  <p className="text-lg font-semibold text-slate-100 mt-1">Markdown</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                  <p className="text-xs text-slate-400">Use Case</p>
                  <p className="text-lg font-semibold text-slate-100 mt-1">Revision</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <section className="card">
            <h2 className="text-2xl font-bold text-slate-100">Note Configuration</h2>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Choose a subject, define the topic, and select your desired depth.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="subject" className="label flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Physics, Computer Science"
                  required
                />
              </div>

              <div>
                <label htmlFor="topic" className="label flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Newton's Laws, React Hooks"
                  required
                />
              </div>

              <div>
                <label htmlFor="detail_level" className="label flex items-center">
                  <Layers className="w-4 h-4 mr-2" />
                  Detail Level
                </label>
                <select
                  id="detail_level"
                  name="detail_level"
                  value={formData.detail_level}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="brief">Brief</option>
                  <option value="medium">Medium</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-4 py-3 font-semibold hover:from-fuchsia-400 hover:to-violet-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating Notes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Notes
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Output includes</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 mt-0.5 text-fuchsia-300" />
                Intro, key concepts, and in-depth explanations
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 mt-0.5 text-fuchsia-300" />
                Worked examples and common mistakes
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 mt-0.5 text-fuchsia-300" />
                Review questions and takeaway summary
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
