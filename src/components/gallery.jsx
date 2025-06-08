import React, { useState, useEffect } from 'react';
import ImagePin from "./ImagePin";
import { apiFetch } from "../app/utilitis/apis/fetchWrapper"
import useAuthStore from '@/app/utilitis/apis/useAuthStore';
import VideoPin from "./VideoPin"
import Loading from "./Loading"
import CollagePin from "./CollagePin"
import Masonry from 'react-masonry-css';

const Gallery = () => {
  const [pins, setPins] = useState([]); 
  const isLoggedIn = useAuthStore.getState().isLoggedIn;

  useEffect(() => {
    let response;

    async function fetchPins() {
      try { isLoggedIn ? (
          response = await apiFetch(`/api/fetchFeed`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })) 
        : 
        (response = await fetch(`/api/fetchFeed`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }))
        const data = await response.json();
        setPins(data);
      } catch (error) {
        console.error('Error fetching pins:', error);
      }
    }
    fetchPins();
  }, []);

  if (!pins) {
    return <Loading />;
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
);}

//   return (
//     <div className="gallery">
//       {pins.map(
//         (pin, index) => {

//           if (pin.image !== null) {
//             return <ImagePin 
//               key={index} 
//               pin={pin}
//             />
//           }

//           if (pin.video !== null) {
//             return <VideoPin 
//                       key={index} 
//                       pin={pin}
//                   />
//           }
//           if (pin.stories !== null) {
            
//             return <CollagePin 
//                       story={pin.stories[0]} 
//                       _id={pin._id}
//                       key={index} 
//                   />
//           }
//           return null
//         }
        
//       )}
//     </div>
//   );
// };

export default Gallery;