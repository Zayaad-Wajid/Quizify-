import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
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

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div
            className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isPassing ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <Trophy
              className={`w-10 h-10 ${isPassing ? "text-green-600" : "text-yellow-600"}`}
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isPassing ? "Excellent Work!" : "Good Effort!"}
          </h1>

          <p className="text-gray-600 mb-6">
            You completed the quiz in {formatTime(timeElapsed)}
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-primary-600 mb-2">
              {Math.round(percentage)}%
            </div>
            <p className="text-gray-600">
              {result.score} out of {result.total_questions} correct
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {result.correct_answers.length}
              </div>
              <p className="text-sm text-green-700">Correct</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {result.wrong_answers.length}
              </div>
              <p className="text-sm text-red-700">Incorrect</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                setCurrentQuestion(0);
                setTimeElapsed(0);
              }}
              className="btn btn-outline flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Quiz
            </button>
            <button
              onClick={() => navigate("/quizzes")}
              className="btn btn-primary flex-1"
            >
              More Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
          {quiz.title}
        </h1>
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-2" />
          {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleAnswer(question.id, option.label)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[question.id] === option.label
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-medium ${
                  answers[question.id] === option.label
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {option.label}
              </span>
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn btn-outline disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={
              Object.keys(answers).length < quiz.questions.length ||
              isSubmitting
            }
            className="btn btn-primary"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button onClick={handleNext} className="btn btn-primary">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {quiz.questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentQuestion
                ? "bg-primary-600 w-6"
                : answers[q.id]
                  ? "bg-green-500"
                  : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
