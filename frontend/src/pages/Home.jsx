import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Trophy,
  MessageCircle,
  Sparkles,
  Users,
  Target,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Quizzes",
    description:
      "Challenge yourself with AI-generated quizzes across multiple subjects and difficulty levels.",
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description:
      "Generate comprehensive study notes powered by AI or create your own personalized notes.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description:
      "Compete with others and track your progress on our global leaderboard.",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description:
      "Get instant help with your studies from our intelligent AI learning assistant.",
  },
];

const subjects = [
  {
    name: "Coding",
    topics: ["Python", "JavaScript", "Java"],
    color: "bg-blue-500",
  },
  {
    name: "Mathematics",
    topics: ["Calculus", "Algebra", "Statistics"],
    color: "bg-green-500",
  },
  {
    name: "Physics",
    topics: ["Mechanics", "Electromagnetism", "Thermodynamics"],
    color: "bg-purple-500",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Master Your Skills with Interactive Quizzes
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Challenge yourself with coding, mathematics, physics, and more.
              Learn, practice, and climb the leaderboard!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quizzes"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Learning
              </Link>
              <Link
                to="/signup"
                className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Quizify?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers a range of features designed to enhance your
              learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card text-center group">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Subjects
            </h2>
            <p className="text-lg text-gray-600">
              Choose from a variety of subjects and topics to master
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subjects.map(({ name, topics, color }) => (
              <div key={name} className="card">
                <div
                  className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/quizzes?subject=${name.toLowerCase()}`}
                  className="block mt-4 text-primary-600 font-medium hover:text-primary-700"
                >
                  Explore {name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 mr-2" />
                <span className="text-4xl font-bold">1000+</span>
              </div>
              <p className="text-primary-100">Active Learners</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 mr-2" />
                <span className="text-4xl font-bold">500+</span>
              </div>
              <p className="text-primary-100">Quizzes Generated</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Target className="w-8 h-8 mr-2" />
                <span className="text-4xl font-bold">50+</span>
              </div>
              <p className="text-primary-100">Topics Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of learners who are mastering new skills every day
            with Quizify.
          </p>
          <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
