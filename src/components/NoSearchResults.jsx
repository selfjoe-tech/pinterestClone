import React from 'react'

const NoSearchResults = ({input}) => {
  return (
    <div className="nothing-here-container">
      <img src="/images/ri-emotion-sad-line.png" width={80} height={80}/>
      <span>No search results for "{input}"</span>
    </div> 
  )
}

export default NoSearchResults
