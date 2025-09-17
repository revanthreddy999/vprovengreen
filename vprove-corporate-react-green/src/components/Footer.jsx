import { Link } from 'react-router-dom'
export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
            <div className="logo-icon"><span>👑</span></div>
            <div>
              <div style={{fontWeight:900,fontSize:'1.1rem'}}>VPROVE</div>
              <div style={{opacity:.8,fontWeight:700,letterSpacing:1}}>WE PROVE YOUR VISION</div>
            </div>
          </div>
          <p style={{opacity:.8,maxWidth:520}}>AI-first platforms • Cloud-native engineering • Measurable outcomes.</p>
        </div>
        <div><h4>Company</h4><Link to="/team">Team</Link><br/><Link to="/careers">Careers</Link></div>
        <div><h4>Solutions</h4><Link to="/services">Services</Link><br/><Link to="/case-studies">Case Studies</Link></div>
        <div><h4>Contact</h4><Link to="/contact">Get Started</Link></div>
      </div>
    </footer>
  )
}
