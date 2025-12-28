import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BBLogo from "../assets/Boiler_BLockchain_Logo_SVG.png";

const MobileMenu = ({ dropdownData, navLinks, isActiveRoute, onClose }) => {
  const [expandedDropdowns, setExpandedDropdowns] = useState({});

  const toggleDropdown = (key) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 mt-3 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl py-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      {Object.entries(dropdownData).map(([key, dropdown]) => (
        <div key={key} className="px-4">
          <button
            onClick={() => toggleDropdown(key)}
            className="w-full flex items-center justify-between text-white text-sm font-medium py-3 hover:bg-white/5 rounded-lg px-2 transition-colors"
          >
            {dropdown.label}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${expandedDropdowns[key] ? 'rotate-180' : ''}`}
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
          </button>
          {expandedDropdowns[key] && (
            <div className="pl-4 space-y-1">
              {dropdown.items.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`block text-gray-300 text-sm py-2.5 px-2 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? 'text-white bg-purple-500/20 font-medium'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {navLinks.map((link) => {
        const isActive = isActiveRoute(link.path);
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'text-white bg-purple-500/20'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
            onClick={onClose}
          >
            {link.label}
          </Link>
        );
      })}

      <Link
        to="/contact"
        className="block mx-4 mt-4 px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white text-sm font-semibold text-center hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
        onClick={onClose}
      >
        Contact Us
      </Link>
    </div>
  );
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
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
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 sm:pt-8 pointer-events-none">
      <nav className="relative w-full max-w-7xl pointer-events-auto">
        {/* Main Navigation Bar */}
        <div
          className={`
            relative flex items-center justify-between
            bg-white/5 backdrop-blur-2xl
            rounded-2xl
            px-6 py-4
            shadow-2xl shadow-black/10
            border border-white/10
            transition-all duration-500 ease-out
            ${isScrolled ? 'bg-white/8 border-white/15 shadow-black/20' : 'bg-white/5 border-white/10'}
          `}
          style={{
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          }}
        >
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-opacity duration-200 hover:opacity-80"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/30 overflow-hidden">
              <img
                src={BBLogo}
                alt="Boiler Blockchain Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="hidden sm:block text-white font-semibold text-lg tracking-tight">
              Boiler Blockchain
            </span>
          </Link>

          {/* Center: Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-12">
            {Object.entries(dropdownData).map(([key, dropdown]) => {
              const isActive = isActiveRoute(dropdown.path);
              const isOpen = activeDropdown === key;
              
              return (
                <div 
                  key={key} 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={dropdown.path}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 flex items-center gap-1.5
                      ${isActive || isOpen
                        ? 'text-white bg-purple-500/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {dropdown.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
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

                  {/* Dropdown Menu */}
                  {(isOpen || activeDropdown === key) && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl py-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                      {dropdown.items.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className={`
                            block px-4 py-2.5 text-sm transition-colors
                            ${isActiveRoute(item.path)
                              ? 'text-white bg-purple-500/20 font-medium'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }
                          `}
                        >
                          {item.label}
                        </Link>
                      ))}
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
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'text-white bg-purple-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 group"
            >
              Contact Us
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <MobileMenu 
            dropdownData={dropdownData}
            navLinks={navLinks}
            isActiveRoute={isActiveRoute}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </header>
  );
};

export default Navigation;
