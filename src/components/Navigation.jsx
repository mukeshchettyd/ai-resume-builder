import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const navItems = [
    { to: '/builder', label: 'Builder' },
    { to: '/preview', label: 'Preview' },
    { to: '/proof', label: 'Proof' },
]

function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false)
    const toggleMenu = () => setMenuOpen(prev => !prev)
    const closeMenu = () => setMenuOpen(false)

    return (
        <nav className="nav" id="main-nav">
            <div className="nav-inner">
                <Link to="/" className="nav-brand" onClick={closeMenu}>
                    AI Resume Builder
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        className="nav-hamburger"
                        id="nav-hamburger"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        <span className={`nav-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`nav-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`nav-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>

                <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`} id="nav-links">
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'nav-link--active' : ''}`
                                }
                                onClick={closeMenu}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {menuOpen && (
                <div className="nav-overlay" onClick={closeMenu}></div>
            )}
        </nav>
    )
}

export default Navigation
