import React, { useState, useEffect } from 'react';
import { apiFetch } from "../app/utilitis/apis/fetchWrapper";
import useAuthStore from '@/app/utilitis/apis/useAuthStore';
import Masonry from 'react-masonry-css';
import VideoPin from "./VideoPin";
import CollagePin from "./CollagePin";
import ImagePin from "./ImagePin";
import NoSearchResults from "./NoSearchResults"


const ExploreGallery = ({searchInput}) => {
  const isLoggedIn = useAuthStore.getState().isLoggedIn;
  const [pins, setPins] = useState([]); 
  useEffect(() => {
    async function fetchPins () {
        let response;
        try { isLoggedIn ? (
                response = await apiFetch(`/api/searchPins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body:  JSON.stringify({
                    input: searchInput
                })
                })) 
                : 
                (response = await fetch(`/api/searchPins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: searchInput
                })
                }))

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setPins(data)
                }
                
            } catch (error) {
                console.error('Error fetching pins:', error);
            }
    }
    fetchPins()
  }, [])

  if (pins.length === 0) {
    return <NoSearchResults input={searchInput}/>;
  }

  const breakpointCols = {
    default: 6,
    1024: 5,
    900: 4,
    768: 3,  
    480: 2   
  };
  
  return (
    <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pins.map((pin, index) => {
          if (pin.image) {
            return <ImagePin key={index} pin={pin} />;
          }
          if (pin.video) {
            return <VideoPin key={index} pin={pin} />;
          }
          if (pin.stories) {
            return (
              <CollagePin
                key={index}
                story={pin.stories[0]}
                _id={pin._id}
              />
            );
          }
          return null;
        })}
      </Masonry>
  );
};

export default ExploreGallery;