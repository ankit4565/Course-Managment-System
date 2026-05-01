import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data.data);

        // check if user is enrolled
        const enrollments = await api.get("/enrollments/my-courses");
        const enrolled = enrollments.data.data.some(e => e.courseId === id);
        setIsEnrolled(enrolled);
      } catch (error) {
        alert(error.response?.data?.message || "Error fetching course");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/enrollments/${id}`);
      alert("Enrolled successfully!");
      setIsEnrolled(true);
    } catch (error) {
      alert(error.response?.data?.message || "Error enrolling");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="text-center py-12">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Navbar />
        <div className="text-center py-12">Course not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          ← Back to Courses
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                ${course.price}
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>

              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded text-lg font-semibold"
                >
                  Enroll Now
                </button>
              ) : (
                <div className="w-full bg-gray-400 text-white px-6 py-3 rounded text-lg font-semibold text-center">
                  Already Enrolled
                </div>
              )}
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Course Information</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Course ID:</strong> {course.id}
                </li>
                <li>
                  <strong>Instructor ID:</strong> {course.createdBy}
                </li>
                <li>
                  <strong>Created At:</strong> {new Date(course.createdAt).toLocaleDateString()}
                </li>
                <li>
                  <strong>Status:</strong> <span className="text-green-600 font-semibold">Active</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CourseDetail;
