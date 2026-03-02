import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Target, Layers, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { quizAPI } from "../services/api";

export default function QuizGenerator() {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    difficulty: "medium",
    question_count: 5,
    quiz_type: "multiple-choice",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await quizAPI.generateQuiz(formData);
      toast.success("Quiz generated successfully!");
      navigate(`/quizzes/${response.data.id}`);
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to generate quiz";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Quiz</h1>
        <p className="text-gray-600 mt-2">
          Create an AI-powered quiz on any topic
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="label flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Python Programming, Calculus, Physics"
              required
            />
          </div>

          <div>
            <label htmlFor="topic" className="label flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Specific Topic (optional)
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Loops and Functions, Derivatives, Thermodynamics"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="difficulty" className="label flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="input"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="question_count"
                className="label flex items-center"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Questions
              </label>
              <select
                id="question_count"
                name="question_count"
                value={formData.question_count}
                onChange={handleChange}
                className="input"
              >
                <option value="5">5 questions</option>
                <option value="10">10 questions</option>
                <option value="15">15 questions</option>
                <option value="20">20 questions</option>
              </select>
            </div>

            <div>
              <label htmlFor="quiz_type" className="label">
                Quiz Type
              </label>
              <select
                id="quiz_type"
                name="quiz_type"
                value={formData.quiz_type}
                onChange={handleChange}
                className="input"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="btn btn-primary w-full py-3 text-lg"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Quiz...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Quiz
              </span>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">
          Tips for better quizzes:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific with your subject for more focused questions</li>
          <li>• Add a topic to narrow down the quiz content</li>
          <li>• Start with medium difficulty and adjust based on your level</li>
        </ul>
      </div>
    </div>
  );
}
