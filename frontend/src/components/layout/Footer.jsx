import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-700/70 bg-slate-950/80 backdrop-blur text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black text-lg shadow-md shadow-cyan-500/30">
                Q
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
                Quizify
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-400 max-w-md">
              Master your skills with interactive quizzes. Learn, practice, and
              climb the leaderboard!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-100 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/quizzes"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/notes"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/assistant"
                  className="hover:text-cyan-300 transition-colors"
                >
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-slate-100 font-semibold mb-4">Subjects</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Coding
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Mathematics
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Physics
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Science
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Quizify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
