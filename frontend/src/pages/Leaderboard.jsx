import { useEffect, useState } from "react";
import { Medal, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { leaderboardAPI } from "../services/api";

const medalColors = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-400",
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: "",
    time_period: "all-time",
  });

  useEffect(() => {
    fetchSubjects();
    fetchLeaderboard();
  }, [filters]);

  const fetchSubjects = async () => {
    try {
      const response = await leaderboardAPI.getSubjects();
      setSubjects(response.data);
    } catch {
      // no-op
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard(filters);
      setLeaderboard(response.data);
    } catch {
      toast.error("Failed to load leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-8 md:p-10 shadow-2xl mb-8">
        <div className="absolute -top-16 right-10 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-amber-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-400/30">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100">
            Leaderboard
          </h1>
          <p className="text-slate-300 mt-2">
            See how learners rank across quizzes and subjects.
          </p>
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
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Time Period</label>
            <select
              value={filters.time_period}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, time_period: e.target.value }))
              }
              className="input"
            >
              <option value="all-time">All Time</option>
              <option value="this-month">This Month</option>
              <option value="this-week">This Week</option>
            </select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            No rankings yet
          </h3>
          <p className="text-slate-400">
            Complete quizzes to appear on the leaderboard.
          </p>
        </div>
      ) : (
        <>
          {topThree.length > 0 && (
            <section className="flex justify-center items-end gap-4 mb-10">
              {topThree[1] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-slate-600">
                    <span className="text-2xl font-bold text-slate-100">
                      {topThree[1].user_name.charAt(0)}
                    </span>
                  </div>
                  <Medal className={`w-8 h-8 mx-auto mb-1 ${medalColors[2]}`} />
                  <p className="font-semibold text-slate-100">
                    {topThree[1].user_name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {topThree[1].total_score} pts
                  </p>
                  <div className="h-16 bg-slate-700 rounded-t-lg mt-2 w-24" />
                </div>
              )}

              {topThree[0] && (
                <div className="text-center -mt-8">
                  <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-amber-400/60">
                    <span className="text-3xl font-bold text-amber-200">
                      {topThree[0].user_name.charAt(0)}
                    </span>
                  </div>
                  <Medal
                    className={`w-10 h-10 mx-auto mb-1 ${medalColors[1]}`}
                  />
                  <p className="text-lg font-bold text-slate-100">
                    {topThree[0].user_name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {topThree[0].total_score} pts
                  </p>
                  <div className="h-24 bg-amber-700/50 rounded-t-lg mt-2 w-28" />
                </div>
              )}

              {topThree[2] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-amber-700/70">
                    <span className="text-2xl font-bold text-amber-200">
                      {topThree[2].user_name.charAt(0)}
                    </span>
                  </div>
                  <Medal className={`w-8 h-8 mx-auto mb-1 ${medalColors[3]}`} />
                  <p className="font-semibold text-slate-100">
                    {topThree[2].user_name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {topThree[2].total_score} pts
                  </p>
                  <div className="h-12 bg-amber-700/40 rounded-t-lg mt-2 w-24" />
                </div>
              )}
            </section>
          )}

          <section className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-slate-900/80 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                      Quizzes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                      Avg Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                      Total Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {rest.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-slate-200">
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-400/40 rounded-full flex items-center justify-center mr-3">
                            <span className="font-medium text-cyan-200">
                              {entry.user_name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-slate-100">
                            {entry.user_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {entry.quizzes_completed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {entry.average_score.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-cyan-300">
                          {entry.total_score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
