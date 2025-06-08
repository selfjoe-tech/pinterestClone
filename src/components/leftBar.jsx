"use client";
import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import useAuthStore from '../app/utilitis/apis/useAuthStore';
import { Modal, Button, CloseButton } from 'react-bootstrap';



const LeftBar = () => {
  const pathName = usePathname();
  const isLoggedIn = useAuthStore.getState().isLoggedIn;
  const user = useAuthStore.getState().user;
  

  const links = [ 
    {name: "Home", href:"/", src: "/images/Home.png", activeSrc: "/images/home-fill.png", title: "Home"}, 
    {name: "Explore", href:"/explore", src: "/images/bs-search.png", activeSrc: "/images/bs-search.png", title: "Search"}, 
    {name: "Create", href:"/create-page", src: "/images/Create Button.png", activeSrc: "/images/Create Button.png", title: "Create"}, 
    {name: "Profile", href: isLoggedIn ? `/profile-page/${user._id}` : "/login", src: "/images/bs-person.png", activeSrc: "/images/bs-fill-person-fill.png", title: "Profile"},
  ]

  

  

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleLogIn = () => {
      setShow(false)
      redirect("/login")
  }
  const handleSignUp = () => {
      setShow(false)
      redirect("/sign-up")
  }

  
  return (

    
    <div className='leftBar'>


      <Modal show={show} onHide={handleClose} centered backdrop="static" className='logout-overlay'>
        <Modal.Header className="logout-overlay-header">
          <CloseButton variant="white" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body className='logout-overlay-text'>
          <p>Please login or sign in to perform this action</p>
        </Modal.Body>
        <Modal.Footer className='logout-overlay-footer'>
          <Button variant="danger" onClick={handleLogIn}>
            Login
          </Button>
          <Button variant="secondary" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
        
      
      

      <div className="menuIcons">
        {links.map((link) => {
          
          if (link.name === "Create" || "Profile" ) {

            return isLoggedIn ?
            ( 
                <div 
                  key={link.name}>
                  <Link
                    key={link.name}
                    href={link.href}
                    className="menuIcon"
                    title={link.title}
                  >
                    <img src={ pathName === link.href ? link.activeSrc : link.src } />
                  </Link>
                </div>
              ) : (
                 <div 
                    onClick={() => setShow(true)}
                    key={link.name}
                  >
                  <div
                    key={link.name}
                    className="menuIcon"
                    title={link.title}
                  >
                    <img 
                      src={ pathName === link.href ? link.activeSrc : link.src } 
                      />
                  </div>
                </div>
              )
          } else {
            return (
                <div key={link.name}>
                  <Link
                    key={link.name}
                    href={link.href}
                    className="menuIcon"
                    title={link.title}
                  >
                    <img src={ pathName === link.href ? link.activeSrc : link.src } />
                  </Link>
                </div>
              );
          }
          
            }
          )
        }
      
      </div>

    </div>




  )
}

export default LeftBar
