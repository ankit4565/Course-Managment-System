import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      setMessage(response.data.message || "OTP sent to your email");

      setTimeout(() => {
        navigate("/reset-password", {
          state: {
            email,
            otpSent: true,
          },
        });
      }, 1200);
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-8 top-8 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
            Password recovery
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Forgot Password</h1>
          <p className="mt-2 text-sm text-slate-600">
            We will send a one-time password to your email.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-xl p-4 text-sm text-white ${
              success ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Remember your password?
          <Link to="/" className="ml-1 font-semibold text-cyan-700 hover:underline">
            Login
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-slate-600">
          Don't have an account?
          <Link to="/register" className="ml-1 font-semibold text-cyan-700 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
