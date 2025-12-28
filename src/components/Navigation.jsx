import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BBLogo from "../assets/Boiler_BLockchain_Logo_SVG.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const dropdownData = {
    teams: {
      label: 'Teams',
      path: '/teams',
      items: [
        { label: 'Developer Team', path: '/teams/developer' },
        { label: 'Research Team', path: '/teams/research' },
        { label: 'Operations Team', path: '/teams/operations' }
      ]
    },
    courses: {
      label: 'Courses',
      path: '/courses',
      items: [
        { label: 'Technical Course', path: '/courses/technical' },
        { label: 'Non-Technical Course', path: '/courses/non-technical' }
      ]
    }
  };

  const navLinks = [
    { label: 'Partners', path: '/partners' },
    { label: 'The Team', path: '/people/team' }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '1.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        pointerEvents: 'none',
      }}
    >
      <nav 
        style={{ 
          width: '100%',
          maxWidth: '1280px',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7120b0 0%, #bb20ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img
                src={BBLogo}
                alt="Boiler Blockchain Logo"
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
            </div>
            <span style={{
              color: '#ffffff',
              fontSize: '1.125rem',
              fontWeight: 600,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              Boiler Blockchain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center', marginLeft: '3rem', marginRight: '3rem' }} className="hidden lg:flex">
            {Object.entries(dropdownData).map(([key, dropdown]) => {
              const isActive = isActiveRoute(dropdown.path);
              const isOpen = activeDropdown === key;
              
              return (
                <div 
                  key={key}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={dropdown.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive || isOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: isActive || isOpen ? 'rgba(113, 32, 176, 0.2)' : 'transparent',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.target.style.color = '#ffffff';
                      if (!isActive) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      if (!isActive) e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    {dropdown.label}
                    <svg
                      style={{
                        width: '14px',
                        height: '14px',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  {/* Dropdown */}
                  {isOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        paddingTop: '0.5rem',
                        zIndex: 1001,
                      }}
                      onMouseEnter={() => setActiveDropdown(key)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div style={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '0.5rem 0',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        minWidth: '224px',
                      }}>
                        {dropdown.items.map((item, index) => (
                          <Link
                            key={index}
                            to={item.path}
                            style={{
                              display: 'block',
                              padding: '0.625rem 1rem',
                              textDecoration: 'none',
                              color: isActiveRoute(item.path) ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                              backgroundColor: isActiveRoute(item.path) ? 'rgba(113, 32, 176, 0.2)' : 'transparent',
                              fontSize: '0.875rem',
                              fontWeight: isActiveRoute(item.path) ? 500 : 400,
                              fontFamily: 'system-ui, -apple-system, sans-serif',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActiveRoute(item.path)) {
                                e.target.style.color = '#ffffff';
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActiveRoute(item.path)) {
                                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                                e.target.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {navLinks.map((link) => {
              const isActive = isActiveRoute(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: isActive ? 'rgba(113, 32, 176, 0.2)' : 'transparent',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = '#ffffff';
                    if (!isActive) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                    if (!isActive) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Contact Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/contact"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #7120b0 0%, #bb20ff 100%)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s ease',
              }}
              className="hidden sm:flex"
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 12px rgba(113, 32, 176, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Contact Us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              className="lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={{
            marginTop: '0.75rem',
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}>
            {Object.entries(dropdownData).map(([key, dropdown]) => (
              <div key={key} style={{ marginBottom: '0.5rem' }}>
                <Link
                  to={dropdown.path}
                  style={{
                    display: 'block',
                    padding: '0.75rem',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {dropdown.label}
                </Link>
              </div>
            ))}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              style={{
                display: 'block',
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #7120b0 0%, #bb20ff 100%)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
