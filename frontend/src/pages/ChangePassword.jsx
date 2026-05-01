import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setSuccess(false);
      setMessage("New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setSuccess(false);
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setSuccess(false);
      setMessage("New password must be different from old password");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(true);
      setMessage(response.data.message);
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[radial-gradient(circle_at_top,_#0f766e,_#0f172a_72%)] p-8 text-white lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Account Security
              </p>
              <h1 className="mt-4 text-3xl font-bold">Change Password</h1>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Update your password without leaving the app. Your current password is required for verification.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-100">
                <p className="font-semibold text-white">Password rules</p>
                <ul className="mt-3 space-y-2">
                  <li>• At least 6 characters</li>
                  <li>• Must differ from your current password</li>
                  <li>• Confirmation must match</li>
                </ul>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-slate-900">Update credentials</h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter your current password and choose a stronger replacement.
              </p>

          {message && (
            <div
              className={`mt-6 rounded-xl p-4 text-sm text-white ${
                success ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message}
            </div>
          )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Enter current password"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-slate-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ChangePassword;
