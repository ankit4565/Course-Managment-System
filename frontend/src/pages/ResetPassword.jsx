import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const prefills = location.state || {};
    if (prefills.email) {
      setFormData((current) => ({
        ...current,
        email: prefills.email,
      }));
    }
    if (prefills.otpSent) {
      setSuccess(true);
      setMessage(`OTP sent to ${prefills.email}. Enter it below to reset your password.`);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setSuccess(false);
      setMessage("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(true);
      setMessage(response.data.message || "Password reset successfully");

      setTimeout(() => {
        navigate("/");
      }, 1800);
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
        <div className="absolute left-8 top-8 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
            OTP reset
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-600">
            Verify the OTP sent to your email and choose a new password.
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
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
          required
        />

        <label className="mb-2 block text-sm font-medium text-slate-700">
          OTP
        </label>
        <input
          type="text"
          name="otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="6-digit OTP"
          value={formData.otp}
          onChange={(e) =>
            setFormData({
              ...formData,
              otp: e.target.value.replace(/\D/g, ""),
            })
          }
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-lg tracking-[0.4em] outline-none transition focus:border-slate-400"
          required
        />

        <label className="mb-2 block text-sm font-medium text-slate-700">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={formData.newPassword}
          onChange={handleChange}
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
          required
        />

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Remember your password?
          <Link to="/" className="ml-1 font-semibold text-cyan-700 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
