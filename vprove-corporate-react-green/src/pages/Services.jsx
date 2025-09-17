export default function Services(){
  return (
    <div id="services" className="page active">
      <div className="page-container">
        <h1 className="page-title">Our Services</h1>
        <p className="page-subtitle">Comprehensive AI and technology solutions that drive business transformation</p>
        <div className="card-grid card-grid-3">
          <div className="card"><h3 className="team-name">AI & GenAI Development</h3><p className="team-role">Chatbots • RAG • Vision • NLP • MLOps</p></div>
          <div className="card"><h3 className="team-name">Cloud Engineering</h3><p className="team-role">Kubernetes • Terraform • Observability</p></div>
          <div className="card"><h3 className="team-name">Android & Full‑Stack</h3><p className="team-role">AOSP • Spring Boot • React</p></div>
        </div>
      </div>
    </div>
  )
}
