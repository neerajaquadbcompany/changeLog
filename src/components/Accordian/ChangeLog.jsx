import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownSharp } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

const ChangeLog = ({ activeCategory }) => {
  const [changeLog, setChangelog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMonth, setOpenMonth] = useState(null);
  const [openDate, setOpenDate] = useState({}); 

  
  const groupChangelogByMonth = (logs) => {
    const grouped = {};

    logs.forEach((log) => {
      const dateObj = new Date(log.date);
      const monthYear = dateObj.toLocaleString("en-US", { month: "long", year: "numeric" });
      const dateStr = dateObj.toLocaleString("en-US", { month: "short", day: "2-digit" }).replace(",", "").replace(" ", " . ");

      if (!grouped[monthYear]) grouped[monthYear] = [];
      grouped[monthYear].push({
        dateObj,
        dateStr,
        id: log._id,
        tag: log.tag,
        title: log.title,
        description: log.short_description,
        long_description: log.long_description,
        category: log.category,
        reason: log.reason,
        final_date: log.final_date
      });
    });

    let groupedArray = Object.entries(grouped).map(([month, items]) => {
      items.sort((a, b) => b.dateObj - a.dateObj); 

     
      const dateGrouped = {};
      items.forEach(item => {
        if (!dateGrouped[item.dateStr]) dateGrouped[item.dateStr] = [];
        dateGrouped[item.dateStr].push(item);
      });

      const dateGroups = Object.entries(dateGrouped).map(([date, entries]) => ({ date, entries }));

      return { month, dateGroups };
    });

    
    groupedArray.sort((a, b) => b.dateGroups[0].entries[0].dateObj - a.dateGroups[0].entries[0].dateObj);

    return groupedArray;
  };

  const FetchChangeLog = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/changelog/all`);
      const groupedData = groupChangelogByMonth(res.data.data);
      setChangelog(groupedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchChangeLog();
  }, []);

  const toggleMonth = (idx) => {
    setOpenMonth(openMonth === idx ? null : idx);
  };

  const toggleDate = (monthIdx, dateIdx) => {
    setOpenDate((prev) => ({
      ...prev,
      [monthIdx]: prev[monthIdx] === dateIdx ? null : dateIdx
    }));
  };

  if (loading) return (
    <div className="flex justify-center items-center w-full h-[300px] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-white"></div>
    </div>
  );

  const hasData = changeLog.some(monthData =>
    monthData.dateGroups.some(dateGroup =>
      activeCategory
        ? dateGroup.entries.some(e => e.category === activeCategory)
        : dateGroup.entries.length > 0
    )
  );
  
  return (
    <div className="text-white px-6 py-10 hide-scrollbar w-full mx-auto">
      {hasData ? (
        changeLog.map((monthData, monthIdx) => {
          const filteredDateGroups = monthData.dateGroups.map(dateGroup => ({
            ...dateGroup,
            entries: activeCategory ? dateGroup.entries.filter(e => e.category === activeCategory) : dateGroup.entries
          })).filter(d => d.entries.length > 0);

          if (filteredDateGroups.length === 0) return null;

          return (
            
            <div key={monthIdx} className="mb-6 group">
             
              <button onClick={() => toggleMonth(monthIdx)} className="w-full flex gap-6 items-center px-4 py-4 text-[#88919b] hover:text-white transition-all">
                <h2 className="text-2xl font-[500]">{monthData.month}</h2>
                <IoChevronDownSharp className={`text-[25px] ${openMonth === monthIdx ? "rotate-180" : "rotate-0"} transition-all duration-500`} />
              </button>

              <AnimatePresence>
                {openMonth === monthIdx && (
                  <motion.div
                    key="month-content"
                    initial={{ height: 0, opacity: 0, y: 20 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: 20 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden hide-scrollbar px-4 pb-4"
                  >
                    
                    {filteredDateGroups.map((dateGroup, dateIdx) => (
                      <div key={dateIdx} className="mb-4">
                        {dateGroup.entries.length > 1 ? (
                          <>
                            <button
                              onClick={() => toggleDate(monthIdx, dateIdx)}
                              className="w-full flex gap-3  items-center  px-4 py-2 rounded cursor-pointer mb-2"
                            >
                              <span className=" uppercase">{dateGroup.date}</span>
                              <IoChevronDownSharp className={`text-[20px] ${openDate[monthIdx] === dateIdx ? "rotate-180" : "rotate-0"} transition-all duration-300`} />
                            </button>

                            <AnimatePresence>
                              {openDate[monthIdx] === dateIdx && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="pl-4"
                                >
                                  {dateGroup.entries.map((item, i) => (
                                    <LogItem key={i} item={item} isLast={i === dateGroup.entries.length - 1} /> 
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                          </>
                        ) : (
                          <LogItem item={dateGroup.entries[0]} />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="h-px w-full my-4 bg-gradient-to-r from-transparent via-[#EAE4F8] to-transparent opacity-50 group-hover:opacity-100"></div>
            </div>
          );
        })
      ) : (
        <div className="text-white flex justify-center items-center w-full">
          <img src="./No_Data.avif" alt="No Data" className="w-40 h-40 mix-blend-hard-light" />
        </div>
      )}
    </div>
  );
};


const LogItem = ({ item,isLast }) => (
  <motion.div className="py-6 group cursor-pointer px-4">
    <div className="flex items-center gap-4 mb-2 text-[#8b949e] group-hover:text-gray-300">
      <span className="text-sm font-[500]">{item.dateStr}</span>
      <span className="text-xs px-2 py-1 bg-[#161b22] rounded font-[500] uppercase">{item.tag}</span>
    </div>
    {item.category === "Date Extension" && (
      <div className="flex text-md justify-between items-center my-4">
        <div className="flex items-center gap-4">
          <div className="text-red-500 font-[500]">Reason</div>
          <div>{item.reason}</div>
        </div>
        <div className="text-red-500">{item.final_date}</div>
      </div>
    )}
    <Link to={`/changelog/${item.id || item._id}`} className="text-lg font-[500] text-gray-100 hover:underline hover:underline-offset-2 cursor-pointer block">
      {item.title}
    </Link>
    <p className="text-md text-gray-500 my-4">{item.description}</p>
    <div className="flex justify-end mt-2">
      <span className="text-xs text-gray-200 bg-[#212122] px-2 py-1 rounded">{item.category}</span>
    </div>
    {!isLast && (
      <div className="h-px w-full my-4 bg-gradient-to-r from-transparent via-[#EAE4F8] to-transparent opacity-50 group-hover:opacity-100"></div>
    )}
  </motion.div>
);

export default ChangeLog;
