import React, { useState } from "react";
import styled from "styled-components";
import Logo from "./Logo";

const Section = styled.section`
  width: 100vw;
  background-color: ${(props) => props.theme.body};
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: ${(props) => props.theme.navHeight};
  margin: 0;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);

  .mobile {
    display: none;
  }

  @media (max-width: 64em) {
    .desktop {
      display: none;
    }
    .mobile {
      display: inline-block;
    }
  }
`;

const Menu = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin-right: 2rem;
  padding: 0;
  
  @media (max-width: 64em) {
    position: fixed;
    top: ${(props) => props.theme.navHeight};
    left: 0;
    right: 0;
    width: 100vw;
    height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
    z-index: 50;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(2px);

    transform: ${(props) => (props.click ? "translateY(0)" : "translateY(100%)")};
    transition: transform 0.3s ease;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
`;

const MenuItem = styled.li`
  margin: 1rem;
  color: ${(props) => props.theme.textWhite};
  cursor: pointer;
  font-size: 1.2rem;

  &::after {
    content: " ";
    display: block;
    width: 0%;
    height: 2px;
    background: ${(props) => props.theme.textWhite};
    transition: width 0.3s ease;
  }
  &:hover::after {
    width: 100%;
  }

  @media (max-width: 64em) {
    margin: 1rem 0;
    &::after {
      display: none;
    }
  }
`;

const HamburgerMenu = styled.div`
  width: 2rem;
  height: 1.5rem;
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 100;
  margin-right: 2rem;
  margin-top: 2rem;
  
  @media (min-width: 64em) {
    display: none;
  }

  div {
    width: 2rem;
    height: 2px;
    background: ${(props) => props.theme.textWhite};
    transition: all 0.3s ease;

    &:nth-child(1) {
      transform: ${(props) => (props.click ? "rotate(45deg) translateY(7px)" : "rotate(0)")};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.click ? "0" : "1")}; /* Hide the middle line when clicked */
    }

    &:nth-child(3) {
      transform: ${(props) => (props.click ? "rotate(-45deg) translateY(-7px)" : "rotate(0)")};
    }
  }
`;


const Navigation = () => {
  const [click, setClick] = useState(false);

  const customScroll = (id, duration) => {
    const element = document.getElementById(id);
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animateScroll);
    };

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollTo = (id) => {
    customScroll(id, 1500);
    setClick(!click);
  };

  return (
    <Section id="navigation">
      <NavBar>
        <Logo />
        <HamburgerMenu click={click} onClick={() => setClick(!click)}>
          <div />
          <div />
          <div />
        </HamburgerMenu>
        <Menu click={click}>
          <MenuItem onClick={() => scrollTo("home")}>Home</MenuItem>
          <MenuItem onClick={() => scrollTo("about")}>About</MenuItem>
          <MenuItem onClick={() => scrollTo("hackathons")}>Hackathons</MenuItem>
          <MenuItem onClick={() => scrollTo("showcase")}>Research</MenuItem>
          <MenuItem onClick={() => scrollTo("team")}>Courses</MenuItem>
        </Menu>
      </NavBar>
    </Section>
  );
};

export default Navigation;
