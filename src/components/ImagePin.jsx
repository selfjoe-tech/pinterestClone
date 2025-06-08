import React, { useState } from 'react';
import Link from 'next/link';
import { urlFor } from '@/sanity/client';
import Image from 'next/image';

const ImagePin= ({ pin }) => {
  if (!pin?.image) return null;
  
  // const height = pin.image?.asset?.metadata?.dimensions?.height || 1000;
  // const span = Math.ceil(height / 100);


  return (
    <div className="galleryItem">
        <Image
          src={urlFor(pin.image).url()} 
          alt={pin.title || "Gallery item"} 
          height={750} 
          width={300} 
          className='feed-pin'
          onContextMenu={e => e.preventDefault()}
        />
      <Link href={`/pin/${pin._id}`} className="overlay">
      </Link>
      <div className="overlayIcons">
        <button>
          <img src="/images/more.svg" alt="More icon" />
        </button>
      </div>
    </div>
  );
};

export default ImagePin;
