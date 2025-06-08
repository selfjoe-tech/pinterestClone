import React from 'react'
import { useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import Image from 'next/image';


const Tags = ( {categoriesArray} ) => {
    const [open, setOpen] = useState(false);

  return (
    <>
      <div className=" gap-1">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="collapseComments"
          aria-expanded={open}
          variant="primary"
        >
          Tags
        </Button>
        <Image
          src={open ?
             "/images/ri-arrow-up-sline.png"
            : 
             "/images/ri-arrow-down-sline.png"
          }
          width={30}
          height={30}
          alt="open comment arrow"
          onClick={() => setOpen(!open)}
        />
      </div>
      <Collapse in={open}>
        <div id="collapseComments">
        {categoriesArray && categoriesArray.length > 0 ? (
            categoriesArray.map((category, index) => (
              <div key={index} className="tag">
                  <span>{category}</span>
              </div>
            ))
          ) : (
            <p>Nothing to see here</p>
          )}
        </div>
      </Collapse>
    </>
  )
}

export default Tags
