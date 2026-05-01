import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="border-b border-white/10 bg-slate-950/95 px-4 py-4 text-white shadow-lg backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Course Management</p>
          <h1 className="text-xl font-semibold">Learn, enroll, and manage</h1>
        </button>

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
          {user && (
            <>
              <span className="rounded-full bg-white/10 px-3 py-2 text-slate-200">
                Welcome, {user.name}
              </span>

              {user.role === "ADMIN" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="rounded-full px-3 py-2 transition hover:bg-white/10"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={() => navigate("/my-enrollments")}
                className="rounded-full px-3 py-2 transition hover:bg-white/10"
              >
                My Enrollments
              </button>

              <button
                onClick={() => navigate("/change-password")}
                className="rounded-full px-3 py-2 transition hover:bg-white/10"
              >
                Change Password
              </button>

              <button
                onClick={handleLogout}
                className="rounded-full bg-rose-600 px-4 py-2 font-semibold transition hover:bg-rose-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
