import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Trophy,
  MessageCircle,
  Sparkles,
  Users,
  Target,
  ArrowRight,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Quizzes",
    description:
      "Challenge yourself with AI-generated quizzes across multiple subjects and difficulty levels.",
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description:
      "Generate comprehensive study notes powered by AI or create your own personalized notes.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description:
      "Compete with others and track your progress on our global leaderboard.",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description:
      "Get instant help with your studies from our intelligent AI learning assistant.",
  },
];

const subjects = [
  {
    name: "Coding",
    topics: ["Python", "JavaScript", "Java"],
    color: "from-cyan-400 to-blue-600",
  },
  {
    name: "Mathematics",
    topics: ["Calculus", "Algebra", "Statistics"],
    color: "from-emerald-400 to-teal-600",
  },
  {
    name: "Physics",
    topics: ["Mechanics", "Electromagnetism", "Thermodynamics"],
    color: "from-fuchsia-400 to-violet-600",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[32rem] h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 text-xs font-semibold tracking-wide uppercase mb-5">
                <Brain className="w-4 h-4" />
                AI-Powered Learning Experience
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-slate-100">
                Learn smarter with
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Quizify
                </span>
              </h1>

              <p className="mt-5 text-lg text-slate-300 max-w-2xl">
                A professional interactive learning platform for quizzes, notes,
                and AI-assisted study sessions across coding, mathematics,
                physics, and more.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/quizzes"
                  className="btn btn-primary px-7 py-3 text-base"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Practicing
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-outline px-7 py-3 text-base border-cyan-400/50"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="theme-panel p-6 md:p-7 shadow-2xl">
                <p className="text-sm text-slate-400">Learning Snapshot</p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4">
                    <p className="text-xs text-slate-400">Weekly progress</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-cyan-400 to-blue-500" />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      67% goal completed
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                      <p className="text-xs text-slate-400">Quizzes</p>
                      <p className="text-2xl font-bold text-slate-100 mt-1">
                        500+
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                      <p className="text-xs text-slate-400">Topics</p>
                      <p className="text-2xl font-bold text-slate-100 mt-1">
                        50+
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-3">
              Built for focused, modern learning
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every part of Quizify is designed to make study sessions
              structured, engaging, and measurable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cyan-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-3">
              Explore Subjects
            </h2>
            <p className="text-slate-400">
              Choose a domain and start with professional practice quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map(({ name, topics, color }) => (
              <div key={name} className="card">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3">
                  {name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 rounded-full text-xs border border-slate-600 bg-slate-800/70 text-slate-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/quizzes?subject=${name.toLowerCase()}`}
                  className="inline-flex items-center mt-5 text-cyan-300 hover:text-cyan-200 font-medium"
                >
                  Explore {name}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="theme-panel p-6 text-center">
              <div className="flex items-center justify-center mb-2 text-cyan-300">
                <Users className="w-7 h-7 mr-2" />
                <span className="text-4xl font-bold text-slate-100">1000+</span>
              </div>
              <p className="text-slate-400">Active Learners</p>
            </div>
            <div className="theme-panel p-6 text-center">
              <div className="flex items-center justify-center mb-2 text-cyan-300">
                <BookOpen className="w-7 h-7 mr-2" />
                <span className="text-4xl font-bold text-slate-100">500+</span>
              </div>
              <p className="text-slate-400">Quizzes Generated</p>
            </div>
            <div className="theme-panel p-6 text-center">
              <div className="flex items-center justify-center mb-2 text-cyan-300">
                <Target className="w-7 h-7 mr-2" />
                <span className="text-4xl font-bold text-slate-100">50+</span>
              </div>
              <p className="text-slate-400">Topics Covered</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="theme-panel p-8 md:p-10">
            <h2 className="text-3xl font-bold text-slate-100 mb-3">
              Ready to level up your learning?
            </h2>
            <p className="text-slate-400 mb-7">
              Join Quizify and build stronger study habits with AI-guided
              quizzes, notes, and feedback.
            </p>
            <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
