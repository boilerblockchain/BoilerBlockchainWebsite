import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiCode, FiUsers, FiAward, FiBook, FiZap, FiTrendingUp, FiGithub, FiTarget, FiSearch, FiSettings } from 'react-icons/fi';

// Education block images
import educationImage1 from '../../assets/images/education/edu1.jpg';
import educationImage2 from '../../assets/images/education/edu2.jpg';
import educationImage3 from '../../assets/images/education/edu3.jpg';

// Development block images
import developmentImage1 from '../../assets/images/development/dev1.jpg';
import developmentImage2 from '../../assets/images/development/dev2.JPEG';
import developmentImage3 from '../../assets/images/development/dev3.JPEG';

// Research block images
import researchImage1 from '../../assets/images/research/res1.jpg';
import researchImage2 from '../../assets/images/research/res2.jpg';
import researchImage3 from '../../assets/images/research/res3.jpg';

// Operations block images
import operationsImage1 from '../../assets/images/operations/op1.png';
import operationsImage2 from '../../assets/images/operations/op2.jpg';
import operationsImage3 from '../../assets/images/operations/op3.jpeg';

// Fallback placeholder if group image doesn't exist
const placeholderImage = 'https://via.placeholder.com/1200x800/7120b0/ffffff?text=Group+Photo';

const PageContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  background: #000000;
  color: #ffffff;
  position: relative;
`;

const HeroSection = styled.section`
  min-height: calc(100vh - 80px);
  width: 100%;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 120px 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 110px 1.75rem 3.5rem;
  }

  @media (max-width: 768px) {
    padding: 100px 1.5rem 3rem;
    min-height: calc(100vh - 60px);
  }

  @media (max-width: 480px) {
    padding: 80px 1rem 2rem;
    min-height: auto;
  }

  @media (max-width: 360px) {
    padding: 70px 0.75rem 1.5rem;
  }
`;

const ParticlesContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const HeroContent = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 360px) {
    padding: 0 0.25rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    letter-spacing: 2px;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    letter-spacing: 1px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 5.5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: -1px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  .gradient-text {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
  }

  @media (max-width: 1024px) {
    font-size: 4.5rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
    letter-spacing: 0;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.25rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
`;

const HeroDescription = styled(motion.p)`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0 auto 2rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0 auto 1.5rem;
    padding: 0 0.5rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.75rem;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    gap: 0.375rem;
  }

  &.primary {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    color: #ffffff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(113, 32, 176, 0.4);
    }
  }

  &.secondary {
    background: transparent;
    color: #7120b0;
    border: 2px solid #7120b0;

    &:hover {
      background: rgba(113, 32, 176, 0.1);
    }
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 100vw;
  padding: 6rem 2rem;
  background: transparent;
  position: relative;
  z-index: 1;
  z-index: 1;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 5rem 1.75rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }

  @media (max-width: 360px) {
    padding: 2.5rem 0.75rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  .gradient-text {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    letter-spacing: 0;
  }

  @media (max-width: 360px) {
    font-size: 1.5rem;
  }
`;

const SectionDescription = styled(motion.p)`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 3rem;
  text-align: center;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 auto 2rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    line-height: 1.5;
    margin: 0 auto 1.5rem;
    padding: 0 0.5rem;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 360px) {
    gap: 0.75rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(113, 32, 176, 0.3);
    background: rgba(15, 15, 15, 0.85);

    &::before {
      opacity: 1;
    }
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(113, 32, 176, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    color: #7120b0;
    font-size: 24px;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    margin-bottom: 1.25rem;

    svg {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    margin-bottom: 1rem;

    svg {
      font-size: 20px;
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: 0.3px;
  line-height: 1.3;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }
`;

const CardText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  letter-spacing: 0.2px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(113, 32, 176, 0.3);
    background: rgba(15, 15, 15, 0.85);

    &::before {
      opacity: 1;
    }
  }
`;

const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: #7120b0;
  margin-bottom: 0.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

const StatCardText = styled(CardText)`
  margin-top: 1rem;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const TextContent = styled.div`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;

  p {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;

    p {
      margin-bottom: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    line-height: 1.5;

    p {
      margin-bottom: 1rem;
    }
  }
`;

// Glitch animation keyframes
const glitchTop = `
  @keyframes glitchTop {
    0% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      transform: translateX(0);
    }
    20% {
      clip-path: polygon(0 0, 100% 0, 100% 95%, 0 98%);
      transform: translateX(-2px);
    }
    40% {
      clip-path: polygon(0 0, 100% 0, 100% 98%, 0 95%);
      transform: translateX(2px);
    }
    60% {
      clip-path: polygon(0 0, 100% 0, 100% 96%, 0 97%);
      transform: translateX(-1px);
    }
    80% {
      clip-path: polygon(0 0, 100% 0, 100% 97%, 0 96%);
      transform: translateX(1px);
    }
    100% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      transform: translateX(0);
    }
  }
`;

const glitchBottom = `
  @keyframes glitchBottom {
    0% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      transform: translateX(0);
    }
    20% {
      clip-path: polygon(0 5%, 100% 2%, 100% 100%, 0 100%);
      transform: translateX(2px);
    }
    40% {
      clip-path: polygon(0 2%, 100% 5%, 100% 100%, 0 100%);
      transform: translateX(-2px);
    }
    60% {
      clip-path: polygon(0 4%, 100% 3%, 100% 100%, 0 100%);
      transform: translateX(1px);
    }
    80% {
      clip-path: polygon(0 3%, 100% 4%, 100% 100%, 0 100%);
      transform: translateX(-1px);
    }
    100% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      transform: translateX(0);
    }
  }
`;

const scanlineAnimation = `
  @keyframes scanline {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`;

const IdentitySection = styled(motion.section)`
  width: 100%;
  max-width: 100vw;
  padding: 120px 2rem;
  background: transparent;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;

  ${glitchTop}
  ${glitchBottom}
  ${scanlineAnimation}

  @media (max-width: 1024px) {
    padding: 100px 1.75rem;
  }

  @media (max-width: 768px) {
    padding: 80px 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 60px 1rem;
  }

  @media (max-width: 360px) {
    padding: 50px 0.75rem;
  }
`;

const TopGlitchEdge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.98) 0%,
    rgba(0, 0, 0, 0.90) 20%,
    rgba(0, 0, 0, 0.75) 50%,
    rgba(0, 0, 0, 0.5) 80%,
    transparent 100%
  );
  animation: glitchTop 6s ease-in-out infinite;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(168, 85, 247, 0.8),
      rgba(113, 32, 176, 1),
      rgba(168, 85, 247, 0.8),
      transparent
    );
    animation: scanline 2.5s linear infinite;
    box-shadow: 
      0 0 15px rgba(168, 85, 247, 0.6),
      0 0 30px rgba(168, 85, 247, 0.3);
    filter: blur(0.5px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(168, 85, 247, 0.08) 1px,
      rgba(168, 85, 247, 0.08) 2px,
      transparent 2px,
      transparent 3px,
      rgba(113, 32, 176, 0.05) 3px,
      rgba(113, 32, 176, 0.05) 4px
    );
    animation: glitchTop 6s ease-in-out infinite;
    mix-blend-mode: screen;
    opacity: 0.7;
  }
`;

const BottomGlitchEdge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.98) 0%,
    rgba(0, 0, 0, 0.90) 20%,
    rgba(0, 0, 0, 0.75) 50%,
    rgba(0, 0, 0, 0.5) 80%,
    transparent 100%
  );
  animation: glitchBottom 6s ease-in-out infinite;
  animation-delay: 0.5s;
  overflow: hidden;
  mask-image: linear-gradient(to top, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, black 0%, transparent 100%);

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(168, 85, 247, 0.8),
      rgba(113, 32, 176, 1),
      rgba(168, 85, 247, 0.8),
      transparent
    );
    animation: scanline 2.5s linear infinite reverse;
    animation-delay: 1s;
    box-shadow: 
      0 0 15px rgba(168, 85, 247, 0.6),
      0 0 30px rgba(168, 85, 247, 0.3);
    filter: blur(0.5px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: repeating-linear-gradient(
      180deg,
      transparent,
      transparent 1px,
      rgba(168, 85, 247, 0.08) 1px,
      rgba(168, 85, 247, 0.08) 2px,
      transparent 2px,
      transparent 3px,
      rgba(113, 32, 176, 0.05) 3px,
      rgba(113, 32, 176, 0.05) 4px
    );
    animation: glitchBottom 6s ease-in-out infinite;
    animation-delay: 0.5s;
    mix-blend-mode: screen;
    opacity: 0.7;
  }
`;

const GlitchScanlines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(168, 85, 247, 0.04) 1px,
    rgba(168, 85, 247, 0.04) 2px,
    transparent 2px,
    transparent 3px,
    rgba(113, 32, 176, 0.02) 3px,
    rgba(113, 32, 176, 0.02) 4px
  );
  mix-blend-mode: overlay;
  opacity: 0.6;
  animation: glitchTop 10s ease-in-out infinite;
`;

const GlitchDistortion = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  pointer-events: none;
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 50px,
      rgba(168, 85, 247, 0.03) 50px,
      rgba(168, 85, 247, 0.03) 51px,
      transparent 51px,
      transparent 100px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 30px,
      rgba(113, 32, 176, 0.02) 30px,
      rgba(113, 32, 176, 0.02) 31px,
      transparent 31px,
      transparent 60px
    );
  animation: glitchTop 8s ease-in-out infinite;
  mix-blend-mode: screen;
  opacity: 0.4;
  filter: blur(0.5px);
`;

const IdentityContainer = styled(motion.div)`
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 30;
  text-align: center;
`;

const BackgroundImageContainer = styled(motion.div)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 25%;
    filter: brightness(0.75) contrast(1.05) saturate(0.9);
  }
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.80) 0%,
    rgba(0, 0, 0, 0.55) 50%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  z-index: 10;
`;

const PurpleGlowOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 50% 30%,
    rgba(168, 85, 247, 0.18) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 20;
`;

const GlassPanel = styled(motion.div)`
  position: relative;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.20);
  border-radius: 24px;
  padding: 56px;
  z-index: 30;

  @media (max-width: 1024px) {
    padding: 48px;
  }

  @media (max-width: 768px) {
    padding: 32px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 16px;
  }
`;

const IdentityDivider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(113, 32, 176, 0.2), transparent);
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 2.5rem;
  }
`;

const IdentityTitle = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 2.5rem;
  letter-spacing: -1px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 1024px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    letter-spacing: -0.5px;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    letter-spacing: 0;
  }

  @media (max-width: 360px) {
    font-size: 1.75rem;
  }
`;

const IdentityBody = styled(motion.p)`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  max-width: 900px;
  margin: 0 auto 2.5rem;
  font-weight: 400;
  letter-spacing: 0.2px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const IdentityMicroLine = styled(motion.p)`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const WhatWeDoSection = styled.section`
  width: 100%;
  max-width: 100vw;
  padding: 100px 2rem 120px;
  background: transparent;
  position: relative;
  z-index: 1;
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;

  /* Blueprint grid background - very faint */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        to right,
        rgba(168, 85, 247, 0.05) 0,
        rgba(168, 85, 247, 0.05) 1px,
        transparent 1px,
        transparent 120px
      ),
      repeating-linear-gradient(
        to bottom,
        rgba(168, 85, 247, 0.05) 0,
        rgba(168, 85, 247, 0.05) 1px,
        transparent 1px,
        transparent 120px
      );
    opacity: 0.4;
    pointer-events: none;
    z-index: 0;
    mask-image: radial-gradient(ellipse 80% 60% at center, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at center, black 30%, transparent 100%);
  }

  @media (max-width: 768px) {
    padding: 80px 1.5rem 100px;
  }

  @media (max-width: 480px) {
    padding: 60px 1rem 80px;
  }
`;

/* Floor line behind pillar bases */
const WhatWeDoFloorLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(168, 85, 247, 0.12);
  z-index: 1;
  pointer-events: none;
`;

const WhatWeDoDivider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.18), transparent);
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const WhatWeDoContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

/* Node graph SVG overlay */
const WhatWeDoNodeGraph = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.06;
  overflow: hidden;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const WhatWeDoHeader = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
    padding: 0 1.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 2.5rem;
    padding: 0 1rem;
  }
`;

const WhatWeDoTitle = styled(motion.h2)`
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.95) 50%, rgba(168, 85, 247, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: -2px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
  filter: drop-shadow(0 4px 20px rgba(168, 85, 247, 0.2));

  &::after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.6), rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.6), transparent);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  }

  @media (max-width: 1024px) {
    font-size: 3.75rem;
    letter-spacing: -1.5px;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 1rem;
    letter-spacing: -1px;

    &::after {
      width: 100px;
      height: 3px;
    }
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: 0.875rem;
    letter-spacing: -0.5px;

    &::after {
      width: 80px;
      height: 2px;
    }
  }
`;

const WhatWeDoSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 2rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.2px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  z-index: 2;
`;

const WhatWeDoNav = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-top: 1.25rem;
  }
`;

const WhatWeDoNavLink = styled.button`
  padding: 0.625rem 1.25rem;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    background: rgba(168, 85, 247, 0.2);
    border-color: rgba(168, 85, 247, 0.5);
    color: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.4375rem 0.875rem;
    font-size: 0.8125rem;
  }

  /* Accent color for key phrases */
  strong {
    color: rgba(168, 85, 247, 0.95);
    font-weight: 600;
  }

  @media (max-width: 1024px) {
    font-size: 1.375rem;
    max-width: 750px;
    margin-bottom: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    line-height: 1.55;
    margin-bottom: 3rem;
    padding: 0 1.5rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    line-height: 1.5;
    margin-bottom: 2.5rem;
    padding: 0 1rem;
  }
`;

/* Blockchain Chain Container - Vertical Stack */
const WhatWeDoBlockchainChain = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100%;
  padding: 3rem 0;

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

/* Block Row - Contains Block + Image */
const WhatWeDoBlockRow = styled(motion.div)`
  display: flex;
  flex-direction: ${props => props.reverse ? 'row-reverse' : 'row'};
  align-items: center;
  justify-content: center;
  gap: 4rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 4rem;
  position: relative;

  @media (max-width: 1200px) {
    gap: 3rem;
    padding: 2rem 3rem;
  }

  @media (max-width: 968px) {
    gap: 2rem;
    padding: 2rem 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 1.5rem;
  }
`;

/* Image Carousel Container */
const WhatWeDoBlockImage = styled(motion.div)`
  flex: 1;
  max-width: 480px;
  height: 380px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.15);

  @media (max-width: 968px) {
    max-width: 420px;
    height: 340px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const CarouselImages = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.active ? 1 : 0};
  transform: ${props => props.active ? 'scale(1)' : 'scale(1.1)'};
  transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), 
              transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
`;

const CarouselOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
  z-index: 2;
`;

const CarouselControls = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(168, 85, 247, 0.2);
`;

const CarouselButton = styled.button`
  background: ${props => props.active ? 'rgba(168, 85, 247, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  border: none;
  width: ${props => props.active ? '10px' : '8px'};
  height: ${props => props.active ? '10px' : '8px'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
  box-shadow: ${props => props.active ? '0 0 8px rgba(168, 85, 247, 0.6)' : 'none'};

  &:hover {
    background: ${props => props.active ? 'rgba(168, 85, 247, 1)' : 'rgba(255, 255, 255, 0.5)'};
    transform: scale(1.2);
    box-shadow: ${props => props.active ? '0 0 12px rgba(168, 85, 247, 0.8)' : '0 0 6px rgba(255, 255, 255, 0.3)'};
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 480px) {
    width: ${props => props.active ? '9px' : '7px'};
    height: ${props => props.active ? '9px' : '7px'};
  }
`;

const CarouselNavButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: rgba(168, 85, 247, 0.9);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
  font-size: 1.25rem;

  &:hover {
    background: rgba(168, 85, 247, 0.2);
    border-color: rgba(168, 85, 247, 0.5);
    color: rgba(168, 85, 247, 1);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    ${props => props.direction === 'prev' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  }
`;

/* Blockchain Block */
const WhatWeDoBlock = styled(motion.div)`
  position: relative;
  background: 
    linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.85) 50%,
      rgba(0, 0, 0, 0.95) 100%
    ),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
  flex: 1;
  max-width: 560px;
  min-height: 380px;
  height: 100%;
  padding: 2.5rem 2.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 16px;
  box-shadow: 
    /* Top bevel lighting */
    inset 0 1px 2px rgba(255, 255, 255, 0.08),
    /* Left-edge rim light */
    inset 1px 0 8px rgba(168, 85, 247, 0.15),
    /* Inner glow */
    0 0 0 1px rgba(168, 85, 247, 0.1) inset,
    0 0 20px rgba(168, 85, 247, 0.08) inset,
    /* Increased shadow depth */
    0 12px 48px rgba(0, 0, 0, 0.8),
    0 6px 24px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(168, 85, 247, 0.15);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  overflow: hidden;
  flex: 1;
  transform-style: preserve-3d;
  perspective: 1000px;
  
  /* Gradient overlay for depth */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.1) 0%,
      transparent 50%,
      rgba(168, 85, 247, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.6s ease;
    border-radius: 16px;
    z-index: 1;
    pointer-events: none;
  }

  /* Animated background pattern - more visible */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(
        circle at 30% 30%,
        rgba(168, 85, 247, 0.12) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 70%,
        rgba(168, 85, 247, 0.08) 0%,
        transparent 50%
      );
    animation: rotatePattern 20s linear infinite, floatPattern 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
    border-radius: 16px;
  }

  @keyframes rotatePattern {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes floatPattern {
    0%, 100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-15px) translateX(10px);
    }
  }

  /* Floating particles effect */
  & > div:nth-of-type(2) {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 2;
    overflow: hidden;
    border-radius: 16px;
  }

  /* Purple edge lighting - animated rim light */
  & > div:first-of-type {
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.3) 0%,
      rgba(168, 85, 247, 0.1) 50%,
      rgba(168, 85, 247, 0.3) 100%
    );
    opacity: 0;
    z-index: -1;
    filter: blur(8px);
    transition: opacity 0.6s ease;
    animation: rimGlow 3s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes rimGlow {
    0%, 100% {
      opacity: 0;
    }
    50% {
      opacity: 0.4;
    }
  }

  @media (max-width: 968px) {
    min-height: 360px;
    padding: 2.25rem 2rem;
    max-width: 520px;
  }

  @media (max-width: 768px) {
    min-height: 340px;
    padding: 2rem 1.75rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    min-height: 320px;
    padding: 1.75rem 1.5rem;
  }

  /* Interactive hover effects */
  &:hover {
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 
      inset 0 1px 2px rgba(255, 255, 255, 0.12),
      inset 1px 0 12px rgba(168, 85, 247, 0.3),
      0 0 0 1px rgba(168, 85, 247, 0.25) inset,
      0 0 50px rgba(168, 85, 247, 0.2) inset,
      0 24px 100px rgba(168, 85, 247, 0.25),
      0 12px 48px rgba(168, 85, 247, 0.15),
      0 8px 32px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(168, 85, 247, 0.4);
    transform: translateY(-8px) scale(1.03) rotateX(2deg);
    border-radius: 20px;

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 1;
      animation-duration: 12s, 4s;
    }

    & > div:first-of-type {
      opacity: 0.6;
      animation-duration: 1.5s;
    }
  }

  /* Active state for more interaction */
  &:active {
    transform: translateY(-4px) scale(1.01) rotateX(1deg);
  }
`;

/* Floating Particles Container */
const BlockParticles = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.4));
  border-radius: 50%;
  animation: float ${props => props.duration || 6}s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
  left: ${props => props.left || 20}%;
  top: ${props => props.top || 20}%;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
  transition: all 0.3s ease;

  ${WhatWeDoBlock}:hover & {
    width: 5px;
    height: 5px;
    box-shadow: 0 0 12px rgba(168, 85, 247, 0.7);
    animation-duration: ${props => (props.duration || 6) * 0.7}s;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0) scale(1);
      opacity: 0.5;
    }
    50% {
      transform: translateY(-40px) translateX(20px) scale(1.2);
      opacity: 0.9;
    }
  }
`;

/* Block Icon Container */
const WhatWeDoBlockIcon = styled(motion.div)`
  width: 68px;
  height: 68px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.12));
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 3;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
  flex-shrink: 0;

  svg {
    color: rgba(168, 85, 247, 0.95);
    font-size: 36px;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.4));
  }

  /* Animated gradient background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.3) 0%,
      transparent 50%,
      rgba(168, 85, 247, 0.2) 100%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    border-radius: 12px;
    z-index: -1;
    animation: iconShimmer 4s ease-in-out infinite;
  }

  @keyframes iconShimmer {
    0%, 100% {
      opacity: 0;
      transform: translateX(-100%);
    }
    50% {
      opacity: 0.4;
      transform: translateX(100%);
    }
  }

  /* Pulse glow */
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 12px;
    background: rgba(168, 85, 247, 0.2);
    opacity: 0;
    animation: iconPulse 3s ease-in-out infinite;
    z-index: -2;
    filter: blur(4px);
  }

  @keyframes iconPulse {
    0%, 100% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.1);
    }
  }

  ${WhatWeDoBlock}:hover & {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(168, 85, 247, 0.15));
    border-color: rgba(168, 85, 247, 0.45);
    box-shadow: 
      0 0 30px rgba(168, 85, 247, 0.3),
      inset 0 0 20px rgba(168, 85, 247, 0.1);
    transform: scale(1.05) rotate(5deg);

    svg {
      color: rgba(168, 85, 247, 1);
      transform: scale(1.15) rotate(-5deg);
      filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.5));
    }

    &::before {
      opacity: 0.6;
      animation-duration: 2s;
    }

    &::after {
      opacity: 0.6;
      animation-duration: 1.5s;
    }
  }

  @media (max-width: 968px) {
    width: 64px;
    height: 64px;
    margin-bottom: 1.125rem;

    svg {
      font-size: 32px;
    }
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;

    svg {
      font-size: 30px;
    }
  }

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    margin-bottom: 0.875rem;

    svg {
      font-size: 28px;
    }
  }
`;

/* Technical Block Label */
const WhatWeDoBlockLabel = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: rgba(168, 85, 247, 0.6);
  letter-spacing: 0.1em;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  text-transform: uppercase;
  z-index: 3;

  @media (max-width: 480px) {
    font-size: 0.5625rem;
    top: 0.875rem;
    right: 0.875rem;
  }
`;

/* Blockchain Hash Display */
const WhatWeDoBlockHash = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  font-size: 0.5rem;
  font-weight: 500;
  color: rgba(168, 85, 247, 0.4);
  letter-spacing: 0.05em;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  text-transform: uppercase;
  z-index: 3;
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(168, 85, 247, 0.15);

  @media (max-width: 480px) {
    font-size: 0.4375rem;
    bottom: 0.875rem;
    left: 0.875rem;
    right: 0.875rem;
  }
`;

const WhatWeDoBlockTitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 1.25rem 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
  flex-shrink: 0;

  ${WhatWeDoBlock}:hover & {
    color: rgba(255, 255, 255, 1);
  }

  @media (max-width: 968px) {
    font-size: 1.75rem;
    margin-bottom: 1.125rem;
  }

  @media (max-width: 768px) {
    font-size: 1.625rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.875rem;
  }
`;

const WhatWeDoBlockBody = styled.ul`
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
  padding: 0;
  list-style: none;
  letter-spacing: 0.01px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  justify-content: flex-start;

  @media (max-width: 968px) {
    font-size: 1rem;
    line-height: 1.65;
    gap: 0.8125rem;
    margin-bottom: 1.375rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    line-height: 1.6;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    line-height: 1.55;
    gap: 0.6875rem;
    margin-bottom: 1.125rem;
  }
`;

const WhatWeDoBlockBullet = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  padding-left: 0;
  font-weight: 500;

  &::before {
    content: '▸';
    color: rgba(168, 85, 247, 0.9);
    font-size: 1.125rem;
    line-height: 1.75;
    flex-shrink: 0;
    margin-top: 0.125rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    gap: 0.875rem;

    &::before {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    gap: 0.75rem;

    &::before {
      font-size: 0.9375rem;
    }
  }
`;

const WhatWeDoBlockCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  color: rgba(168, 85, 247, 0.95);
  font-size: 0.9375rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  z-index: 3;
  align-self: flex-start;
  padding: 0.75rem 1.375rem;
  margin-top: auto;
  border-radius: 10px;
  background: rgba(168, 85, 247, 0.1);
  border: 2px solid rgba(168, 85, 247, 0.25);
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  &:hover {
    color: rgba(168, 85, 247, 1);
    background: rgba(168, 85, 247, 0.1);
    border-color: rgba(168, 85, 247, 0.3);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);

    &::before {
      opacity: 1;
    }
  }

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.5;
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  ${WhatWeDoBlock}:hover & {
    svg {
      transform: translateX(6px) scale(1.15);
    }
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    padding: 0.75rem 1.25rem;
    gap: 0.625rem;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    gap: 0.5rem;
    padding: 0.625rem 1rem;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

/* Connecting Link Between Blocks - Vertical */
const WhatWeDoBlockConnector = styled(motion.div)`
  width: 3px;
  height: 60px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 1400px;

  /* Solid core line */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: rgba(168, 85, 247, 0.5);
    z-index: 2;
  }

  /* Blurred glow line beneath */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 100%;
    background: rgba(168, 85, 247, 0.4);
    filter: blur(3px);
    z-index: 1;
    opacity: 0.6;
  }

  /* Animated pulse */
  & > div {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 40%;
    background: rgba(168, 85, 247, 0.8);
    box-shadow: 0 0 12px rgba(168, 85, 247, 0.6);
    border-radius: 2px;
    opacity: 0;
    animation: pulseFlowVertical 6s infinite;
    animation-delay: var(--delay, 0s);
    z-index: 3;
  }

  @keyframes pulseFlowVertical {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(-100%);
    }
    15% {
      opacity: 1;
    }
    85% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(200%);
    }
  }

  @media (max-width: 768px) {
    height: 50px;
  }
`;

// CountUp Animation Component
const CountUp = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            setCount(Math.floor(progress * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration, hasAnimated]);

  return <span ref={countRef}>{prefix}{count}{suffix}</span>;
};

// Image Carousel Component
const ImageCarousel = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
    // Reset the auto-slide timer when manually changing images
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Restart auto-slide after manual change
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 4000);
  };

  useEffect(() => {
    // Start with the first image (index 0) - already set in useState
    // Start auto-sliding
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 4000); // Auto-slide every 4 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isPaused]);

  // Pause/resume auto-slide on hover
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
  }, [isPaused, images.length]);

  return (
    <>
      <CarouselImages
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {images.map((image, index) => (
          <CarouselImage
            key={index}
            src={image}
            alt={`${alt} ${index + 1}`}
            active={index === currentIndex}
          />
        ))}
        <CarouselOverlay />
        <CarouselNavButton direction="prev" onClick={prevImage}>
          ‹
        </CarouselNavButton>
        <CarouselNavButton direction="next" onClick={nextImage}>
          ›
        </CarouselNavButton>
      </CarouselImages>
      <CarouselControls>
        {images.map((_, index) => (
          <CarouselButton
            key={index}
            active={index === currentIndex}
            onClick={() => goToImage(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </CarouselControls>
    </>
  );
};

const Home = () => {
  const [particleKey, setParticleKey] = useState(Date.now());
  const identitySectionRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <PageContainer>
      {/* Particles Background - Full Page */}
      <ParticlesContainer>
        <Particles
          key={particleKey}
          init={particlesInit}
            options={{
              background: { color: "#000000" },
              particles: {
                color: { value: ["#7120b0", "#9d20b0"] },
                links: {
                  color: "#7120b0",
                  distance: 150,
                  enable: true,
                  opacity: 0.7,
                  width: 1.5,
                },
                move: { enable: true, speed: 0.8 },
                number: { value: 70 },
                size: { value: 3 },
                opacity: { value: 0.5 },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onHover: {
                    enable: true,
                    mode: "grab"
                  },
                },
                modes: {
                  grab: {
                    distance: 140,
                    links: { opacity: 0.6 }
                  }
                }
              }
            }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </ParticlesContainer>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Purdue University
          </HeroSubtitle>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Boiler <span className="gradient-text">Blockchain</span>
          </HeroTitle>
          <HeroDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            The next generation of blockchain engineers, researchers, and founders
          </HeroDescription>
          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button to="/about" className="primary">
              Learn More
            </Button>
            <Button to="/contact" className="secondary">
              Contact Us
            </Button>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      {/* Identity Section */}
      <IdentitySection ref={identitySectionRef}>
        {/* Top Glitch Edge */}
        <TopGlitchEdge />
        
        {/* Bottom Glitch Edge */}
        <BottomGlitchEdge />
        
        {/* Glitch Scanlines */}
        <GlitchScanlines />
        
        {/* Glitch Distortion */}
        <GlitchDistortion />

        {/* Background Image - Sharp, No Blur */}
        <BackgroundImageContainer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img 
            src="/images/club/BB_group_photo_solana_across_camp.jpg" 
            alt="Boiler Blockchain club members"
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              e.target.src = placeholderImage;
            }}
          />
        </BackgroundImageContainer>

        {/* Dark Overlay Gradient */}
        <DarkOverlay />

        {/* Purple Glow Overlay */}
        <PurpleGlowOverlay />

        {/* Glass Panel with Text */}
        <IdentityContainer
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <GlassPanel>
            <IdentityDivider />
            <IdentityTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              A New Standard for Web3 Talent
            </IdentityTitle>
            <IdentityBody
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Boiler Blockchain exists to do one thing exceptionally well: identify, cultivate, and launch the strongest Web3 talent at Purdue.
              <br /><br />
              We are not an internship pipeline. We are not a hackathon team. We are not a media organization.
              <br /><br />
              We are a training ground for builders, engineers, researchers, and founders.
            </IdentityBody>
            <IdentityMicroLine
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Talent first. Outcomes follow.
            </IdentityMicroLine>
          </GlassPanel>
        </IdentityContainer>
      </IdentitySection>

      {/* What We Do Section */}
      <WhatWeDoSection>
        <WhatWeDoFloorLine />
        <WhatWeDoNodeGraph>
          <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            {/* Node graph lines */}
            <line x1="200" y1="150" x2="400" y2="200" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="400" y1="200" x2="600" y2="180" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="600" y1="180" x2="800" y2="220" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="800" y1="220" x2="1000" y2="190" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
            <line x1="300" y1="300" x2="500" y2="350" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.5" />
            <line x1="700" y1="320" x2="900" y2="380" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.5" />
            {/* Nodes */}
            <circle cx="200" cy="150" r="3" fill="#A855F7" opacity="0.4" />
            <circle cx="400" cy="200" r="3" fill="#A855F7" opacity="0.4" />
            <circle cx="600" cy="180" r="3" fill="#A855F7" opacity="0.4" />
            <circle cx="800" cy="220" r="3" fill="#A855F7" opacity="0.4" />
            <circle cx="1000" cy="190" r="3" fill="#A855F7" opacity="0.4" />
            <circle cx="300" cy="300" r="2.5" fill="#A855F7" opacity="0.35" />
            <circle cx="500" cy="350" r="2.5" fill="#A855F7" opacity="0.35" />
            <circle cx="700" cy="320" r="2.5" fill="#A855F7" opacity="0.35" />
            <circle cx="900" cy="380" r="2.5" fill="#A855F7" opacity="0.35" />
          </svg>
        </WhatWeDoNodeGraph>
        <WhatWeDoContainer>
          <WhatWeDoDivider />
          <WhatWeDoHeader
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <WhatWeDoTitle
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What We Do
            </WhatWeDoTitle>
            <WhatWeDoSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <strong>Four pillars.</strong> One outcome: <strong>elite Web3 talent.</strong>
            </WhatWeDoSubtitle>
            <WhatWeDoNav
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <WhatWeDoNavLink
                onClick={() => {
                  const element = document.getElementById('block-education');
                  if (element) {
                    const offset = 80; // Offset to account for header/navigation
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                Education
              </WhatWeDoNavLink>
              <WhatWeDoNavLink
                onClick={() => {
                  const element = document.getElementById('block-development');
                  if (element) {
                    const offset = 80; // Offset to account for header/navigation
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                Development
              </WhatWeDoNavLink>
              <WhatWeDoNavLink
                onClick={() => {
                  const element = document.getElementById('block-research');
                  if (element) {
                    const offset = 80; // Offset to account for header/navigation
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                Research
              </WhatWeDoNavLink>
              <WhatWeDoNavLink
                onClick={() => {
                  const element = document.getElementById('block-operations');
                  if (element) {
                    const offset = 80; // Offset to account for header/navigation
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                Operations
              </WhatWeDoNavLink>
            </WhatWeDoNav>
          </WhatWeDoHeader>
          <WhatWeDoBlockchainChain>
            <WhatWeDoBlockRow
              id="block-education"
              reverse={false}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <WhatWeDoBlock
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div />
                <BlockParticles>
                  <Particle left="15%" top="25%" duration={6} delay={0} />
                  <Particle left="75%" top="60%" duration={8} delay={1} />
                  <Particle left="45%" top="80%" duration={7} delay={2} />
                  <Particle left="85%" top="30%" duration={9} delay={0.5} />
                </BlockParticles>
                <WhatWeDoBlockLabel>BLOCK #01</WhatWeDoBlockLabel>
                <WhatWeDoBlockIcon
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <FiBook />
                </WhatWeDoBlockIcon>
                <WhatWeDoBlockTitle>Education</WhatWeDoBlockTitle>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>12-week structured core course</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Student instructors & dedicated TAs</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Advanced technical workshops</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTA to="/courses">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </WhatWeDoBlockCTA>
                <WhatWeDoBlockHash>HASH: 0x4e64a1b2c3d4e5f6...</WhatWeDoBlockHash>
              </WhatWeDoBlock>
              <WhatWeDoBlockImage
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <ImageCarousel 
                  images={[educationImage1, educationImage2, educationImage3]} 
                  alt="Education" 
                />
              </WhatWeDoBlockImage>
            </WhatWeDoBlockRow>

            <WhatWeDoBlockConnector
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                '--delay': '0s'
              }}
            >
              <div />
            </WhatWeDoBlockConnector>

            <WhatWeDoBlockRow
              id="block-development"
              reverse={true}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <WhatWeDoBlock
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <div />
                <BlockParticles>
                  <Particle left="20%" top="30%" duration={7} delay={0.3} />
                  <Particle left="70%" top="55%" duration={6} delay={1.5} />
                  <Particle left="50%" top="75%" duration={8} delay={2.2} />
                  <Particle left="90%" top="25%" duration={9} delay={0.8} />
                </BlockParticles>
                <WhatWeDoBlockLabel>BLOCK #02</WhatWeDoBlockLabel>
                <WhatWeDoBlockIcon
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FiCode />
                </WhatWeDoBlockIcon>
                <WhatWeDoBlockTitle>Development</WhatWeDoBlockTitle>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>Hackathons & competitive builds</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Grants & protocol funding programs</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Bounties driving real product work</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTA to="/teams">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </WhatWeDoBlockCTA>
                <WhatWeDoBlockHash>HASH: 0x7f8a9b0c1d2e3f4a...</WhatWeDoBlockHash>
              </WhatWeDoBlock>
              <WhatWeDoBlockImage
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <ImageCarousel 
                  images={[developmentImage1, developmentImage2, developmentImage3]} 
                  alt="Development" 
                />
              </WhatWeDoBlockImage>
            </WhatWeDoBlockRow>

            <WhatWeDoBlockConnector
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                '--delay': '1.5s'
              }}
            >
              <div />
            </WhatWeDoBlockConnector>

            <WhatWeDoBlockRow
              id="block-research"
              reverse={false}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <WhatWeDoBlock
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <div />
                <BlockParticles>
                  <Particle left="25%" top="35%" duration={8} delay={0.6} />
                  <Particle left="65%" top="50%" duration={7} delay={2} />
                  <Particle left="40%" top="70%" duration={6} delay={1.2} />
                  <Particle left="80%" top="20%" duration={9} delay={1.5} />
                </BlockParticles>
                <WhatWeDoBlockLabel>BLOCK #03</WhatWeDoBlockLabel>
                <WhatWeDoBlockIcon
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <FiSearch />
                </WhatWeDoBlockIcon>
                <WhatWeDoBlockTitle>Research</WhatWeDoBlockTitle>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>Investment & protocol analysis</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Consulting & market research</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Formal due diligence reports</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTA to="/teams/research">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </WhatWeDoBlockCTA>
                <WhatWeDoBlockHash>HASH: 0x1a2b3c4d5e6f7a8b9...</WhatWeDoBlockHash>
              </WhatWeDoBlock>
              <WhatWeDoBlockImage
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <ImageCarousel 
                  images={[researchImage1, researchImage2, researchImage3]} 
                  alt="Research" 
                />
              </WhatWeDoBlockImage>
            </WhatWeDoBlockRow>

            <WhatWeDoBlockConnector
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                '--delay': '3s'
              }}
            >
              <div />
            </WhatWeDoBlockConnector>

            <WhatWeDoBlockRow
              id="block-operations"
              reverse={true}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <WhatWeDoBlock
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <div />
                <BlockParticles>
                  <Particle left="18%" top="28%" duration={7} delay={0.9} />
                  <Particle left="72%" top="58%" duration={8} delay={2.5} />
                  <Particle left="55%" top="78%" duration={6} delay={1.8} />
                  <Particle left="88%" top="35%" duration={9} delay={1.2} />
                </BlockParticles>
                <WhatWeDoBlockLabel>BLOCK #04</WhatWeDoBlockLabel>
                <WhatWeDoBlockIcon
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FiSettings />
                </WhatWeDoBlockIcon>
                <WhatWeDoBlockTitle>Operations</WhatWeDoBlockTitle>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>Partnerships & major events</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Logistics & funding systems</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Marketing & growth execution</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTA to="/teams/operations">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </WhatWeDoBlockCTA>
                <WhatWeDoBlockHash>HASH: 0x9c8d7e6f5a4b3c2d1...</WhatWeDoBlockHash>
              </WhatWeDoBlock>
              <WhatWeDoBlockImage
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <ImageCarousel 
                  images={[operationsImage1, operationsImage2, operationsImage3]} 
                  alt="Operations" 
                />
              </WhatWeDoBlockImage>
            </WhatWeDoBlockRow>
          </WhatWeDoBlockchainChain>
        </WhatWeDoContainer>
      </WhatWeDoSection>

      {/* CTA Section */}
      <Section style={{ background: '#0a0a0a' }}>
        <Container style={{ textAlign: 'center' }}>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join Our <span className="gradient-text">Community</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with 400+ fellow blockchain enthusiasts, get exclusive updates, and access specialized resources in our growing Discord community.
          </SectionDescription>
          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              as="a"
              href="https://discord.gg/hnjtVpb9H5"
              target="_blank"
              rel="noopener noreferrer"
              className="primary"
            >
              Join Discord
            </Button>
            <Button to="/contact" className="secondary">
              Contact Us
            </Button>
          </ButtonGroup>
        </Container>
      </Section>
    </PageContainer>
  );
};

export default Home;
