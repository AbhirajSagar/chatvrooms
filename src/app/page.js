'use client';
import { useState } from "react";
import Tabs from "@/components/HomePageTabs"

export default function Home() 
{
  return (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center px-12 flex-col">
        <TabsComponent/>  
      </div>
    </>
  );
}

function TabsComponent()
{
  const [currentTab, setCurrentTab] = useState(Tabs[0]);

  return (
    <>
      <div className="w-full h-10 mt-15 flex justify-center">
        {Tabs.map((tab, idx) => <h2 key={idx} onClick={() => setCurrentTab(tab)} className={`w-fit mx-3 text-sm sm:text-lg text-nowrap cursor-pointer ${tab === currentTab ? 'text-orange-400 underline' : 'text-muted'}`}>{tab.name}</h2>)}
      </div>
      <div className="dark:bg-background-muted-dark bg-white h-max w-3/4 sm:w-1/2 min-w-72 rounded-md">
        {currentTab.content}
      </div>
    </>
  );
}