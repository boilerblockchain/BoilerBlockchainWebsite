import React, { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { useEffect, useState, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { loadPolygonPath } from "@tsparticles/path-polygon";
import { useMemo } from "react";
import Loading from '../Loading';
import Carousel from '../Carousel';

const CoverVideo = lazy(() => import('../CoverVideo'));
const TypeWriterText = lazy(() => import('../TypeWriterText'));

const Section = styled.section`
min-height: ${props => `calc(100vh - ${props.theme.navHeight})`   };
width: 100vw;
position: relative;
background-color: ${props => props.theme.body};
`

const Container = styled.div`
width: 75%;
min-height: 80vh;
margin: 0 auto;
/* background-color: lightblue; */

display: flex;
justify-content: center;
align-items: center;

@media (max-width: 64em) {
  width: 85%;
}
@media (max-width: 48em) {
  flex-direction: column;
  width: 100%;
  &>*:first-child{
    width: 100%;
    margin-top: 2rem;
  }
}
`
const BoxLeft = styled.div`
width: 40%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const BoxRight = styled.div`
width: 60%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [sectionPosition, setSectionPosition] = useState("100vh");

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine); // Load tsparticles engine
    await loadPolygonPath(engine); // Load the polygon path generator
  }, []);

  const handleScroll = () => {
    const y = window.scrollY;
    setScrollY(y);

    if (y > 400) {
      setIsPastThreshold(true);
      const newPosition = `${Math.max(100 - (y - 400) / 2, 0)}vh`;
      setSectionPosition(newPosition);
    } else {
      setIsPastThreshold(false);
      setSectionPosition("100vh");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <Section id="home">
      <div style={{ position: "relative", minHeight: "200vh", width: "100vw" }}>
        {useMemo(() => (
          <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
        ), [particlesInit])}

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

        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            zIndex: 2,
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(4rem, 10vw, 8rem)",
              textAlign: "center",
              lineHeight: "1.2",
              marginBottom: "2rem",
            }}
          >
            This is Boiler <br />
            BlockChain
          </h1>

          <button
            onClick={handleScrollToNext}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "1rem",
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

        <style jsx>{`
          .arrow-svg {
            stroke: white;
            stroke-width: 2;
            fill: none;
            transition: stroke 0.3s ease, transform 0.3s ease;
          }
          button:hover .arrow-svg {
            stroke: url(#grad1);
            transform: scale(1.2);
          }
          @keyframes bounce {
            0%, 100% {
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

        <svg width="0" height="0">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#7120b0", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#9d20b0", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* <div
        style={{
          position: "fixed",
          top: sectionPosition,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#333",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          transition: "top 0.5s ease-out",
        }}
      >
      </div>

      <div
        style={{
          position: "fixed",
          top: "200vh",
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#555",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          transition: "top 0.5s ease-out",
        }}
      >
      </div> */}
    </Section>
  )
}

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
      speed: 3,
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
    rate: { quantity: 20, delay: 0.25 },
    position: { x: 50, y: 50 },
  },
  motion: { disable: false, reduce: { factor: 10, value: true } },
};

export default Home