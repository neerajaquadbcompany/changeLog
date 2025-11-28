import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import ChangeLog from './components/Accordian/ChangeLog';
import Category from "./components/Category";
import {changelogData} from './data/changelog'
function App() {
  const [activeCategory, setActiveCategory] = useState("UI/UX");
  return (
    <div className='bg-[#010409] relative flex flex-col jusitfy-center items-center min-h-screen container max-w-[1920px] mx-auto'>
      <img src='/grid.svg' alt='' className='w-full mt-10 absolute top-0 left-0 w-full  object-cover '/>
      <div className='flex flex-col gap-10 w-[80%]   py-10  justify-center items-center '>
       <div  className="h-px w-full my-4 bg-gradient-to-r from-transparent via-[#EAE4F8] to-transparent "/>
        <div className='text-white text-[40px] text-left self-start font-[600]'>ChangeLog</div>
        <Category active={activeCategory} setActive={setActiveCategory} />

        <ChangeLog activeCategory={activeCategory} changelogData={changelogData} />
      </div>
      
    </div>
  );
}

export default App;
