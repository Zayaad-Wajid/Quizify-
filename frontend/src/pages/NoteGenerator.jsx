import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Target, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { notesAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function NoteGenerator() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    detail_level: "medium",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to generate notes");
      navigate("/login");
      return;
    }

    if (!formData.subject.trim() || !formData.topic.trim()) {
      toast.error("Please enter both subject and topic");
      return;
    }

    setIsGenerating(true);

    try {
      await notesAPI.generateNotes(formData);
      toast.success("Notes generated successfully!");
      navigate("/notes");
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to generate notes";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-secondary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Notes</h1>
        <p className="text-gray-600 mt-2">
          Create comprehensive study notes powered by AI
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
              placeholder="e.g., Physics, Mathematics, Programming"
              required
            />
          </div>

          <div>
            <label htmlFor="topic" className="label flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Topic *
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Newton's Laws, Calculus Derivatives, React Hooks"
              required
            />
          </div>

          <div>
            <label htmlFor="detail_level" className="label flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Detail Level
            </label>
            <select
              id="detail_level"
              name="detail_level"
              value={formData.detail_level}
              onChange={handleChange}
              className="input"
            >
              <option value="brief">Brief (Key points only)</option>
              <option value="medium">Medium (Balanced detail)</option>
              <option value="comprehensive">
                Comprehensive (In-depth coverage)
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="btn btn-secondary w-full py-3 text-lg"
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
                Generating Notes...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Notes
              </span>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-2">What you'll get:</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Well-structured notes with clear headings</li>
          <li>• Key concepts and definitions</li>
          <li>• Relevant examples and explanations</li>
          <li>• Summary and key takeaways</li>
        </ul>
      </div>
    </div>
  );
}
