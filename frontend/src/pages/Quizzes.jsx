import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Plus, Target } from "lucide-react";
import toast from "react-hot-toast";
import { quizAPI } from "../services/api";

const difficultyStyles = {
  easy: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  medium: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  hard: "border-red-400/40 bg-red-500/10 text-red-200",
};

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: "",
    difficulty: "",
  });

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getQuizzes(filters);
      setQuizzes(response.data);
    } catch {
      toast.error("Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = quizzes.length;
    const hard = quizzes.filter((q) => q.difficulty === "hard").length;
    const subjects = new Set(quizzes.map((q) => q.subject)).size;
    return { total, hard, subjects };
  }, [quizzes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 md:p-10 shadow-2xl mb-8">
        <div className="absolute -top-14 right-10 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
              Assessment Library
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2">
              Professional Quiz Workspace
            </h1>
            <p className="text-slate-300 mt-3 max-w-2xl">
              Browse generated quizzes, filter by difficulty, and jump directly
              into focused practice sessions.
            </p>
          </div>

          <Link to="/quizzes/generate" className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Generate Quiz
          </Link>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Total Quizzes</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Subjects Covered</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{stats.subjects}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Advanced Quizzes</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{stats.hard}</p>
          </div>
        </div>
      </section>

      <section className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="input"
            >
              <option value="">All Subjects</option>
              <option value="coding">Coding</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="science">Science</option>
            </select>
          </div>

          <div>
            <label className="label">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="input"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="card text-center py-14">
          <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">No quizzes found</h3>
          <p className="text-slate-400 mb-5">Generate your first quiz to start practicing.</p>
          <Link to="/quizzes/generate" className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Generate Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <article key={quiz.id} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-cyan-300" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    difficultyStyles[quiz.difficulty] || "border-slate-600 bg-slate-700/50 text-slate-200"
                  }`}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-100 mb-2 line-clamp-2">
                {quiz.title}
              </h3>

              <div className="flex items-center text-sm text-slate-400 mb-5">
                <Target className="w-4 h-4 mr-1" />
                {quiz.question_count} questions
              </div>

              <Link
                to={`/quizzes/${quiz.id}`}
                className="inline-flex items-center justify-center w-full rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 font-semibold text-cyan-200 hover:bg-cyan-500/20 transition-colors"
              >
                Take Quiz
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
