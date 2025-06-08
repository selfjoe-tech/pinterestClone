import React from 'react';
import { useState } from 'react';
import { redirect } from 'next/navigation';


const TopBar = () => {

  const [formData, setFormData] = useState(
          { 
            searchInput: ""
          }
      );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
        
    };
    
  async function handleSearch (e) {
    e.preventDefault();
    const slug = formData.searchInput.trim().replace(/\s+/g, "-");
    redirect(`/explore-root/${slug}`);
  };

  return (
    <div className="topBar">
      <div className='search'>
        <form key="searchForm" onSubmit={handleSearch}>
            <button>
              <img src="/images/search.svg" alt="search-button" />
            </button>
            <input 
              type="text" 
              placeholder="Search"
              onChange={handleChange}
              name="searchInput"
            />
        </form>
      </div>
      
    </div>
  )
}

export default TopBar
