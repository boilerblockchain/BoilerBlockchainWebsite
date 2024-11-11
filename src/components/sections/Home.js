import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { loadPolygonPath } from "@tsparticles/path-polygon";
import { useMemo } from "react";
import "../../index.css";

const CoverVideo = lazy(() => import('../CoverVideo'));
const TypeWriterText = lazy(() => import('../TypeWriterText'));

/* TODO:
- Change font of "This is Boiler Blockchain"
- Switch to a simpler home page layout with lesser movement/chaos
  - start particles with somewhere on the right and decrease opacity as the approach left/as they move
  - hero section on the leftz`
  - bolder font
  - "This is" much smaller above "Boiler Blockchain"
  - "Blockchain" purple text
- change the transition of hero from zoom in to just regular scroll
- Welcome to Boiler BC section:
  - Make the carousel cooler: vertical auto-scrolling
  - Change text
  - Add icons
- Hackathon Highlights:
  - left: text about hackathon highlights
  - right: prizes won (animate number)
  - bottom strip: auto-scrolling list of hackathons where we've participated
- Courses:
  - left: number of students taught
  - right: little about the course
- links to discord, twitter, instagram 
*/


const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 75%;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 64em) {
    width: 85%;
  }
  @media (max-width: 48em) {
    flex-direction: column;
    width: 100%;
    & > *:first-child {
      width: 100%;
      margin-top: 2rem;
    }
  }
`;

const BoxLeft = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BoxRight = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Home = ({ onScrollToNext }) => {

  // Initialize particles
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
    await loadPolygonPath(engine);
  }, []);

  return (
    <Section id="home">
      <div style={{ position: "relative", minHeight: "200vh", width: "100vw" }}>
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

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          }}
        />

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
          <button
            onClick={onScrollToNext} // Function passed from parent to scroll to next section
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              className="arrow-svg"
            >
              <circle cx="12" cy="12" r="10" className="arrow-circle" />
              <path d="M12 8v8m0 0l-4-4m4 4l4-4" className="arrow-path" />
            </svg>
          </button>
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
