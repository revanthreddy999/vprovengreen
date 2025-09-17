export default function Home(){
  return (
    <div id="home" className="page active">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div>
              <div className="hero-badge"><i className="fas fa-crown"></i> Leading AI Innovation Company</div>
              <h1 className="hero-title">Green AI for Real‑World Impact</h1>
              <p className="hero-subtitle">
                We build AI‑first platforms and cloud systems that are efficient, scalable, and sustainable.
              </p>
              <div className="hero-cta" style={{display:'flex',gap:'1rem',marginTop:'1rem'}}>
                <a className="nav-cta" href="/services"><i className="fas fa-rocket"></i> Explore Services</a>
                <a className="nav-item" href="/case-studies"><i className="fas fa-chart-line"></i> Success Stories</a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card">
                <div className="service-grid">
                  <div className="service-item"><img className="service-thumb" src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop" alt="AI systems"/><div className="service-label">AI & ML</div></div>
                  <div className="service-item"><img className="service-thumb" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" alt="Cloud infra"/><div className="service-label">Cloud</div></div>
                  <div className="service-item"><img className="service-thumb" src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1600&auto=format&fit=crop" alt="Automation"/><div className="service-label">Automation</div></div>
                  <div className="service-item"><img className="service-thumb" src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop" alt="Full‑Stack"/><div className="service-label">Full‑Stack</div></div>
                </div>

                <div className="threeD" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginTop:'1rem'}}>
                  <div className="card3d" style={{height:'160px'}}>
                    <div className="face front">Realtime Analytics</div>
                    <div className="face back">RAG + Vector Search</div>
                  </div>
                  <div className="card3d" style={{height:'160px',animationDuration:'16s'}}>
                    <div className="face front">Kubernetes</div>
                    <div className="face back">Auto‑scaling</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
