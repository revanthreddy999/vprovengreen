import { NavLink, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Navbar(){
  const ref = useRef(null)
  useEffect(()=>{
    const onScroll = () => {
      if(!ref.current) return
      if(window.scrollY>8) ref.current.classList.add('scrolled')
      else ref.current.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll)
    return ()=>window.removeEventListener('scroll', onScroll)
  },[])

  const item = ({isActive}) => `nav-item ${isActive?'bg-[rgba(34,197,94,.12)] text-[var(--primary-dark)]':''}`

  return (
    <nav className="navbar" ref={ref}>
      <div className="nav-container">
        <Link className="logo" to="/">
          <div className="logo-icon"><span className="logo-crown">👑</span></div>
          <div>
            <div className="logo-title">VPROVE</div>
            <div className="logo-subtitle">WE PROVE YOUR VISION</div>
          </div>
        </Link>
        <div className="nav-menu">
          <NavLink end to="/" className={item}>Home</NavLink>
          <NavLink to="/services" className={item}>Services</NavLink>
          <NavLink to="/solutions" className={item}>AI Solutions</NavLink>
          <NavLink to="/case-studies" className={item}>Case Studies</NavLink>
          <NavLink to="/team" className={item}>Team</NavLink>
          <NavLink to="/careers" className={item}>Careers</NavLink>
          <NavLink to="/contact" className={()=>'nav-cta'}>Get Started</NavLink>
        </div>
      </div>
    </nav>
  )
}
