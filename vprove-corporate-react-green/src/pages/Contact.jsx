export default function Contact(){
  return (
    <div id="contact" className="page active">
      <div className="page-container">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">Let's build something impactful together.</p>
        <div className="card-grid card-grid-3">
          <div className="card" style={{gridColumn:'span 2'}}>
            <h3 className="team-name">Get in touch</h3>
            <p className="team-role">Email: hello@vprove.ai • Phone: +1 (555) 555‑1234</p>
          </div>
          <div className="card">
            <input className="border rounded p-2 w-full mb-2" placeholder="Your name"/>
            <input className="border rounded p-2 w-full mb-2" placeholder="Your email"/>
            <textarea className="border rounded p-2 w-full mb-2" placeholder="Your message"></textarea>
            <button className="nav-cta" style={{width:'100%',textAlign:'center'}}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
