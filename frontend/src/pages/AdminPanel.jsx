import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CourseCard from "../components/CourseCard";

function AdminPanel() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "ADMIN") {
      alert("Access denied. Admin only.");
      navigate("/dashboard");
      return;
    }

    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.description || !formData.price) {
        alert("All fields are required");
        return;
      }

      await api.post("/courses", formData);
      alert("Course created successfully");
      setFormData({ title: "", description: "", price: "" });
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating course");
    }
  };

  const handleEditCourse = async (courseId) => {
    try {
      if (!formData.title || !formData.description || !formData.price) {
        alert("All fields are required");
        return;
      }

      await api.put(`/courses/${courseId}`, formData);
      alert("Course updated successfully");
      setFormData({ title: "", description: "", price: "" });
      setEditingCourse(null);
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${courseId}`);
        alert("Course deleted successfully");
        fetchCourses();
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting course");
      }
    }
  };

  const openEditForm = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "" });
    setEditingCourse(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
          >
            {showForm ? "Cancel" : "Add New Course"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingCourse) {
                handleEditCourse(editingCourse.id);
              } else {
                handleCreateCourse(e);
              }
            }}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  className="w-full border p-3 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  className="w-full border p-3 rounded h-32"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter course price"
                  className="w-full border p-3 rounded"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
                >
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">All Courses ({courses.length})</h2>

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">No courses yet. Create your first course!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isAdmin={true}
                onEdit={openEditForm}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AdminPanel;
