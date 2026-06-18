import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Grid, List, Plus, Search, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { notesAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";

const categories = [
  { value: "all", label: "All Notes" },
  { value: "coding", label: "Coding" },
];

export default function Notes() {
  const { isAuthenticated } = useAuthStore();

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
    } catch {
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
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const response = await notesAPI.toggleFavorite(id);
      setNotes(notes.map((n) => (n.id === id ? response.data : n)));
    } catch {
      toast.error("Failed to update note");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Sign in to access Notes
        </h1>
        <p className="text-slate-400 mb-6">
          Create and manage your personal coding study notes
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-800 to-fuchsia-950 p-8 md:p-10 shadow-2xl mb-8">
        <div className="absolute -top-12 right-10 w-56 h-56 bg-fuchsia-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300 font-semibold">
              Knowledge Vault
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2">
              My Notes
            </h1>
            <p className="text-slate-300 mt-2">
              Organize and review AI-generated coding study materials.
            </p>
          </div>
          <Link to="/notes/generate" className="btn btn-secondary">
            <Plus className="w-5 h-5 mr-2" />
            Generate Notes
          </Link>
        </div>
      </section>

      <section className="card mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
              placeholder="Search notes..."
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  category === cat.value
                    ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/40"
                    : "bg-slate-800/70 text-slate-300 border-slate-700 hover:border-slate-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-slate-700 text-slate-100" : "text-slate-400"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-slate-700 text-slate-100" : "text-slate-400"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
        </div>
      ) : notes.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            No notes yet
          </h3>
          <p className="text-slate-400 mb-4">
            Start by generating AI-powered notes.
          </p>
          <Link to="/notes/generate" className="btn btn-secondary">
            <Plus className="w-5 h-5 mr-2" />
            Generate Notes
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {notes.map((note) => (
            <div
              key={note.id}
              className="card cursor-pointer border border-transparent hover:border-cyan-400/40"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/30 rounded-full text-xs font-medium">
                  {note.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(note.id);
                    }}
                    className={`p-1 rounded ${note.is_favorite ? "text-yellow-400" : "text-slate-500 hover:text-yellow-300"}`}
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
                    className="p-1 rounded text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-sm text-slate-400">{note.subject}</p>
            </div>
          ))}
        </div>
      )}

      {selectedNote && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {selectedNote.subject}
                  </p>
                  <h2 className="text-base font-bold text-slate-100 leading-tight">
                    {selectedNote.topic || selectedNote.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-lg font-bold"
              >
                x
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-8 py-6">
              <div className="prose prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2 prose-p:leading-relaxed prose-li:leading-relaxed prose-blockquote:border-cyan-400 prose-blockquote:bg-cyan-500/10 prose-blockquote:rounded prose-blockquote:px-4 prose-blockquote:py-1 prose-hr:border-slate-700 max-w-none">
                <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-700 bg-slate-900/90 rounded-b-2xl flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                {new Date(selectedNote.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-sm text-slate-400 hover:text-slate-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
