import TopBar from './topBar'
import Image from 'next/image'
import CarouselCategory from "./Carousel"
import { suggestions } from './items';
import { redirect } from 'next/navigation';


const Search = () => {
  
  return (
    <div className='search-container'>
      <TopBar />
      <div className="slide-container">
        <CarouselCategory />
      </div>
      
      {
          suggestions.map( (suggestion, index) => {
            const slug = suggestion.category.trim().replace(/\s+/g, "-");
            
            return(
              <div className="suggestion-container" 
                onClick={() => redirect(`/explore-root/${slug}`)}
                key={index}
              >
                <div className="category">
                  <div className="name-of-category">
                      <span className="suggestion-for-you">Suggestion for you</span>
                      <span className="category-name">{suggestion.category}</span>
                  </div>
                  <div className="right-arrow-container">
                      <Image src="/images/right-arrow.png" width={30} height={30} alt="right arrow" />
                  </div>
                </div>
            
                        <div className="explore-column">
                          <div className="explore-inner-column">
                            {
                                suggestion.media.map((ImageUrl, index) => {
                                  return(
                                    <div 
                                      className="explore-image" 
                                      key={index}
                                    >
                                      <img src={ImageUrl} alt="suggestion-photo" />
                                    </div>
                                  )
                                }
                              )
                            }
                          </div>
                        </div>
              </div>
            )
          } 
        )
      }
      
    </div>
  )
}

export default Search

{/* <div className="explore-image">
                <img src="/images/pin2.jpeg" alt="suggestion-photo" />

            </div>
            <div className="explore-image">
                <img src="/images/pin3.jpeg" alt="suggestion-photo" />

            </div>
            <div className="explore-image last">
                <img src="/images/pin4.jpeg" alt="suggestion-photo" />

            </div>  */}
