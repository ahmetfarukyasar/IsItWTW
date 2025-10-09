import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/iwtow.jpg'
import { FaBars, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

const Navbar = () => {

    const liLink = `
      flex p-4 px-6 rounded-xl items-center justify-center
      bg-[var(--bg-primary)] text-[var(--text-primary)]
      relative
      after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1
      after:rounded-lg after:bg-gradient-to-r after:from-purple-400 after:via-pink-500 after:to-red-500
      after:opacity-0 after:blur-md after:transition-opacity after:duration-300
      hover:after:opacity-100
    `;
    
    const liLinkActive = `
      flex p-4 px-6 rounded-xl items-center justify-center
      bg-[var(--bg-primary)] text-[var(--text-primary)]
      relative
      after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1
      after:rounded-lg after:bg-gradient-to-r after:from-purple-400 after:via-pink-500 after:to-red-500
      after:opacity-100 after:blur-md after:transition-opacity after:duration-300
    `;

  return (
    <div className='flex flex-row pl-16 items-center justify-around p-4 bg-(--bg-primary)'>
        <img src={logo} alt="" width={200}/>
        <ul className='flex flex-row gap-16'>
            <NavLink to='/' end className={({isActive}) => isActive 
                ? liLinkActive
                : liLink
            }><li>Home</li></NavLink>
            <NavLink to='/explore' className={({isActive}) => isActive 
                ? liLinkActive
                : liLink
            }><li>Explore</li></NavLink>
            <NavLink to='/favorites' className={({isActive}) => isActive 
                ? liLinkActive
                : liLink
            }><li>Favorites</li></NavLink>
            <NavLink to='/about' className={({isActive}) => isActive 
                ? liLinkActive
                : liLink
            }><li>About</li></NavLink>
        </ul>
        <div className="links flex flex-row gap-4">
          <a href='https://www.github.com/ahmetfarukyasar'><FaGithub size={30} color='white'/></a>
          <a href='https://www.linkedin.com/in/ahmetfarukyasar'><FaLinkedin  size={30} color='white'/></a>
          <a href='https://www.instagram.com/ahmetfarukysr'><FaInstagram  size={30} color='white'/></a>
        </div>
    </div>
  )
}

export default Navbar