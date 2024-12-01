import React, { useCallback } from "react";
import styled from "styled-components";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { loadPolygonPath } from "@tsparticles/path-polygon";
import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import "../../index.css";

/* TODO:
- Change font of "This is Boiler Blockchain"
- Switch to a simpler home page layout with lesser movement/chaos
  - start particles with somewhere on the right and decrease opacity as the approach left/as they move
  - hero section on the leftz`
  - bolder font
  - "This is" much smaller above "Boiler Blockchain"
  - "Blockchain" purple text
- change the transition of hero from zoom in to just regular scroll
- change nav bar, make it sleeker + effects
- Welcome to Boiler BC section:
  - Make the carousel cooler: vertical auto-scrolling
  - Change text
  - Add icons (Hackathon, research projects, technical courses)
- Hackathon Highlights:
  - left: text about hackathon highlights
  - right: prizes won (animate number)
  - bottom strip: auto-scrolling list of hackathons where we've participated
- Courses:
  - left: number of students taught
  - right: little about the course
- Footer:
  - links to discord, twitter, instagram 
- logos
- fix routes and links of Learn More buttons
- fix herobutton
- replace button with chevron-down
DONE^
- add the purple subtopic above topics in each section (look at courses.js)
- replace credits statistic with something
*/


const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Home = ({ onScrollToNext }) => {

  // Initialize particles
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
    await loadPolygonPath(engine);
  }, []);

  return (
    <Section id="home">
      <div style={{ position: "relative", height: "100vh", width: "100vw", background: "rgba(0, 0, 0, 0.3)"}}>
        {useMemo(
          () => (
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={particlesOptions}
            />
          ),
          [particlesInit],
        )}

        {/* Main content container */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            zIndex: 2,
          }}
        >
          <h1 className='text-4xl font-display text-center text-zinc-200 animate-fade-in mt-12'
          >
            This is
          </h1>
          <h1 className='text-white text-8xl font-display mt-6 mb-32 animate-fade-in'>
            BOILER <span className='text-purple-700'> BLOCKCHAIN </span>
          </h1>
          {/* Downward Arrow Button for Scroll */}
          <a href="#about">
            <ChevronDown className="text-zinc-600 hover:text-zinc-200 hover:scale-110 duration-300" size={40} />
          </a>
        </div>

        {/* Inline styles for SVG and animations */}
        <style jsx>{`
          .arrow-svg {
            stroke: white;
            stroke-width: 2;
            fill: none;
            transition:
              stroke 0.3s ease,
              transform 0.3s ease;
          }
          button:hover .arrow-svg {
            stroke: url(#grad1);
            transform: scale(1.2);
          }
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          button {
            animation: bounce 2s infinite;
          }
        `}</style>

        {/* SVG for gradient stroke */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#7120b0", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#9d20b0", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Section>
  );
};

// Particle configuration
const particlesOptions = {
  autoPlay: true,
  background: {
    color: { value: "#000" },
    opacity: 1,
  },
  fullScreen: {
    enable: true,
    zIndex: -1,
  },
  detectRetina: true,
  fpsLimit: 120,
  interactivity: {
    detectsOn: "window",
    events: {
      onClick: { enable: false },
      onHover: { enable: true, mode: "trail" },
      resize: { enable: true, delay: 0.5 },
    },
    modes: {
      trail: { delay: 1, pauseOnStop: false, quantity: 1 },
    },
  },
  particles: {
    color: {
      value: ["#7120b0", "#9d20b0"],
    },
    move: {
      enable: true,
      speed: 2,
      path: {
        enable: true,
        options: {
          sides: 6,
          turnSteps: 50,
          angle: 0,
        },
        generator: "polygonPathGenerator",
      },
      trail: {
        enable: true,
        length: 20,
        fill: { color: { value: "#000" } },
      },
      outModes: { default: "destroy" },
    },
    size: {
      value: 2,
    },
    shape: {
      type: "circle",
    },
  },
  emitters: {
    autoPlay: true,
    rate: { quantity: 15, delay: 0.25},
    position: { x: 50, y: 50 },
  },
  motion: { disable: false, reduce: { factor: 10, value: true } },
};

export default Home;
