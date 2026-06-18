import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ClipboardList,
  FileText,
  Plus,
  Sparkles,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";
import { dashboardAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    quizzes_available: 0,
    saved_notes: 0,
    quizzes_taken: 0,
    average_score: 0,
    recent_quizzes: [],
    recent_notes: [],
    recent_progress: [],
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    const loadDashboard = async () => {
      setIsLoading(true);

      try {
        const response = await dashboardAPI.getSummary();
        setSummary(response.data);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated, user?.id]);

  const stats = useMemo(() => {
    return {
      quizzesAvailable: summary.quizzes_available,
      savedNotes: summary.saved_notes,
      quizzesTaken: summary.quizzes_taken,
      averageScore: Math.round(summary.average_score),
    };
  }, [summary]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 p-8 md:p-10 shadow-2xl mb-8">
        <div className="absolute -top-16 right-10 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
              Learner Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2">
              Welcome back, {user?.first_name}
            </h1>
            <p className="text-slate-300 mt-3 max-w-2xl">
              Pick up your coding study flow, jump into a fresh quiz, review
              saved notes, or continue with guided AI support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/quizzes/generate" className="btn btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Generate Quiz
            </Link>
            <Link to="/notes/generate" className="btn btn-secondary">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Notes
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <BookOpen className="w-6 h-6 text-cyan-300 mb-3" />
          <p className="text-sm text-slate-400">Quizzes Available</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">
            {stats.quizzesAvailable}
          </p>
        </div>
        <div className="card">
          <FileText className="w-6 h-6 text-fuchsia-300 mb-3" />
          <p className="text-sm text-slate-400">Saved Notes</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">
            {stats.savedNotes}
          </p>
        </div>
        <div className="card">
          <ClipboardList className="w-6 h-6 text-emerald-300 mb-3" />
          <p className="text-sm text-slate-400">Recent Attempts</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">
            {stats.quizzesTaken}
          </p>
        </div>
        <div className="card">
          <Trophy className="w-6 h-6 text-amber-300 mb-3" />
          <p className="text-sm text-slate-400">Average Score</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">
            {stats.averageScore}%
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="card xl:col-span-1">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/quizzes"
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 hover:border-cyan-400/40"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-cyan-300" />
                <span className="text-slate-100 font-medium">Browse Quizzes</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/notes"
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 hover:border-fuchsia-400/40"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-fuchsia-300" />
                <span className="text-slate-100 font-medium">Open Notes</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/assistant"
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 hover:border-cyan-400/40"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-cyan-300" />
                <span className="text-slate-100 font-medium">Ask Assistant</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        <div className="card xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Recent Quiz Activity
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
            </div>
          ) : summary.recent_progress.length === 0 ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <p className="text-slate-300">
                No coding quiz attempts yet. Start with a generated quiz to
                build your progress history.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {summary.recent_progress.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-700 bg-slate-800/40 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-slate-100">
                      {item.quiz_title}
                    </p>
                    <p className="text-sm text-slate-400">{item.quiz_subject}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-300">
                      {item.score}/{item.total_questions} correct
                    </span>
                    <span className="px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 font-medium">
                      {Math.round(item.percentage)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">
              Suggested Quizzes
            </h2>
            <Link to="/quizzes" className="text-sm text-cyan-300 hover:text-cyan-200">
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" />
            </div>
          ) : summary.recent_quizzes.length === 0 ? (
            <p className="text-slate-400">No quizzes available yet.</p>
          ) : (
            <div className="space-y-3">
              {summary.recent_quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  to={`/quizzes/${quiz.id}`}
                  className="block rounded-2xl border border-slate-700 bg-slate-800/40 p-4 hover:border-cyan-400/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">{quiz.title}</p>
                      <p className="text-sm text-slate-400">
                        {quiz.question_count} questions
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs border border-slate-600 bg-slate-900/70 text-slate-300 capitalize">
                      {quiz.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">
              Recent Notes
            </h2>
            <Link to="/notes" className="text-sm text-fuchsia-300 hover:text-fuchsia-200">
              Open notes
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-400" />
            </div>
          ) : summary.recent_notes.length === 0 ? (
            <p className="text-slate-400">
              No saved notes yet. Generate a note pack to start building your
              library.
            </p>
          ) : (
            <div className="space-y-3">
              {summary.recent_notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-slate-700 bg-slate-800/40 p-4"
                >
                  <p className="font-semibold text-slate-100">{note.title}</p>
                  <p className="text-sm text-slate-400 mt-1">{note.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
