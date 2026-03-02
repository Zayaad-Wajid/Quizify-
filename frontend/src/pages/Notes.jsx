import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Star,
  Trash2,
  Edit,
  Grid,
  List,
} from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { notesAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";

const categories = [
  { value: "all", label: "All Notes" },
  { value: "coding", label: "Coding" },
  { value: "mathematics", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "general", label: "General" },
];

export default function Notes() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, category, search]);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes({ category, search });
      setNotes(response.data);
    } catch (error) {
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const response = await notesAPI.toggleFavorite(id);
      setNotes(notes.map((n) => (n.id === id ? response.data : n)));
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sign in to access Notes
        </h1>
        <p className="text-gray-600 mb-6">
          Create and manage your personal study notes
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">
            Organize and review your study materials
          </p>
        </div>
        <Link to="/notes/generate" className="btn btn-primary mt-4 md:mt-0">
          <Plus className="w-5 h-5 mr-2" />
          Generate Notes
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
              placeholder="Search notes..."
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat.value
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : ""}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : ""}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid/List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by generating AI-powered notes!
          </p>
          <Link to="/notes/generate" className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Generate Notes
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {notes.map((note) => (
            <div
              key={note.id}
              className="card cursor-pointer hover:border-primary-300 border-2 border-transparent"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {note.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(note.id);
                    }}
                    className={`p-1 rounded hover:bg-gray-100 ${note.is_favorite ? "text-yellow-500" : "text-gray-400"}`}
                  >
                    <Star
                      className="w-5 h-5"
                      fill={note.is_favorite ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-sm text-gray-500">{note.subject}</p>
            </div>
          ))}
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedNote.title}</h2>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] prose prose-sm max-w-none">
              <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
