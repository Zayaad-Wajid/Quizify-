import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white">
              Quizify
            </Link>
            <p className="mt-3 text-sm">
              Master your skills with interactive quizzes. Learn, practice, and
              climb the leaderboard!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/quizzes"
                  className="hover:text-white transition-colors"
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="hover:text-white transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/notes"
                  className="hover:text-white transition-colors"
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/assistant"
                  className="hover:text-white transition-colors"
                >
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-white font-semibold mb-4">Subjects</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Coding
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Mathematics
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Physics
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Science
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Quizify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
