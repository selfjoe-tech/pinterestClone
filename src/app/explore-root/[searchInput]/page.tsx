"use client";
import React, { use } from 'react';
import ExploreGallery from "../../../components/ExploreGallery";
import TopBar from '@/components/topBar';

interface PageProps {
    params: Promise<{ searchInput: string }>;
}

export default function Page({ params }: PageProps) {
    const inputObj = use(params);
    const input = inputObj.searchInput.replace(/-/g, " ");
    
  return (
    <div className='search-container'>
          <TopBar />
          
    <div className="container">
      
      <div className="app">
        <div className="content">
          <ExploreGallery searchInput={input} />
        </div>
      </div>
      
    </div>
    </div>
  )
};


  
