import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

const ChangeLogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API}/api/changelog/${id}`);
      if (res.data.success) {
        setTask(res.data.data);
      } else {
        setError("Task not found");
      }
    } catch (err) {
      console.error("Error fetching task details:", err);
      setError("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTagColor = (tag) => {
    const colors = {
      feature: "bg-blue-900/30 text-blue-300",
      fix: "bg-green-900/30 text-green-300",
      update: "bg-purple-900/30 text-purple-300",
      security: "bg-red-900/30 text-red-300",
      performance: "bg-yellow-900/30 text-yellow-300",
      default: "bg-gray-800 text-gray-300",
    };
    return colors[tag.toLowerCase()] || colors.default;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "New Feature": "border-l-blue-500",
      "Bug Fix": "border-l-green-500",
      "Date Extension": "border-l-red-500",
      "UI Update": "border-l-purple-500",
      "Security Update": "border-l-orange-500",
      "Performance": "border-l-yellow-500",
      "default": "border-l-gray-500",
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-white"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen hide-scrollbar bg-gradient-to-b from-gray-900 to-black flex justify-center items-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{error || "Task not found"}</h2>
          <button
            onClick={() => navigate("/changelog")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Back to Changelog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
       
        <button
          onClick={() => navigate("/changelog")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <IoArrowBack className="text-lg group-hover:-translate-x-1 transition-transform" />
          <span>Back to Changelog</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border-l-4 ${getCategoryColor(task.category)} overflow-hidden`}
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-400">
                  {formatDate(task.date)}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                  {task.title}
                </h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTagColor(task.tag)}`}>
                  {task.tag}
                </span>
                <span className="px-3 py-1 bg-gray-700 rounded-full text-xs font-semibold">
                  {task.category}
                </span>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Title</h3>
              <p className="text-gray-400 leading-relaxed">{task.short_description}</p>
            </div>
            
            {task.long_description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Detailed Description</h3>
                <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {task.long_description}
                </div>
              </div>
            )}
            {task.category === "Date Extension" && (
              <div className="mb-8 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-red-300 mb-3">Date Extension Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Reason for Extension</p>
                    <p className="text-white">{task.reason || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Time Line Extension</p>
                    <p className="text-red-300 font-semibold">
                      {task.final_date ? formatDate(task.final_date) : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="pt-6 border-t border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Category</p>
                  <p className="text-white">{task.category}</p>
                </div>
                
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangeLogDetails;