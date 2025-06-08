import React from 'react'
import { Carousel } from 'react-bootstrap';
import items from "./items"

const CarouselCategory = () => {
  return (
    <div>
      <Carousel className='carousel-container'>
      {items.map((slide, idx) => (
        <Carousel.Item key={idx}>
          <Carousel.Caption>
          <h3>{slide.title}</h3>
          <p>{slide.description}</p>
        </Carousel.Caption>
            <div className="carousel-image">
                <img
                    className="d-block w-100"
                    src={slide.media}
                    alt={slide.alt || `Slide ${idx + 1}`}
                />
            </div>
          
          {slide.caption && (
            <Carousel.Caption>
              
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
        </Carousel>
    </div>
  )
}

export default CarouselCategory;
