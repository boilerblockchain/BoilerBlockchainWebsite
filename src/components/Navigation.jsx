import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

const BBLogo = '/images/logos/boiler_blockchain_logo_svg.webp';

/**
 * Flat technical navbar.
 *
 * Opaque at all times: the home hero photo runs to the top edge, and a
 * transparent bar left the right-hand links unreadable on top of it.
 */
const Header = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  height: ${({ theme }) => theme.layout.navHeight};
  padding-inline: ${({ theme }) => theme.sectionPadding.inline};
  background: ${({ theme }) => theme.color.black};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const Bar = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidthWide};
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  flex-shrink: 0;
  margin-right: auto;
`;

/* The asset is square (276x275). It used to be forced to width:120px inside a
   40px box with overflow:visible, so it spilled onto the wordmark. */
const Mark = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
  display: block;
`;

const Wordmark = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text};
  white-space: nowrap;

  /* Only drop the wordmark on the narrowest phones; there is room at 390px. */
  ${({ theme }) => theme.mediaDown.xs} {
    display: none;
  }
`;

const Links = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};

  ${({ theme }) => theme.media.lg} {
    display: flex;
  }
`;

/**
 * Active state is an accent underline rather than a filled pill — it reads as
 * a position indicator instead of a second button.
 */
const linkStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ $active, theme }) =>
    $active ? theme.color.text : theme.color.textMuted};
  transition: color ${({ theme }) => theme.motion.fast};

  &::after {
    content: '';
    position: absolute;
    left: ${({ theme }) => theme.space[3]};
    right: ${({ theme }) => theme.space[3]};
    bottom: 2px;
    height: 2px;
    background: ${({ theme }) => theme.color.accent};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left;
    transition: transform ${({ theme }) => theme.motion.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const NavLink = styled(Link)`
  ${linkStyles}
`;

const DropdownTrigger = styled(Link)`
  ${linkStyles}

  svg {
    transition: transform ${({ theme }) => theme.motion.fast};
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 210px;
  padding-block: ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
`;

const MenuItem = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $active, theme }) =>
    $active ? theme.color.accent : theme.color.textMuted};
  border-left: 2px solid
    ${({ $active, theme }) => ($active ? theme.color.accent : 'transparent')};
  transition: color ${({ theme }) => theme.motion.fast},
              background ${({ theme }) => theme.motion.fast},
              border-color ${({ theme }) => theme.motion.fast};

  &:hover {
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.accentWash};
    border-left-color: ${({ theme }) => theme.color.accent};
  }
`;

const ContactButton = styled(Link)`
  display: none;
  align-items: center;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.text};
  border: 1px solid ${({ theme }) => theme.color.accent};
  transition: background ${({ theme }) => theme.motion.fast},
              color ${({ theme }) => theme.motion.fast};

  &:hover {
    background: ${({ theme }) => theme.color.accent};
    color: #ffffff;
  }

  ${({ theme }) => theme.media.sm} {
    display: inline-flex;
  }
`;

const MenuToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.motion.fast};

  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
  }

  ${({ theme }) => theme.media.lg} {
    display: none;
  }
`;

const MobilePanel = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.layout.navHeight};
  left: 0;
  right: 0;
  max-height: calc(100dvh - ${({ theme }) => theme.layout.navHeight});
  overflow-y: auto;
  background: ${({ theme }) => theme.color.black};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  display: ${({ $open }) => ($open ? 'block' : 'none')};

  ${({ theme }) => theme.media.lg} {
    display: none;
  }
`;

const MobileLink = styled(Link)`
  display: block;
  /* 44px minimum tap target. */
  padding: ${({ theme }) => theme.space[4]}
    ${({ theme }) => theme.sectionPadding.inline};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $active, theme }) =>
    $active ? theme.color.accent : theme.color.textMuted};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  &:hover {
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.accentWash};
  }
`;

const MobileGroupLabel = styled.div`
  padding: ${({ theme }) => theme.space[4]}
    ${({ theme }) => theme.sectionPadding.inline}
    ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;

const MobileSubLink = styled(MobileLink)`
  border-top: 0;
  padding-left: calc(${({ theme }) => theme.sectionPadding.inline} + 1rem);
`;

const Chevron = (props) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M3 4.5 6 7.5 9 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const teamsDropdown = {
  label: 'Teams',
  path: '/teams',
  items: [
    { label: 'Developer Team', path: '/teams/developer' },
    { label: 'Research Team', path: '/teams/research' },
    { label: 'Operations Team', path: '/teams/operations' },
  ],
};

const navLinks = [
  { label: 'Technical Course', path: '/courses/technical' },
  { label: 'Partners', path: '/partners' },
  { label: 'Our Team', path: '/people/team' },
];

export default function Navigation() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setDropdownOpen(false);
      setMobileOpen(false);
    };
    // Clicking anywhere outside the dropdown closes it; previously it only
    // closed on mouseleave, so a tap on touch left it stuck open.
    const onPointerDown = (event) => {
      if (dropdownRef.current?.contains(event.target)) return;
      setDropdownOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  // Stop the page scrolling behind the open mobile panel.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <Header>
        <Bar>
          <Brand to="/" aria-label="Boiler Blockchain, home">
            <Mark src={BBLogo} alt="" width="32" height="32" />
            <Wordmark>Boiler Blockchain</Wordmark>
          </Brand>

          <Links>
            <Dropdown
              ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <DropdownTrigger
                to={teamsDropdown.path}
                $active={isActive(teamsDropdown.path)}
                $open={dropdownOpen}
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(false)}
              >
                {teamsDropdown.label}
                <Chevron />
              </DropdownTrigger>
              {dropdownOpen && (
                <Menu>
                  {teamsDropdown.items.map((item) => (
                    <MenuItem
                      key={item.path}
                      to={item.path}
                      $active={isActive(item.path)}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Dropdown>

            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} $active={isActive(link.path)}>
                {link.label}
              </NavLink>
            ))}
          </Links>

          <ContactButton to="/contact">Contact</ContactButton>

          <MenuToggle
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </MenuToggle>
        </Bar>
      </Header>

      <MobilePanel id="mobile-nav" $open={mobileOpen}>
        <MobileGroupLabel>{teamsDropdown.label}</MobileGroupLabel>
        {teamsDropdown.items.map((item) => (
          <MobileSubLink
            key={item.path}
            to={item.path}
            $active={isActive(item.path)}
          >
            {item.label}
          </MobileSubLink>
        ))}
        {navLinks.map((link) => (
          <MobileLink key={link.path} to={link.path} $active={isActive(link.path)}>
            {link.label}
          </MobileLink>
        ))}
        <MobileLink to="/contact" $active={isActive('/contact')}>
          Contact
        </MobileLink>
      </MobilePanel>
    </>
  );
}
