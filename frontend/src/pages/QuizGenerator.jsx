import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Target,
  Layers,
  HelpCircle,
  ClipboardCheck,
  GraduationCap,
  Rocket,
} from "lucide-react";
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

  const detailLabel = useMemo(() => {
    const difficultyMap = {
      easy: "Foundational",
      medium: "Applied",
      hard: "Advanced",
    };
    return difficultyMap[formData.difficulty] || "Applied";
  }, [formData.difficulty]);

  const quickSubjects = [
    "Python",
    "JavaScript",
    "Mathematics",
    "Physics",
    "Biology",
    "World History",
  ];

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

  const setDifficulty = (difficulty) => {
    setFormData((prev) => ({ ...prev, difficulty }));
  };

  const setQuestionCount = (question_count) => {
    setFormData((prev) => ({ ...prev, question_count }));
  };

  const setQuizType = (quiz_type) => {
    setFormData((prev) => ({ ...prev, quiz_type }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 p-8 md:p-10 text-white shadow-2xl">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-10 w-44 h-44 bg-primary-300/30 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold tracking-wide uppercase mb-5">
                <ClipboardCheck className="w-4 h-4" />
                Assessment Studio
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Build professional quizzes in minutes.
              </h1>
              <p className="mt-4 text-slate-100/90 max-w-2xl">
                Generate polished, exam-ready assessments with clear structure,
                balanced difficulty, and focused learning outcomes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
                <div className="rounded-xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-slate-200">Difficulty Profile</p>
                  <p className="text-lg font-semibold mt-1">{detailLabel}</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-slate-200">Question Count</p>
                  <p className="text-lg font-semibold mt-1">
                    {formData.question_count} Questions
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-slate-200">Format</p>
                  <p className="text-lg font-semibold mt-1 capitalize">
                    {formData.quiz_type.replace("-", " ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-800 mb-3">
              Quick start subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSubjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, subject }))}
                  className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 text-sm hover:border-primary-500 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-7 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Quiz Generation Setup
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              Configure your assessment and generate a complete quiz with
              grading-ready questions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
                  placeholder="e.g., Calculus, Biology, Data Structures"
                  required
                />
              </div>

              <div>
                <label htmlFor="topic" className="label flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Focus Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Derivatives, Thermodynamics, Async/Await"
                />
              </div>

              <div>
                <label className="label flex items-center mb-2">
                  <Layers className="w-4 h-4 mr-2" />
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`rounded-xl px-3 py-2 text-sm font-semibold capitalize border transition-all ${
                        formData.difficulty === level
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label flex items-center mb-2">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Question Count
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-xl px-3 py-2 text-sm font-semibold border transition-all ${
                        Number(formData.question_count) === count
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label flex items-center mb-2">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Quiz Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { value: "multiple-choice", label: "Multiple Choice" },
                    { value: "true-false", label: "True / False" },
                    { value: "mixed", label: "Mixed" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setQuizType(type.value)}
                      className={`rounded-xl px-3 py-2 text-sm font-semibold border transition-all ${
                        formData.quiz_type === type.value
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
                    Generating Professional Quiz...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Generate Quiz
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Quality tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-primary-600" />
                Use a specific topic to improve question relevance.
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-primary-600" />
                Choose medium for balanced conceptual and applied questions.
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-primary-600" />
                Use mixed mode to diversify preparation and reduce memorization.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
