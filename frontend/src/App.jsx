import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Quizzes from "./pages/Quizzes";
import QuizGenerator from "./pages/QuizGenerator";
import TakeQuiz from "./pages/TakeQuiz";
import Notes from "./pages/Notes";
import NoteGenerator from "./pages/NoteGenerator";
import Leaderboard from "./pages/Leaderboard";
import Assistant from "./pages/Assistant";

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/generate" element={<QuizGenerator />} />
          <Route path="/quizzes/:id" element={<TakeQuiz />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/generate" element={<NoteGenerator />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
