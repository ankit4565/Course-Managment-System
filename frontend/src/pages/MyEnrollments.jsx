import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyEnrollments() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get("/enrollments/my-courses");
      setEnrollments(response.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching enrollments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading enrollments...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">My Enrollments</h1>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">
                  {enrollment.course.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm">
                  {enrollment.course.description.substring(0, 100)}...
                </p>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/course/${enrollment.courseId}`)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Course
                  </button>
                  <button
                    onClick={() => navigate(`/course/${enrollment.courseId}`)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyEnrollments;
