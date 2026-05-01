import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CourseCard({ course, onEnroll, isEnrolled, isAdmin, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    await onEnroll(course.id);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
      
      <p className="text-gray-600 mb-4 text-sm">
        {course.description.substring(0, 100)}...
      </p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-blue-600">
          ${course.price}
        </span>
        <span className="text-gray-500 text-sm">
          {new Date(course.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => navigate(`/course/${course.id}`)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Details
        </button>

        {!isAdmin && !isEnrolled && (
          <button
            onClick={handleEnroll}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Enrolling..." : "Enroll"}
          </button>
        )}

        {!isAdmin && isEnrolled && (
          <span className="flex-1 bg-gray-400 text-white px-4 py-2 rounded text-center">
            Enrolled
          </span>
        )}

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(course)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(course.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
