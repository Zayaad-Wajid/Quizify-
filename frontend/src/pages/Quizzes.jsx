import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Filter,
  Search,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { quizAPI } from "../services/api";

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
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
    } catch (error) {
      toast.error("Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600 mt-1">
            Test your knowledge with interactive quizzes
          </p>
        </div>
        <Link to="/quizzes/generate" className="btn btn-primary mt-4 md:mt-0">
          <Plus className="w-5 h-5 mr-2" />
          Generate Quiz
        </Link>
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
              <option value="coding">Coding</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="science">Science</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="label">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
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
      </div>

      {/* Quiz Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by generating your first quiz!
          </p>
          <Link to="/quizzes/generate" className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Generate Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[quiz.difficulty]}`}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {quiz.title}
              </h3>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Target className="w-4 h-4 mr-1" />
                {quiz.question_count} questions
              </div>

              <Link
                to={`/quizzes/${quiz.id}`}
                className="flex items-center justify-center w-full btn btn-outline group-hover:btn-primary"
              >
                Take Quiz
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
