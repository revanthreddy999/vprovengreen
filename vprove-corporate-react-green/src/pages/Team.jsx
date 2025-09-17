import revanth from '../assets/revanth.jpg'
import nithin from '../assets/nithin.jpg'
import raja from '../assets/raja.jpg'
import bhaskar from '../assets/bhaskar.jpg'

const Placeholder = () => (
  <div style={{background:'linear-gradient(135deg,#16a34a,#0ea5e9)',height:'220px',borderRadius:'16px'}}/>
)

export default function Team(){
  return (
    <div id="team" className="page active">
      <div className="page-container">
        <h1 className="page-title">Our Team</h1>
        <p className="page-subtitle">Leaders who shape the future with innovative technology solutions</p>
        <div className="team-grid">
          <div className="team-card"><img className="team-photo" src={revanth} alt="Revanth Reddy Kurra"/><div className="team-name">Revanth Reddy Kurra</div><div className="team-role">CEO & Founder</div></div>
          <div className="team-card"><img className="team-photo" src={nithin} alt="Nithin"/><div className="team-name">Nithin</div><div className="team-role">AI Chief</div></div>
          <div className="team-card"><img className="team-photo" src={raja} alt="Raja"/><div className="team-name">Raja</div><div className="team-role">Marketing Chief</div></div>
          <div className="team-card"><img className="team-photo" src={bhaskar} alt="Bhaskar"/><div className="team-name">Bhaskar</div><div className="team-role">Director of Operations</div></div>
          <div className="team-card"><Placeholder /><div className="team-name">Chaitanya</div><div className="team-role">Program Manager</div></div>
        </div>
      </div>
    </div>
  )
}
