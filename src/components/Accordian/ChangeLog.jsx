import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownSharp } from "react-icons/io5";

const ChangeLog = ({ activeCategory, changelogData }) => {
  const [openMonth, setOpenMonth] = useState(null);

  const toggleMonth = (index) => {
    setOpenMonth(openMonth === index ? null : index);
  };

  return (
    <div className="text-white px-6 py-10 w-full mx-auto">
      {changelogData.map((monthData, idx) => {
        const filteredItems = monthData.items.filter(
          (item) => item.category === activeCategory
        );

        if (filteredItems.length === 0) return null;

        return (
          <div key={idx} className="mb-6 group">
            <button
              onClick={() => toggleMonth(idx)}
              className="w-full flex gap-6 items-center px-4 py-4 text-[#88919b] hover:text-white transition-all"
            >
              <h2 className="text-2xl font-[500]">{monthData.month}</h2>
              <IoChevronDownSharp
                className={`text-[25px] ${
                  openMonth === idx ? "rotate-180" : "rotate-0"
                } transition-all duration-500`}
              />
            </button>

            <AnimatePresence>
              {openMonth === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0, y: 20 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: 20 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden px-4 pb-4"
                >
                  {filteredItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="py-6 group cursor-pointer px-4"
                    >
                      <div className="flex items-center gap-4 mb-2 text-[#8b949e] group-hover:text-gray-300">
                        <span className="text-sm font-[500]">{item.date}</span>

                        <span className="text-xs px-2 py-1 bg-[#161b22] rounded font-[500] uppercase">
                          {item.tag}
                        </span>
                      </div>
                      {item.category === 'Date Extension'&&(<div className="flex text-md justify-between items-center my-4">
                        <div className="flex items-center gap-4">
                            <div className=" text-red-500 font-[500]">Reason</div>
                            <div>{item.reason}</div>
                        </div>
                        <div className="text-red-500">{item.final_date}</div>
                      </div>)}
                      <p className="text-lg font-[500] text-gray-100">
                        {item.title}
                      </p>
                      <p className="text-md  text-gray-500 my-4">
                        {item.description}
                      </p>

                      <div className="flex justify-end mt-2">
                        <span className="text-xs text-gray-200 bg-[#212122] px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>

                      <div className="h-px w-full my-4 bg-gradient-to-r from-transparent via-[#EAE4F8] to-transparent opacity-50 group-hover:opacity-100"></div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className={`h-px w-full  bg-gradient-to-r from-transparent via-[#353839] to-transparent group-hover:via-[#EAE4F8]  ${openMonth === idx && 'hidden'}`}/>  
          </div>
        );
      })}
    </div>
  );
};

export default ChangeLog;
