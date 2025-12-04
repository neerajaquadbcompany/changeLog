import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { 
  FiCalendar, 
  FiTag, 
  FiFolder, 
  FiFileText, 
  FiAlertCircle,
  FiClock,
  FiX
} from "react-icons/fi";

const categories = ["UI/UX", "AI", "Frontend", "Backend", "Date Extension"];
const tags = ["IMPROVEMENT", "FIX", "FEATURE", "UPDATE", "SECURITY", "PERFORMANCE","Extension"];

export default function NewPopup({ closePopup }) {
  const [form, setForm] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    tag: "",
    category: "",
    title: "",
    short_description: "",
    long_description: "",
    reason: "",
    final_date: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      date: dayjs().format("YYYY-MM-DD")
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const handleDateChange = (date, dateString) => {
    setForm({ ...form, date: dateString });
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: "" }));
    }
    setTouched(prev => ({ ...prev, date: true }));
  };

  const handleFinalDateChange = (date, dateString) => {
    setForm({ ...form, final_date: dateString });
    if (errors.final_date) {
      setErrors(prev => ({ ...prev, final_date: "" }));
    }
    setTouched(prev => ({ ...prev, final_date: true }));
  };

  const validateField = (fieldName) => {
    let error = "";
    
    switch (fieldName) {
      case "date":
        if (!form.date) error = "Date is required";
        break;
      case "tag":
        if (!form.tag) error = "Tag is required";
        break;
      case "category":
        if (!form.category) error = "Category is required";
        break;
      case "title":
        if (!form.title.trim()) error = "Title is required";
        else if (form.title.length < 3) error = "Title must be at least 3 characters";
        break;
      case "short_description":
        if (!form.short_description.trim()) error = "Short description is required";
        else if (form.short_description.length < 10) error = "Short description must be at least 10 characters";
        break;
      case "reason":
        if (form.category === "Date Extension" && !form.reason.trim()) {
          error = "Reason is required for date extensions";
        }
        break;
      case "final_date":
        if (form.category === "Date Extension") {
          if (!form.final_date) error = "Final date is required for date extensions";
          else if (form.final_date <= form.date) error = "Final date must be after the original date";
        }
        break;
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;


    ["date", "tag", "category", "title", "short_description"].forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (form.category === "Date Extension") {
      if (!form.reason.trim()) {
        newErrors.reason = "Reason is required";
        isValid = false;
      }
      if (!form.final_date) {
        newErrors.final_date = "Final date is required";
        isValid = false;
      } else if (form.final_date <= form.date) {
        newErrors.final_date = "Final date must be after the original date";
        isValid = false;
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    const allFields = ["date", "tag", "category", "title", "short_description"];
    if (form.category === "Date Extension") {
      allFields.push("reason", "final_date");
    }
    allFields.forEach(field => setTouched(prev => ({ ...prev, [field]: true })));
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API}/api/changelog/create`, form);
      console.log("Created:", res.data);
      closePopup();
      
    } catch (err) {
      console.log("Error:", err);
      setErrors(prev => ({
        ...prev,
        submit: err.response?.data?.message || "Failed to create changelog"
      }));
    } finally {
      setLoading(false);
    }
  };

 
  const datePickerStyle = {
    width: '100%',
    backgroundColor: '#1a1f25',
    border: errors.date ? '1px solid #ef4444' : '1px solid #374151',
    borderRadius: '0.5rem',
    color: 'white',
    height: '42px',
  };

  const suffixIcon = (
    <FiCalendar className="text-gray-400 hover:text-white transition-colors" />
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed h-screen inset-0 bg-black/70 backdrop-blur-sm flex overflow-auto hide-scrollbar  justify-center items-center z-[999] p-4"
      onClick={(e) => e.target === e.currentTarget && closePopup()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        // transition={{ type: "spring", damping: 25 }}
        className="bg-[#111418] p-6 md:p-8 rounded-2xl w-full max-w-md mt-52 text-white border border-gray-800 shadow-2xl"
      >
       
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create New Changelog
            </h2>
            <p className="text-gray-400 text-sm mt-1">Add a new entry to the changelog</p>
          </div>
          <button
            onClick={closePopup}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submitForm} className="space-y-4">
         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              Date *
            </label>
            <DatePicker
              value={form.date ? dayjs(form.date) : null}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              style={datePickerStyle}
              suffixIcon={suffixIcon}
              className="w-full"
              popupClassName="date-picker-popup"
              allowClear={false}
            />
            {touched.date && errors.date && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-1 flex items-center gap-1"
              >
                <FiAlertCircle className="w-4 h-4" />
                {errors.date}
              </motion.p>
            )}
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FiTag className="w-4 h-4" />
              Tag *
            </label>
            <select
              name="tag"
              value={form.tag}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-[#1a1f25] p-3 rounded-lg border ${errors.tag ? 'border-red-500' : 'border-gray-700'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
            >
              <option value="">Select a tag</option>
              {tags.map((tag) => (
                <option key={tag} value={tag} className="bg-[#1a1f25]">
                  {tag}
                </option>
              ))}
            </select>
            {touched.tag && errors.tag && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-4 h-4" />
                {errors.tag}
              </p>
            )}
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FiFolder className="w-4 h-4" />
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={(e) => {
                handleChange(e);
                
                if (e.target.value !== "Date Extension") {
                  setErrors(prev => ({ ...prev, reason: "", final_date: "" }));
                }
              }}
              onBlur={handleBlur}
              className={`w-full bg-[#1a1f25] p-3 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-700'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1a1f25]">
                  {cat}
                </option>
              ))}
            </select>
            {touched.category && errors.category && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-4 h-4" />
                {errors.category}
              </p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              name="title"
              placeholder="Enter a descriptive title"
              value={form.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-[#1a1f25] p-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-700'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
            />
            {touched.title && errors.title && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Description *
            </label>
            <textarea
              name="short_description"
              placeholder="Brief summary of the change"
              value={form.short_description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className={`w-full bg-[#1a1f25] p-3 rounded-lg border ${errors.short_description ? 'border-red-500' : 'border-gray-700'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none`}
            />
            {touched.short_description && errors.short_description && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-4 h-4" />
                {errors.short_description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Long Description (Optional)
            </label>
            <textarea
              name="long_description"
              placeholder="Detailed explanation of the change"
              value={form.long_description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-[#1a1f25] p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
            />
          </div>

         
          {form.category === "Date Extension" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 p-4 bg-red-900/10 border border-red-800/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-300">
                <FiClock className="w-5 h-5" />
                <h3 className="font-medium">Date Extension Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for Extension *
                </label>
                <input
                  name="reason"
                  placeholder="Why was the date extended?"
                  value={form.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-[#1a1f25] p-3 rounded-lg border ${errors.reason ? 'border-red-500' : 'border-gray-700'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
                />
                {touched.reason && errors.reason && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.reason}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Deadline *
                </label>
                <DatePicker
                  value={form.final_date ? dayjs(form.final_date) : null}
                  onChange={handleFinalDateChange}
                  format="YYYY-MM-DD"
                  style={{
                    ...datePickerStyle,
                    border: errors.final_date ? '1px solid #ef4444' : datePickerStyle.border
                  }}
                  suffixIcon={suffixIcon}
                  className="w-full"
                  allowClear={false}
                />
                {touched.final_date && errors.final_date && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.final_date}
                  </p>
                )}
              </div>
            </motion.div>
          )}

         
          {errors.submit && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
              <p className="text-red-300 text-sm flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.submit}
              </p>
            </div>
          )}

         
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closePopup}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                "Create Entry"
              )}
            </button>
          </div>

          
          <p className="text-xs text-gray-500 text-center pt-2">
            * Required fields
          </p>
        </form>
      </motion.div>

     
      <style jsx global>{`
        .ant-picker {
          background-color: #1a1f25 !important;
          border-color: #374151 !important;
        }
        
        .ant-picker-input > input {
          color: white !important;
        }
        
        .ant-picker-suffix {
          color: #9ca3af !important;
        }
        
        .ant-picker-clear {
          background-color: transparent !important;
          color: #9ca3af !important;
        }
        
        .ant-picker-clear:hover {
          color: white !important;
        }
        
        .ant-picker-dropdown {
          z-index: 10000 !important;
        }
        
        .ant-picker-panel-container {
          background-color: #1f2937 !important;
          border: 1px solid #374151 !important;
        }
        
        .ant-picker-header {
          border-bottom: 1px solid #374151 !important;
          color: white !important;
        }
        
        .ant-picker-header button {
          color: #9ca3af !important;
        }
        
        .ant-picker-header button:hover {
          color: white !important;
        }
        
        .ant-picker-content th {
          color: #9ca3af !important;
        }
        
        .ant-picker-cell {
          color: #d1d5db !important;
        }
        
        .ant-picker-cell-in-view {
          color: white !important;
        }
        
        .ant-picker-cell:hover .ant-picker-cell-inner {
          background-color: #374151 !important;
        }
        
        .ant-picker-cell-selected .ant-picker-cell-inner {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        
        .ant-picker-today-btn {
          color: #3b82f6 !important;
        }
        
        .ant-picker-today-btn:hover {
          color: #2563eb !important;
        }
        
        .ant-picker-ok button {
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        
        .ant-picker-ok button:hover {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
        }
      `}</style>
    </motion.div>
  );
}