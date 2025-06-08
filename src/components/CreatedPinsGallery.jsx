import React from 'react'
import Masonry from 'react-masonry-css';
import ImagePin from './ImagePin';
import VideoPin from './VideoPin';
import CollagePin from './CollagePin';
import NothingHere from "./NothingHere"

const CreatePinsGallery = ({ pins }) => {
    
    if (!pins) {
        return <NothingHere />;
    };

    const breakpointCols = {
      default: 4,
      1024:   6,
      768:    4,  
      480:    2   
  };
    return (
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pins?.map((pin, index) => {
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
  
}

export default CreatePinsGallery;
