import React, { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownSharp } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

const ChangeLog = ({ activeCategory, changelogData }) => {
  const [changeLog,setChangelog]=useState();
  const [loading, setLoading] = useState(true);
 
  function groupChangelogByMonth(logs) {
    const grouped = {};
  
    logs.forEach(log => {
      const dateObj = new Date(log.date);
      
      const monthYear = dateObj.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }); 
  
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
  
      grouped[monthYear].push({
        date: dateObj.toLocaleString("en-US", {
          month: "short",
          day: "2-digit"
        }).replace(",", "").replace(" ", " . "), 
        id:log._id,
        tag: log.tag,
        title: log.title,
        description: log.short_description,
        long_description: log.long_description,
        category: log.category,
        reason: log.reason,
        final_date: log.final_date
      });
    });
  
    
    return Object.entries(grouped).map(([month, items]) => ({
      month,
      items,
    }));
  }
  

const FetchChangeLog = async () =>{
  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/api/changelog/all`);
    //console.log("res ==>",res.data)
    const groupedData = groupChangelogByMonth(res.data.data);
    //console.log("Grouped Data ==>",groupedData)
    setChangelog(groupedData);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
}

useEffect(()=>{
    FetchChangeLog();
},[])
useEffect(()=>{

},[changeLog])
  const [openMonth, setOpenMonth] = useState(null);

  const toggleMonth = (index) => {
    setOpenMonth(openMonth === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[300px] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-white"></div>
      </div>
    );
  }
  

  return (
    <div className="text-white px-6 py-10 hide-scrollbar w-full mx-auto">
      {changeLog && changeLog.some(monthData => 
        (activeCategory
          ? monthData.items.some(item => item.category === activeCategory)
          : monthData.items.length > 0
        )
      ) ? (
        changeLog.map((monthData, idx) => {
          const filteredItems = activeCategory
            ? monthData.items.filter(item => item.category === activeCategory)
            : monthData.items;
  
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
                    className="overflow-hidden hide-scrollbar px-4 pb-4"
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
                        {item.category === 'Date Extension' && (
                          <div className="flex text-md justify-between items-center my-4">
                            <div className="flex items-center gap-4">
                              <div className=" text-red-500 font-[500]">Reason</div>
                              <div>{item.reason}</div>
                            </div>
                            <div className="text-red-500">{item.final_date}</div>
                          </div>
                        )}
                        <Link 
                          to={`/changelog/${item.id || item._id}`}
                          className="text-lg font-[500] text-gray-100 hover:underline hover:underline-offset-2 cursor-pointer block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-md text-gray-500 my-4">{item.description}</p>
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
              <div className={`h-px w-full bg-gradient-to-r from-transparent via-[#353839] to-transparent group-hover:via-[#EAE4F8] ${openMonth === idx && 'hidden'}`} />
            </div>
          );
        })
      ) : (
        <div className="text-white flex justify-center items-center w-full">
          <img src="./No_Data.avif" alt="No Data" className="w-40 h-40 mix-blend-hard-light"/>
        </div>
      )}
    </div>
  );
  
};

export default ChangeLog;
