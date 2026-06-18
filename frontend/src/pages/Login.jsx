import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
    };

    if (!payload.email || !payload.password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    try {
      await login(payload);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Login failed. Make sure the backend server is running.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 lg:grid-cols-[1fr_480px]">
        <section className="hidden border-r border-white/10 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Quizify
          </Link>

          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Secure learner workspace
            </div>
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Pick up exactly where your learning left off.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Sign in to generate quizzes, save notes, track scores, and keep
              your study history in one place.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4 text-sm text-slate-300">
            <div className="border-l border-cyan-400/40 pl-4">
              <span className="block text-2xl font-semibold text-white">
                AI
              </span>
              Quiz builder
            </div>
            <div className="border-l border-emerald-400/40 pl-4">
              <span className="block text-2xl font-semibold text-white">
                24/7
              </span>
              Study assistant
            </div>
            <div className="border-l border-fuchsia-400/40 pl-4">
              <span className="block text-2xl font-semibold text-white">
                Live
              </span>
              Progress scores
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
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Sign in to Quizify
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Continue learning with your saved quizzes and notes.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-10 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
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
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-10 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
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

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-500 focus:ring-cyan-300"
                  />
                  <span className="ml-2 text-sm text-slate-300">
                    Remember this device
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
