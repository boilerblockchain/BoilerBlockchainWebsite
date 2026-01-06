import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import BBLogo from "../assets/images/logos/Boiler_BLockchain_Logo_SVG.png";

const NavHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  pointer-events: none;

  @media (max-width: 768px) {
    padding-top: 1rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 1280px;
  pointer-events: auto;
  position: relative;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.isScrolled 
    ? 'rgba(30, 30, 40, 0.75)' 
    : 'rgba(25, 25, 35, 0.65)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  gap: 1rem;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 0.875rem 1.25rem;
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  flex-shrink: 0;

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const LogoBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
  }

  img {
    width: 120px;
    height: auto;
    max-height: 50px;
    max-width: 120px;
    object-fit: contain;

    @media (max-width: 640px) {
      max-height: 45px;
      max-width: 100px;
    }
  }
`;

const LogoText = styled.span`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
  margin-left: 3rem;
  margin-right: 3rem;

  @media (max-width: 1024px) {
    margin-left: 2rem;
    margin-right: 2rem;
    gap: 0.375rem;
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  background-color: ${props => props.isActive || props.isOpen ? 'rgba(113, 32, 176, 0.2)' : 'transparent'};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'Tomorrow', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background-color: ${props => props.isActive ? 'rgba(113, 32, 176, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  }

  @media (max-width: 1024px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 0.5rem;
  z-index: 1001;
`;

const DropdownContent = styled.div`
  background-color: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  min-width: 224px;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.625rem 1rem;
  text-decoration: none;
  color: ${props => props.isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  background-color: ${props => props.isActive ? 'rgba(113, 32, 176, 0.2)' : 'transparent'};
  font-size: 0.875rem;
  font-weight: ${props => props.isActive ? 500 : 400};
  font-family: 'Tomorrow', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background-color: ${props => props.isActive ? 'rgba(113, 32, 176, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const ContactButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const ContactButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
  border: none;
  border-radius: 12px;
  text-decoration: none;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(113, 32, 176, 0.3);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #7a30c0 0%, #c430ff 100%);
    box-shadow: 0 6px 24px rgba(113, 32, 176, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    padding: 0.5rem 1.25rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;

  @media (max-width: 968px) {
    display: flex;
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MobileNav = styled.div`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 0.5rem;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1001;

  @media (min-width: 969px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 0.75rem;
  color: ${props => props.isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: ${props => props.isActive ? 500 : 400};
  font-family: 'Tomorrow', sans-serif;
  border-radius: 8px;
  background-color: ${props => props.isActive ? 'rgba(113, 32, 176, 0.2)' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const MobileDropdownSection = styled.div`
  margin-bottom: 0.5rem;
`;

const MobileDropdownTitle = styled.div`
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
`;

const MobileDropdownItems = styled.div`
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
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
    }
  };

  const navLinks = [
    { label: 'Technical Course', path: '/courses/technical' },
    { label: 'Partners', path: '/partners' },
    { label: 'The Team', path: '/people/team' }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <NavHeader>
      <Nav>
        <NavContainer isScrolled={isScrolled}>
          <LogoLink to="/">
            <LogoBox>
              <img src={BBLogo} alt="Boiler Blockchain Logo" />
            </LogoBox>
            <LogoText>Boiler Blockchain</LogoText>
          </LogoLink>

          <DesktopNav>
            {Object.entries(dropdownData).map(([key, dropdown]) => {
              const isActive = isActiveRoute(dropdown.path);
              const isOpen = activeDropdown === key;
              
              return (
                <DropdownContainer
                  key={key}
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink
                    to={dropdown.path}
                    isActive={isActive}
                    isOpen={isOpen}
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
                  </NavLink>

                  {isOpen && (
                    <DropdownMenu>
                      <DropdownContent>
                        {dropdown.items.map((item, index) => (
                          <DropdownItem
                            key={index}
                            to={item.path}
                            isActive={isActiveRoute(item.path)}
                          >
                            {item.label}
                          </DropdownItem>
                        ))}
                      </DropdownContent>
                    </DropdownMenu>
                  )}
                </DropdownContainer>
              );
            })}

            {navLinks.map((link) => (
              <NavLink
                  key={link.path}
                  to={link.path}
                isActive={isActiveRoute(link.path)}
                >
                  {link.label}
              </NavLink>
            ))}
          </DesktopNav>

          <ContactButtonWrapper>
            <ContactButton to="/contact">
              Contact Us
            </ContactButton>

            <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </MobileMenuButton>
          </ContactButtonWrapper>
        </NavContainer>

        <MobileNav isOpen={isMobileMenuOpen}>
            {Object.entries(dropdownData).map(([key, dropdown]) => (
            <MobileDropdownSection key={key}>
              <MobileDropdownTitle>{dropdown.label}</MobileDropdownTitle>
              <MobileDropdownItems>
                {dropdown.items.map((item, index) => (
                  <MobileNavLink
                    key={index}
                    to={item.path}
                    isActive={isActiveRoute(item.path)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                    {item.label}
                  </MobileNavLink>
                ))}
              </MobileDropdownItems>
            </MobileDropdownSection>
            ))}
            {navLinks.map((link) => (
            <MobileNavLink
                key={link.path}
                to={link.path}
              isActive={isActiveRoute(link.path)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
            </MobileNavLink>
            ))}
          <ContactButton
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
            style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            >
              Contact Us
          </ContactButton>
        </MobileNav>
      </Nav>
    </NavHeader>
  );
};

export default Navigation;
