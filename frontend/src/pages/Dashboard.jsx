import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CourseCard from "../components/CourseCard";

function Dashboard() {

  const [courses, setCourses] = useState([]);

  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  // fetch courses and enrollments
  const fetchData = async () => {

    try {

      const coursesResponse = await api.get("/courses");
      setCourses(coursesResponse.data.data);

      // Fetch user enrollments if not admin
      if (user?.role === "USER") {
        const enrollmentsResponse = await api.get("/enrollments/my-courses");
        setEnrollments(enrollmentsResponse.data.data);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle form input
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // create course
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {

      await api.post("/courses", formData);

      alert("Course created successfully");

      setFormData({
        title: "",
        description: "",
        price: "",
      });

      fetchData();

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }
  };

  // enroll course
  const handleEnroll = async (courseId) => {

    try {

      await api.post(
        `/enrollments/${courseId}`
      );

      alert("Enrolled successfully");
      fetchData();

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${courseId}`);
        alert("Course deleted successfully");
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message);
      }
    }
  };

  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Available Courses
        </h1>

        {/* courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {
            loading
            ? (
              <p className="text-xl">Loading...</p>
            )
            : courses.length === 0
            ? (
              <p className="text-xl text-gray-600">No courses available yet.</p>
            )
            : (
              courses.map((course) => (

                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  isEnrolled={isEnrolled(course.id)}
                  isAdmin={user?.role === "ADMIN"}
                  onDelete={handleDeleteCourse}
                />
              ))
            )
          }

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;