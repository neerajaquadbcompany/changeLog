import React from "react";
import { motion } from "framer-motion";

const categories = [
  { key: "UI/UX", label: "UI/UX Design", icon: "/ui-ux.png", width: "w-44" },
  { key: "AI", label: "AI", icon: "/artificial-intelligence.png", width: "w-20" },
  { key: "Frontend", label: "Frontend", icon: "/website.png", width: "w-44" },
  { key: "Backend", label: "Backend", icon: "/backend.png", width: "w-44" },
  { key: "Date Extension", label: "Date Extend", icon: "/schedule.png", width: "w-44" },
];

const Category = ({ active, setActive }) => {
  return (
    <div className="flex gap-10 items-center text-[#89949e] hide-scrollbar">
      {categories.map((item) => (
        <motion.div
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`cursor-pointer gap-3 px-4 py-2 ${item.width} flex justify-center items-center 
              rounded-full transition-all duration-300 text-[16px] font-[500]
              ${active === item.key ? "bg-[#161b22] text-white" : "hover:bg-[#161b22] hover:text-white"}`}
          whileTap={{ scale: 0.95 }}
        >
          <img src={item.icon} alt={item.label} className="w-6 h-6" />
          {item.label}
        </motion.div>
      ))}
    </div>
  );
};

export default Category;
