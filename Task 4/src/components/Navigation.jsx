import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">React Router App</h1>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">Contact</Link>
          </li>
          <li className="nav-item">
            <Link to="/mahad" className="nav-link">Mahad</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
