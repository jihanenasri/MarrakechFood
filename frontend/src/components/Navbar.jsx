import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ userRole, onLogout }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/restaurants', label: 'Accueil', icon: '🏠', roles: ['CLIENT', 'ADMIN', 'LIVREUR'] },
    { to: '/cart', label: 'Panier', icon: '🛒', roles: ['CLIENT', 'ADMIN'] },
    { to: '/admin/restaurant/add', label: 'Ajouter', icon: '➕', roles: ['ADMIN'] },
    { to: '/admin/restaurants', label: 'Restaurants', icon: '📋', roles: ['ADMIN'] },
    { to: '/livreur/dashboard', label: 'Livraisons', icon: '🚚', roles: ['LIVREUR'] },
  ].filter(link => link.roles.includes(userRole));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        .mf-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 107, 53, 0.12);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 24px rgba(255, 107, 53, 0.08);
          font-family: 'DM Sans', sans-serif;
        }

        .mf-brand {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: #FF6B35;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.5px;
        }

        .mf-brand-logo {
          height: 32px;
          width: auto;
        }

        .mf-brand:hover { color: #e85a2a; }

        .mf-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mf-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #555;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .mf-link:hover {
          background: rgba(255, 107, 53, 0.08);
          color: #FF6B35;
        }

        .mf-link.active {
          background: rgba(255, 107, 53, 0.12);
          color: #FF6B35;
          font-weight: 600;
        }

        .mf-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: #FF6B35;
          border-radius: 99px;
        }

        .mf-link-icon {
          font-size: 1rem;
          line-height: 1;
        }

        .mf-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #FF6B35;
          background: rgba(255, 107, 53, 0.08);
          border: 1.5px solid rgba(255, 107, 53, 0.2);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }

        .mf-logout:hover {
          background: #FF6B35;
          color: white;
          border-color: #FF6B35;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 107, 53, 0.25);
        }

        .mf-role-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 8px;
        }

        .mf-role-badge.admin { background: #fff1ea; color: #FF6B35; border: 1px solid rgba(255,107,53,0.2); }
        .mf-role-badge.livreur { background: #e8f5e9; color: #2e7d32; border: 1px solid rgba(46,125,50,0.2); }
        .mf-role-badge.client { background: #e3f2fd; color: #1565c0; border: 1px solid rgba(21,101,192,0.2); }

        .mf-divider {
          width: 1px;
          height: 24px;
          background: rgba(0,0,0,0.08);
          margin: 0 8px;
        }

        /* Mobile hamburger */
        .mf-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
        }

        .mf-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #FF6B35;
          border-radius: 2px;
          transition: all 0.25s ease;
        }

        .mf-mobile-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0; right: 0;
          background: white;
          border-bottom: 1px solid rgba(255,107,53,0.1);
          padding: 12px 16px;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          z-index: 99;
        }

        .mf-mobile-menu.open { display: flex; }

        .mf-mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          color: #333;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.15s;
        }
        .mf-mobile-link:hover, .mf-mobile-link.active {
          background: rgba(255,107,53,0.08);
          color: #FF6B35;
        }

        @media (max-width: 768px) {
          .mf-links { display: none; }
          .mf-logout { display: none; }
          .mf-hamburger { display: flex; }
          .mf-role-badge { display: none; }
        }
      `}</style>

      <nav className="mf-nav">
        {/* Brand avec logo */}
        <Link to="/restaurants" className="mf-brand">
          <img 
            src="/images/logo.png" 
            alt="Marrakech Food" 
            className="mf-brand-logo"
            onError={(e) => { e.target.src = 'https://placehold.co/40x40/FF6B35/white?text=MF'; }}
          />
          Marrakech Food
          <span className={`mf-role-badge ${userRole?.toLowerCase()}`}>
            {userRole}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="mf-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`mf-link ${isActive(link.to) ? 'active' : ''}`}
              >
                <span className="mf-link-icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
          <li><div className="mf-divider" /></li>
          <li>
            <button className="mf-logout" onClick={onLogout}>
              🚪 Déconnexion
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button className="mf-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`mf-mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`mf-mobile-link ${isActive(link.to) ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
        <button
          className="mf-mobile-link"
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FF6B35', fontWeight: 600 }}
          onClick={() => { setMenuOpen(false); onLogout(); }}
        >
          🚪 Déconnexion
        </button>
      </div>
    </>
  );
}

export default Navbar;