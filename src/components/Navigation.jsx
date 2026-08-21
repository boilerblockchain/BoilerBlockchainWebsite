import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
const BBLogo = '/images/logos/boiler_blockchain_logo_svg.webp';

const NavHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding-inline: ${({ theme }) => theme.sectionPadding.inline};
  /* Always opaque. The hero photo runs to the top edge, so a transparent bar
     left "Partners" and "Our Team" sitting unreadably on top of it. */
  background: ${({ $isScrolled }) =>
    $isScrolled ? 'rgba(0, 0, 0, 0.92)' : ' #000000'};
  backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? 'blur(12px)' : 'none')};
  -webkit-backdrop-filter: ${({ $isScrolled }) =>
    $isScrolled ? 'blur(12px)' : 'none'};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  transition: background ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base};
`;

const Nav = styled.nav`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidthWide};
  position: relative;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.layout.navHeight};
  gap: 1rem;

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

/**
 * The logo asset is square (276x275). It was previously forced to width: 120px
 * inside this 40px box with overflow: visible, so it spilled 80px to the right
 * and sat on top of the wordmark text.
 */
const LogoBox = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
  text-decoration: none;
  color: ${props => props.$isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  background-color: ${props => props.$isActive || props.$isOpen ? 'rgba(168, 85, 247, 0.14)' : 'transparent'};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'Tomorrow', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background-color: ${props => props.$isActive ? 'rgba(168, 85, 247, 0.14)' : 'rgba(255, 255, 255, 0.05)'};
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
  background-color: #0E0E12;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  min-width: 224px;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.625rem 1rem;
  text-decoration: none;
  color: ${props => props.$isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  background-color: ${props => props.$isActive ? 'rgba(168, 85, 247, 0.14)' : 'transparent'};
  font-size: 0.875rem;
  font-weight: ${props => props.$isActive ? 500 : 400};
  font-family: 'Tomorrow', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background-color: ${props => props.$isActive ? 'rgba(168, 85, 247, 0.14)' : 'rgba(255, 255, 255, 0.05)'};
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
  background: ${({ theme }) => theme.color.accentDeep};
  border: none;
    text-decoration: none;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fontFamily.display};
  transition: background ${({ theme }) => theme.motion.base},
              transform ${({ theme }) => theme.motion.base};
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.color.accent};
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
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 0.5rem;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: #0E0E12;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: ${props => props.$isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: ${props => props.$isActive ? 500 : 400};
  font-family: 'Tomorrow', sans-serif;
  background-color: ${props => props.$isActive ? 'rgba(168, 85, 247, 0.14)' : 'transparent'};
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

  // Escape closes the mobile menu and any open dropdown.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    { label: 'Our Team', path: '/people/team' }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <NavHeader $isScrolled={isScrolled}>
      <Nav>
        <NavContainer>
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
                    $isActive={isActive}
                    $isOpen={isOpen}
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
                            $isActive={isActiveRoute(item.path)}
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
                $isActive={isActiveRoute(link.path)}
                >
                  {link.label}
              </NavLink>
            ))}
          </DesktopNav>

          <ContactButtonWrapper>
            <ContactButton to="/contact">
              Contact Us
            </ContactButton>

            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
            >
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

        <MobileNav id="mobile-nav" $isOpen={isMobileMenuOpen}>
            {Object.entries(dropdownData).map(([key, dropdown]) => (
            <MobileDropdownSection key={key}>
              <MobileDropdownTitle>{dropdown.label}</MobileDropdownTitle>
              <MobileDropdownItems>
                {dropdown.items.map((item, index) => (
                  <MobileNavLink
                    key={index}
                    to={item.path}
                    $isActive={isActiveRoute(item.path)}
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
              $isActive={isActiveRoute(link.path)}
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
