import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      // save token
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful");

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur"
      >

        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
            Course Management
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Access your dashboard, enrollments, and account settings.
          </p>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4 outline-none focus:border-slate-400"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 mb-2 outline-none focus:border-slate-400"
          onChange={handleChange}
          required
        />

        <div className="mb-5 flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-cyan-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {
            loading
            ? "Loading..."
            : "Login"
          }
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don't have an account?

          <Link
            to="/register"
            className="ml-1 font-semibold text-cyan-700 hover:underline"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;