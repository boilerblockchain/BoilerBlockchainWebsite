import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "./Logo";

const Navigation = () => {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const btnRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide when scrolling down
      } else {
        setIsVisible(true); // Show when scrolling up or at top
      }
      
      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e) => {
      // Show navbar when mouse is near the top of the screen
      if (e.clientY <= 80) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollY]);

  const dropdownData = {
    teams: {
      label: 'Teams',
      path: '/teams',
      items: [
        { label: 'Developer Team', path: '/teams/developer' },
        { label: 'Research Team', path: '/teams/research' },
        { label: 'Marketing Team', path: '/teams/marketing' }
      ]
    },
    courses: {
      label: 'Courses',
      path: '/courses',
      items: [
        { label: 'Technical Course', path: '/courses/technical' },
        { label: 'Non-Technical Course', path: '/courses/non-technical' }
      ]
    },
    people: {
      label: 'People',
      path: '/people',
      items: [
        { label: 'Our Team', path: '/people/team' },
        { label: 'Alumni', path: '/people/alumni' }
      ]
    }
  };

  const handleMouseMove = (e) => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const strength = Math.min(distance / maxDistance, 1) * 0.3;
    
    const targetX = deltaX * strength;
    const targetY = deltaY * strength;
    
    animateToPosition(targetX, targetY);
  };

  const animateToPosition = (targetX, targetY) => {
    const btn = btnRef.current;
    const currentTransform = btn.style.transform || 'translate(0px, 0px)';
    const matches = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    
    const currentX = matches ? parseFloat(matches[1]) : 0;
    const currentY = matches ? parseFloat(matches[2]) : 0;
    
    const diffX = targetX - currentX;
    const diffY = targetY - currentY;
    
    if (Math.abs(diffX) < 0.1 && Math.abs(diffY) < 0.1) return;
    
    const newX = currentX + diffX * 0.15;
    const newY = currentY + diffY * 0.15;
    
    btn.style.transform = `translate(${newX}px, ${newY}px)`;
    
    animationIdRef.current = requestAnimationFrame(() => animateToPosition(targetX, targetY));
  };

  const animateBack = () => {
    const btn = btnRef.current;
    const currentTransform = btn.style.transform || 'translate(0px, 0px)';
    const matches = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    
    const currentX = matches ? parseFloat(matches[1]) : 0;
    const currentY = matches ? parseFloat(matches[2]) : 0;
    
    if (Math.abs(currentX) < 0.1 && Math.abs(currentY) < 0.1) {
      btn.style.transform = 'translate(0px, 0px)';
      return;
    }
    
    const newX = currentX * 0.85;
    const newY = currentY * 0.85;
    
    btn.style.transform = `translate(${newX}px, ${newY}px)`;
    
    animationIdRef.current = requestAnimationFrame(animateBack);
  };

  const handleMouseEnter = () => {
    btnRef.current.addEventListener('mousemove', handleMouseMove);
  };

  const handleMouseLeave = () => {
    btnRef.current.removeEventListener('mousemove', handleMouseMove);
    
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    
    animateBack();
  };

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out border-b ${
          isScrolled 
            ? 'bg-black/60 backdrop-blur-xl border-zinc-700/50 shadow-2xl shadow-purple-500/10' 
            : 'bg-transparent border-transparent'
        } ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(17,17,17,0.9))'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderImage: isScrolled 
            ? 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent) 1'
            : 'none'
        }}
      >
        <div className={`container flex items-center justify-between pl-8 pr-4 mx-auto transition-all duration-300 ${
          isScrolled ? 'py-3' : 'pt-6 pb-4'
        }`}>
          <div className="flex items-center">
              <Logo />
          </div>

          <div className="flex items-center justify-center gap-8 flex-1 max-w-2xl mx-auto">
            {Object.entries(dropdownData).map(([key, dropdown]) => (
              <div key={key} className="relative group">
                <Link 
                  to={dropdown.path}
                  className={`duration-300 text-sans animate-fade-in flex items-center gap-1 text-decoration-none transition-all ${
                    isScrolled 
                      ? 'text-zinc-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {dropdown.label}
                  <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                
                <div className={`absolute top-full left-0 mt-2 w-48 border rounded-lg py-2 z-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                  isScrolled 
                    ? 'bg-black/70 backdrop-blur-xl border-zinc-600/50 shadow-2xl shadow-purple-500/20' 
                    : 'bg-zinc-900/90 backdrop-blur-md border-zinc-700 shadow-lg'
                }`}>
                  {dropdown.items.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link
              to="/partners"
              className={`duration-300 text-sans animate-fade-in transition-all ${
                isScrolled 
                  ? 'text-zinc-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Partners
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              to="/contact"
              ref={btnRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                background: isScrolled 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.9))'
                  : 'linear-gradient(135deg, #8B5CF6, #7c3aed)',
                color: 'white',
                border: isScrolled ? '1px solid rgba(139, 92, 246, 0.4)' : 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                minWidth: '120px',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: isScrolled 
                  ? '0 4px 20px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 4px 12px rgba(139, 92, 246, 0.3)',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
                willChange: 'transform',
                textDecoration: 'none',
                display: 'inline-block',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
              className="join-waitlist-btn"
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #9333ea, #8B5CF6)';
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                const shine = e.target.querySelector('.shine-effect');
                if (shine) shine.style.left = '100%';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #8B5CF6, #7c3aed)';
                e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                const shine = e.target.querySelector('.shine-effect');
                if (shine) shine.style.left = '-100%';
              }}
              onMouseDown={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)';
                e.target.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
              }}
            >
              <span
                style={{
                  content: '',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
                  pointerEvents: 'none'
                }}
                className="shine-effect"
              />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;