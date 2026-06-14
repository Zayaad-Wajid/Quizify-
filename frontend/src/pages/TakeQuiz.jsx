import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle,
  Circle,
  Clock,
  Flag,
  RotateCcw,
  ShieldCheck,
  Trophy,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { quizAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !result) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, result]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(id);
      setQuiz(response.data);
    } catch (error) {
      toast.error("Failed to load quiz");
      navigate("/quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      // Calculate result locally for non-authenticated users
      const questions = quiz.questions;
      let score = 0;
      const correct = [];
      const wrong = [];

      questions.forEach((q) => {
        const userAnswer = answers[q.id];
        if (
          userAnswer &&
          userAnswer.toUpperCase() === q.correct_answer.toUpperCase()
        ) {
          score++;
          correct.push(q.id);
        } else {
          wrong.push(q.id);
        }
      });

      setResult({
        score,
        total_questions: questions.length,
        percentage: (score / questions.length) * 100,
        correct_answers: correct,
        wrong_answers: wrong,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await quizAPI.submitQuiz(id, {
        quiz_id: parseInt(id),
        answers,
        time_taken: timeElapsed,
      });
      setResult(response.data);
      toast.success("Quiz submitted!");
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (result) {
    const percentage = result.percentage;
    const isPassing = percentage >= 70;
    const performanceBand =
      percentage >= 90
        ? "Outstanding"
        : percentage >= 75
          ? "Strong"
          : percentage >= 60
            ? "Developing"
            : "Needs Practice";

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary-900 px-6 md:px-8 py-8 text-white">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 border border-white/20 mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <p className="text-center text-sm tracking-wide uppercase text-slate-200">
              Quiz Result
            </p>
            <h1 className="text-center text-3xl font-bold mt-2">
              {isPassing ? "Assessment Completed" : "Keep Improving"}
            </h1>
            <p className="text-center text-slate-200 mt-2">
              {quiz.title} • Completed in {formatTime(timeElapsed)}
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-600">Final Score</p>
                <p className="text-5xl font-bold text-slate-900 mt-2">
                  {Math.round(percentage)}%
                </p>
                <p className="text-slate-600 mt-2">
                  {result.score} / {result.total_questions} correct
                </p>
                <p className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                  <ShieldCheck className="w-4 h-4" />
                  {performanceBand}
                </p>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-700">
                  {result.correct_answers.length}
                </p>
                <p className="text-sm text-green-700">Correct Answers</p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <XCircle className="w-6 h-6 text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-700">
                  {result.wrong_answers.length}
                </p>
                <p className="text-sm text-red-700">Incorrect Answers</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-3">
                Performance Breakdown
              </h2>
              <div className="h-3 rounded-full overflow-hidden bg-slate-100">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-3">
                You answered {result.correct_answers.length} questions
                correctly. Review missed concepts and retake for mastery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setTimeElapsed(0);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-4 py-2.5 font-semibold text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Quiz
              </button>
              <button
                onClick={() => navigate("/quizzes")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                More Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const remainingCount = quiz.questions.length - answeredCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Live Session
            </p>
            <h1 className="text-lg font-bold text-slate-900 mt-1 line-clamp-2">
              {quiz.title}
            </h1>

            <div className="mt-4 rounded-xl bg-slate-900 text-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-200">Time Elapsed</p>
                <Clock className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-3xl font-bold mt-2">
                {formatTime(timeElapsed)}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {answeredCount} answered • {remainingCount} remaining
              </p>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-800 mb-2">
                Question Navigator
              </p>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((q, index) => {
                  const isCurrent = index === currentQuestion;
                  const isAnswered = Boolean(answers[q.id]);

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`h-9 rounded-lg text-xs font-semibold border transition-colors ${
                        isCurrent
                          ? "border-primary-600 bg-primary-600 text-white"
                          : isAnswered
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={answeredCount < quiz.questions.length || isSubmitting}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </button>
          </div>
        </aside>

        <main className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-primary-700">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mt-2 leading-snug">
                  {question.question}
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 px-3 py-1.5 text-xs font-semibold">
                <Brain className="w-4 h-4" />
                Focus Mode
              </div>
            </div>

            <div className="space-y-3">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.label;
                return (
                  <button
                    key={option.label}
                    onClick={() => handleAnswer(question.id, option.label)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      selected
                        ? "border-primary-600 bg-primary-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          selected
                            ? "bg-primary-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {option.label}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-800 leading-relaxed">
                          {option.text}
                        </p>
                      </div>
                      {selected ? (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-slate-700 font-semibold hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={
                    Object.keys(answers).length < quiz.questions.length ||
                    isSubmitting
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Flag className="w-4 h-4" />
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-white font-semibold hover:bg-primary-700"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            {remainingCount === 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                All questions answered. You can submit any time.
              </>
            ) : (
              <>
                <Flag className="w-4 h-4 text-amber-600" />
                Answer {remainingCount} more question
                {remainingCount > 1 ? "s" : ""} before submitting.
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
