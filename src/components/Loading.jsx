import React from 'react'
import { Spinner } from 'react-bootstrap';

const Loading = () => {
  return (
    <div 
        className="loadingContainer"
    >
        <Spinner 
            animation="border" 
            variant="secondary"
        />
    </div>
  )
}

export default Loading;
