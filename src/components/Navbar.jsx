import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import logo from '../assets/iwtow.jpg'
import { FaBars, FaXmark, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const liLink = `
    flex p-4 px-6 rounded-xl items-center justify-center
    bg-[var(--bg-primary)] text-[var(--text-primary)]
    relative
    after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1
    after:rounded-lg after:bg-gradient-to-r after:from-purple-400 after:via-pink-500 after:to-red-500
    after:opacity-0 after:blur-md after:transition-opacity after:duration-300
    hover:after:opacity-100
  `

  const liLinkActive = `
    flex p-4 px-6 rounded-xl items-center justify-center
    bg-[var(--bg-primary)] text-[var(--text-primary)]
    relative
    after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1
    after:rounded-lg after:bg-gradient-to-r after:from-purple-400 after:via-pink-500 after:to-red-500
    after:opacity-100 after:blur-md after:transition-opacity after:duration-300
  `

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/explore", text: "Explore" },
    { to: "/favorites", text: "Favorites" },
    { to: "/about", text: "About" },
  ]

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-4 bg-[var(--bg-primary)] relative">
      <Link to="/"><img src={logo} className="w-48" /></Link>

      <ul className="hidden md:flex flex-row gap-10">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end className={({ isActive }) => (isActive ? liLinkActive : liLink)}>
            <li>{link.text}</li>
          </NavLink>
        ))}
      </ul>

      <div className="hidden md:flex flex-row gap-4">
        <a href="https://github.com/ahmetfarukyasar" target="_blank" rel="noreferrer">
          <FaGithub size={28} color="white" />
        </a>
        <a href="https://linkedin.com/in/ahmetfarukyasar" target="_blank" rel="noreferrer">
          <FaLinkedin size={28} color="white" />
        </a>
        <a href="https://instagram.com/ahmetfarukysr" target="_blank" rel="noreferrer">
          <FaInstagram size={28} color="white" />
        </a>
      </div>

      <button className="md:hidden text-white z-50" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaXmark size={28} /> : <FaBars size={28} />}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-2/3 bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-8
          transition-transform duration-300 z-40
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => (isActive ? liLinkActive : liLink)}
            onClick={() => setMenuOpen(false)}
          >
            <li className="list-none text-2xl">{link.text}</li>
          </NavLink>
        ))}

        <div className="flex gap-6 mt-4">
          <a href="https://github.com/ahmetfarukyasar" target="_blank" rel="noreferrer">
            <FaGithub size={28} color="white" />
          </a>
          <a href="https://linkedin.com/in/ahmetfarukyasar" target="_blank" rel="noreferrer">
            <FaLinkedin size={28} color="white" />
          </a>
          <a href="https://instagram.com/ahmetfarukysr" target="_blank" rel="noreferrer">
            <FaInstagram size={28} color="white" />
          </a>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  )
}

export default Navbar
