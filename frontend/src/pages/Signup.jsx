import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim().toLowerCase(),
    };

    if (!payload.first_name || !payload.last_name || !payload.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    if (payload.password !== payload.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    if (payload.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signup(payload);
      toast.success("Account created successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Signup failed. Make sure the backend server is running.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 lg:grid-cols-[1fr_520px]">
        <section className="hidden border-r border-white/10 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Quizify
          </Link>

          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
              <Sparkles className="mr-2 h-4 w-4" />
              Build your study profile
            </div>
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Create smarter quizzes and notes from day one.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Your account keeps generated lessons, quiz attempts, and learning
              progress connected across every session.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4 text-sm text-slate-300">
            <div className="border-l border-emerald-400/40 pl-4">
              <span className="block text-2xl font-semibold text-white">
                Save
              </span>
              Personal notes
            </div>
            <div className="border-l border-cyan-400/40 pl-4">
              <span className="block text-2xl font-semibold text-white">
                Rank
              </span>
              Leaderboard scores
            </div>
            <div className="border-l border-fuchsia-400/40 pl-4">
              <span className="block text-2xl font-semibold text-white">
                Grow
              </span>
              Daily practice
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="text-2xl font-bold tracking-wide">
                Quizify
              </Link>
            </div>

            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
                New account
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Join Quizify
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Start saving your quizzes, notes, and progress.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-10 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                        placeholder="John"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-10 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                        placeholder="Doe"
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-10 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-10 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm_password"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirm_password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-10 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="flex items-start rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
                  <BookOpenCheck className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                  One account unlocks saved notes, quiz progress, and
                  leaderboard tracking.
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
