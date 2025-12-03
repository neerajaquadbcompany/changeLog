import React,{useState,useEffect} from 'react'
import ChangeLog from "../components/Accordian/ChangeLog"
import Category from "../components/Category";
import {changelogData} from '../data/changelog'
import NewPopup from '../components/NewPopup';
import { useNavigate } from 'react-router-dom';



const ChangeLogpage = () => {

    const [activeCategory, setActiveCategory] = useState("UI/UX");
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const handleNewClick = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "admin") {
        navigate("/login", { state: { from: "/" } });
        return;
      }
      setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        
        window.location.reload();
    };

  return (
    <div className='bg-[#010409] relative hide-scrollbar flex flex-col jusitfy-center items-center min-h-screen container max-w-[1920px] mx-auto'>
      <img src='/grid.svg' alt='' className='w-full mt-10 absolute top-0 left-0 w-full  object-cover '/>
      <div className='flex flex-col gap-10 w-[80%]   py-10  justify-center items-center z-20'>
       <div  className="h-px w-full my-4 bg-gradient-to-r from-transparent via-[#EAE4F8] to-transparent "/>
        <div className='text-white text-[40px] text-left self-start font-[600]'>ChangeLog</div>
        <Category active={activeCategory} setActive={setActiveCategory} />
        <div className='hover:text-white rounded text-md text-gray-500 self-end bg-[#212122] px-2 py-1 cursor-pointer flex justify-center items-center' onClick={handleNewClick}>+ New </div>
        <ChangeLog activeCategory={activeCategory} changelogData={changelogData} />
      </div>
      {showPopup && <NewPopup closePopup={handleClosePopup} />}
    </div>
  )
}

export default ChangeLogpage