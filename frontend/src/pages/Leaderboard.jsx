import { useState, useEffect } from "react";
import { Trophy, Medal, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { leaderboardAPI } from "../services/api";

const medalColors = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
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
    } catch (error) {
      console.error("Failed to load subjects");
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard(filters);
      setLeaderboard(response.data);
    } catch (error) {
      toast.error("Failed to load leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-2">
          See how you rank against other learners
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="label">Subject</label>
            <select
              value={filters.subject}
              onChange={(e) =>
                setFilters({ ...filters, subject: e.target.value })
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
          <div className="flex-1">
            <label className="label">Time Period</label>
            <select
              value={filters.time_period}
              onChange={(e) =>
                setFilters({ ...filters, time_period: e.target.value })
              }
              className="input"
            >
              <option value="all-time">All Time</option>
              <option value="this-month">This Month</option>
              <option value="this-week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No rankings yet
          </h3>
          <p className="text-gray-600">
            Complete quizzes to appear on the leaderboard!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="flex justify-center items-end gap-4 mb-12">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-gray-300">
                    <span className="text-2xl font-bold text-gray-700">
                      {topThree[1].user_name.charAt(0)}
                    </span>
                  </div>
                  <Medal className={`w-8 h-8 mx-auto mb-1 ${medalColors[2]}`} />
                  <p className="font-semibold text-gray-900">
                    {topThree[1].user_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {topThree[1].total_score} pts
                  </p>
                  <div className="h-16 bg-gray-200 rounded-t-lg mt-2 w-24"></div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="text-center -mt-8">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-yellow-400">
                    <span className="text-3xl font-bold text-yellow-700">
                      {topThree[0].user_name.charAt(0)}
                    </span>
                  </div>
                  <Medal
                    className={`w-10 h-10 mx-auto mb-1 ${medalColors[1]}`}
                  />
                  <p className="text-lg font-bold text-gray-900">
                    {topThree[0].user_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {topThree[0].total_score} pts
                  </p>
                  <div className="h-24 bg-yellow-200 rounded-t-lg mt-2 w-28"></div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-amber-400">
                    <span className="text-2xl font-bold text-amber-700">
                      {topThree[2].user_name.charAt(0)}
                    </span>
                  </div>
                  <Medal className={`w-8 h-8 mx-auto mb-1 ${medalColors[3]}`} />
                  <p className="font-semibold text-gray-900">
                    {topThree[2].user_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {topThree[2].total_score} pts
                  </p>
                  <div className="h-12 bg-amber-100 rounded-t-lg mt-2 w-24"></div>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quizzes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rest.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-gray-700">
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="font-medium text-primary-700">
                            {entry.user_name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {entry.user_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {entry.quizzes_completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {entry.average_score.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary-600">
                        {entry.total_score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
