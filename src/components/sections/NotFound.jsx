import React, { useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled(motion.div)`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 1024px) {
    width: 90%;
    padding: 1.75rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }

  @media (max-width: 360px) {
    padding: 0.75rem;
  }
`;

const ErrorCode = styled(motion.h1)`
  font-size: 12rem;
  color: transparent;
  background: linear-gradient(135deg, #7120b0 0%, #9d20b0 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 0 60px rgba(113, 32, 176, 0.5);
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 1024px) {
    font-size: 10rem;
  }

  @media (max-width: 768px) {
    font-size: 8rem;
  }

  @media (max-width: 480px) {
    font-size: 6rem;
  }

  @media (max-width: 360px) {
    font-size: 5rem;
  }
`;

const Title = styled(motion.h2)`
  font-size: 3rem;
  color: #ffffff;
  margin: 1rem 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  @media (max-width: 360px) {
    font-size: 1.25rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 1rem 0 2.5rem;
  max-width: 600px;
  line-height: 1.6;
  font-family: 'Lato', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 1rem 0 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 0.75rem 0 1.5rem;
  }

  @media (max-width: 360px) {
    font-size: 0.9rem;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
`;

const HomeButton = styled(Link)`
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #7120b0 0%, #9d20b0 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(113, 32, 176, 0.4);
  border: 2px solid transparent;

  &:hover {
    background: linear-gradient(135deg, #9d20b0 0%, #a855f7 100%);
    box-shadow: 0 6px 25px rgba(113, 32, 176, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.875rem 2rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const BackButton = styled(Link)`
  padding: 1rem 2.5rem;
  background: transparent;
  color: #ffffff;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: 2px solid rgba(113, 32, 176, 0.8);

  &:hover {
    background: rgba(113, 32, 176, 0.2);
    border-color: #9d20b0;
    box-shadow: 0 4px 15px rgba(113, 32, 176, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.875rem 2rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const GlitchText = styled(motion.div)`
  position: relative;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Tomorrow', sans-serif;
  margin-top: 3rem;
  letter-spacing: 3px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    letter-spacing: 2px;
  }
`;

const NotFound = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    fullScreen: { enable: false },
    background: {
      color: {
        value: "#000000",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 150,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: ["#7120b0", "#9d20b0", "#a855f7"],
      },
      links: {
        color: "#7120b0",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 60,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 4 },
      },
    },
    detectRetina: true,
  };

  return (
    <PageSection>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      <Container
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        <ErrorCode
          variants={fadeInUp}
        >
          404
        </ErrorCode>
        <Title
          variants={fadeInUp}
        >
          Page Not Found
        </Title>
        <Description
          variants={fadeInUp}
        >
          Oops! It seems like you've ventured into uncharted blockchain territory. 
          The page you're looking for doesn't exist or has been moved.
        </Description>
        <ButtonContainer
          variants={fadeInUp}
        >
          <HomeButton to="/">
            Return Home
          </HomeButton>
          <BackButton onClick={() => window.history.back()}>
            Go Back
          </BackButton>
        </ButtonContainer>
        <GlitchText
          variants={fadeInUp}
        >
          // ERROR: PAGE_NOT_FOUND
        </GlitchText>
      </Container>
    </PageSection>
  );
};

export default NotFound;
