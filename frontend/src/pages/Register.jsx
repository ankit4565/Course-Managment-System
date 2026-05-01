import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/auth/register", formData);
      setMessage(response.data.message || "OTP sent to your email");
      setSuccess(true);
      setStep("verify");
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-register-otp", {
        email: formData.email,
        otp,
      });

      setSuccess(true);
      setMessage(response.data.message || "Email verified successfully");
      setOtp("");

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
        <div className="absolute left-8 top-8 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
            Create account
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {step === "register" ? "Register" : "Verify OTP"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {step === "register"
              ? "Create your account with email verification"
              : `Enter the OTP sent to ${formData.email}.`}
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

        {step === "register" ? (
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
              onChange={handleChange}
              required
            />

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Select Role
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "USER",
                    })
                  }
                  className={`flex-1 rounded-xl px-4 py-3 font-semibold transition ${
                    formData.role === "USER"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  USER
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "ADMIN",
                    })
                  }
                  className={`flex-1 rounded-xl px-4 py-3 font-semibold transition ${
                    formData.role === "ADMIN"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  ADMIN
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit}>
           

            <label className="mb-2 block text-sm font-medium text-slate-700">
              OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit OTP"
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-lg tracking-[0.4em] outline-none transition focus:border-slate-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("register");
                setMessage("");
              }}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Edit registration details
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?
          <Link to="/" className="ml-1 font-semibold text-cyan-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
