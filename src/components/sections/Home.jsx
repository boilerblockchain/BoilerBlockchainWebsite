import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiCode, FiUsers, FiAward, FiBook, FiZap, FiTrendingUp, FiGithub, FiTarget, FiSearch, FiSettings, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import Discord from '../../Icons/Discord';
import BBLogo from '../../assets/images/logos/Boiler_BLockchain_Logo_SVG.png';

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

// Club group photo
import clubGroupPhoto from '../../assets/images/club/BB_group_photo_solana_across_camp.jpg';

// Fallback placeholder if group image doesn't exist
const placeholderImage = 'https://via.placeholder.com/1200x800/7120b0/ffffff?text=Group+Photo';

const PageContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  background: #000000;
  color: #ffffff;
  position: relative;
  font-family: 'Tomorrow', sans-serif;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;

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

const DiscordButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
  color: #ffffff;
  font-family: 'Tomorrow', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(187, 32, 255, 0.5);
  box-shadow: 
    0 8px 32px rgba(113, 32, 176, 0.5),
    0 4px 16px rgba(187, 32, 255, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 0 40px rgba(113, 32, 176, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
    z-index: -1;
    opacity: 0;
    filter: blur(12px);
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    background: linear-gradient(135deg, #7a30c0 0%, #c430ff 100%);
    border-color: rgba(187, 32, 255, 0.8);
    box-shadow: 
      0 12px 48px rgba(113, 32, 176, 0.6),
      0 8px 24px rgba(187, 32, 255, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 0 60px rgba(113, 32, 176, 0.6);

    &::before {
      left: 100%;
    }

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px) scale(1);
  }

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1) rotate(5deg);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    gap: 0.625rem;
    letter-spacing: 0.6px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.75rem;
    font-size: 0.9375rem;
    gap: 0.5rem;
    letter-spacing: 0.5px;

    svg {
      width: 18px;
      height: 18px;
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
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;

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
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;
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
  font-family: 'Tomorrow', sans-serif;

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

const PinnedLogo = styled(motion.div)`
  position: absolute;
  top: -40px;
  right: 20px;
  width: 150px;
  height: 150px;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: none;
  z-index: 40;
  transform: rotate(5deg);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(1.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -12px;
    right: 50%;
    transform: translateX(50%);
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.6);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    z-index: -1;
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    top: -30px;
    right: 15px;
    padding: 0;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    top: -25px;
    right: 12px;
    padding: 0;
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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

// Stats Hero Section
// Keyframes for animations
const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const pulseOnce = keyframes`
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const gradientSweep = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const nodeDrift = keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, -8px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  75% {
    transform: translate(8px, 3px);
  }
`;

const lineDraw = keyframes`
  0% {
    stroke-dashoffset: 1000;
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

const particleFloat = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px) translateX(5px);
    opacity: 0.5;
  }
`;

const StatsHeroSection = styled(motion.section)`
  width: 100%;
  max-width: 100vw;
  padding: 100px 2rem 80px;
  background: #000000;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow-x: visible;
  overflow-y: visible;

  /* Subtle animated network field background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        to right,
        rgba(168, 85, 247, 0.02) 0,
        rgba(168, 85, 247, 0.02) 1px,
        transparent 1px,
        transparent 120px
      ),
      repeating-linear-gradient(
        to bottom,
        rgba(168, 85, 247, 0.02) 0,
        rgba(168, 85, 247, 0.02) 1px,
        transparent 1px,
        transparent 120px
      );
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
    animation: ${particleFloat} 25s ease-in-out infinite;
    mask-image: radial-gradient(ellipse 80% 60% at center, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at center, black 30%, transparent 100%);
  }

  @media (max-width: 768px) {
    padding: 80px 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 60px 1rem;
  }
`;

const NetworkField = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const NetworkNode = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(168, 85, 247, 0.4);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.3);
  animation: ${nodeDrift} ${props => props.duration || 20}s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
  left: ${props => props.left || '50%'};
  top: ${props => props.top || '50%'};
`;

const NetworkLine = styled.div`
  position: absolute;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 85, 247, 0.15) 50%,
    transparent 100%
  );
  left: ${props => props.left || '0%'};
  top: ${props => props.top || '50%'};
  width: ${props => props.width || '100px'};
  transform: rotate(${props => props.rotate || 0}deg);
  opacity: 0.3;
  animation: ${particleFloat} ${props => props.duration || 15}s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;

const StatsHeroDivider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 85, 247, 0.2) 20%,
    rgba(168, 85, 247, 0.3) 50%,
    rgba(168, 85, 247, 0.2) 80%,
    transparent 100%
  );
  margin: 0;
  position: relative;
  z-index: 1;

  &.top {
    margin-bottom: 4rem;

    @media (max-width: 768px) {
      margin-bottom: 3rem;
    }

    @media (max-width: 480px) {
      margin-bottom: 2.5rem;
    }
  }

  &.bottom {
    margin-top: 2rem;

    @media (max-width: 768px) {
      margin-top: 1.5rem;
    }

    @media (max-width: 480px) {
      margin-top: 1.25rem;
    }
  }
`;

const StatsHeroContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  overflow-x: visible;
  overflow-y: visible;
`;

const StatsHeroHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3.5rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const StatsHeroEyebrow = styled.div`
  font-size: 1rem;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.9) 0%,
    rgba(168, 85, 247, 0.7) 50%,
    rgba(168, 85, 247, 0.9) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-family: 'Tomorrow', sans-serif;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(168, 85, 247, 0.6) 50%,
      transparent 100%
    );
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    letter-spacing: 0.2em;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    margin-bottom: 1rem;
  }
`;

const StatsHeroLedgerRow = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 3rem 0;
  gap: 0;
  overflow: visible;
  width: 100%;

  @media (max-width: 968px) {
    flex-wrap: wrap;
    gap: 2rem;
    padding: 2.5rem 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 2.5rem;
    padding: 2rem 0;
  }
`;

const ChainLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  top: 8px;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 85, 247, 0.15) 10%,
    rgba(168, 85, 247, 0.25) 25%,
    rgba(168, 85, 247, 0.3) 50%,
    rgba(168, 85, 247, 0.25) 75%,
    rgba(168, 85, 247, 0.15) 90%,
    transparent 100%
  );
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);

  @media (max-width: 480px) {
    width: 2px;
    height: 100%;
    left: 50%;
    top: 0;
    bottom: 0;
    transform: translateX(-50%);
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(168, 85, 247, 0.15) 10%,
      rgba(168, 85, 247, 0.25) 25%,
      rgba(168, 85, 247, 0.3) 50%,
      rgba(168, 85, 247, 0.25) 75%,
      rgba(168, 85, 247, 0.15) 90%,
      transparent 100%
    );
  }
`;

const StatConnectionLine = styled(motion.div)`
  flex: 1;
  min-width: 40px;
  max-width: 150px;
  height: 2px;
  position: relative;
  margin: 0 0.5rem;
  z-index: 1;
  overflow: hidden;
  align-self: flex-start;
  margin-top: 8px; /* Align with center of node dot (16px / 2 = 8px) */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20%;
    width: 140%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(168, 85, 247, 0.4) 20%,
      rgba(168, 85, 247, 0.6) 50%,
      rgba(168, 85, 247, 0.4) 80%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ${gradientSweep} 4s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -20%;
    width: 140%;
    height: 1px;
    background: rgba(168, 85, 247, 0.3);
    transform: translateY(-50%);
    box-shadow: 0 0 8px rgba(168, 85, 247, 0.2);
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const ChainLineSegment = styled.div`
  position: absolute;
  left: ${props => props.left || '0%'};
  width: ${props => props.width || '25%'};
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 85, 247, 0.4) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);

  ${StatsHeroLedgerRow}:hover & {
    opacity: 0;
  }

  ${StatsHeroLedgerRow} [data-node-index="${props => props['data-segment-index']}"]:hover ~ &,
  ${StatsHeroLedgerRow} [data-node-index="${props => props['data-segment-index']}"]:hover + ${StatConnectionLine} ~ & {
    opacity: 1;
  }

  @media (max-width: 480px) {
    top: ${props => props.top || '0%'};
    height: ${props => props.height || '25%'};
    width: 100%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(168, 85, 247, 0.4) 50%,
      transparent 100%
    );
  }
`;

const StatNodeWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1 1 auto;
  min-width: 250px;
  margin-top: 0;
  padding-top: 0;
  overflow: visible;
  flex-shrink: 0;

  &:hover [data-chain-segment] {
    opacity: 1 !important;
  }

  @media (max-width: 968px) {
    flex: 0 0 calc(50% - 1rem);
    min-width: 220px;
  }

  @media (max-width: 480px) {
    flex: 1 1 100%;
    width: 100%;
    min-width: 100%;
  }
`;

const StatNodeDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.9) 0%, rgba(168, 85, 247, 0.4) 100%);
  box-shadow: 
    0 0 20px rgba(168, 85, 247, 0.6),
    0 0 40px rgba(168, 85, 247, 0.3),
    inset 0 0 10px rgba(168, 85, 247, 0.5);
  position: relative;
  margin: 0 auto 1.5rem auto;
  flex-shrink: 0;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  z-index: 4;
  top: 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
    animation: ${pulseGlow} 3s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
    margin-bottom: 1.25rem;

    &::before {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 480px) {
    width: 12px;
    height: 12px;
    margin-bottom: 1rem;

    &::before {
      width: 18px;
      height: 18px;
    }
  }
`;

const StatNode = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 3;
  flex: 1 1 auto;
  min-width: 200px;
  padding: 0 2rem;
  transition: opacity 0.4s ease, filter 0.4s ease;
  cursor: default;
  text-align: center;
  width: 100%;
  margin-top: 0;
  overflow: visible;
  box-sizing: border-box;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
    filter: brightness(1.1);
    
    ${StatNodeDot} {
      animation: ${pulseOnce} 0.6s ease-out;
    }
  }

  ${StatsHeroLedgerRow}:hover &:not(:hover) {
    opacity: 0.6;
    filter: brightness(0.85);
  }

  @media (max-width: 968px) {
    flex: 0 0 calc(50% - 1rem);
    padding: 0 1.5rem;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    flex: 1 1 100%;
    padding: 0 1rem;
    width: 100%;
    min-width: 100%;
  }
`;

const StatsHeroStatValue = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(
    135deg,
    #7120b0 0%,
    #9d20b0 25%,
    #bb20ff 50%,
    #9d20b0 75%,
    #7120b0 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Tomorrow', sans-serif;
  letter-spacing: -0.02em;
  animation: ${shimmer} 8s ease-in-out infinite;
  text-align: center;
  width: 100%;
  margin-top: 0.5rem;
  overflow: visible;
  white-space: nowrap;
  word-break: keep-all;
  flex-shrink: 0;
  min-width: fit-content;

  @media (max-width: 968px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.75rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    white-space: normal;
  }
`;

const StatsHeroStatLabel = styled.div`
  font-size: 1.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  font-family: 'Tomorrow', sans-serif;
  margin-top: 1.25rem;
  text-align: center;
  line-height: 1.4;
  letter-spacing: -0.01em;
  max-width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  width: 100%;
  display: block;
  overflow: visible;
  box-sizing: border-box;

  @media (max-width: 968px) {
    font-size: 1.625rem;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.375rem;
    margin-top: 0.75rem;
  }
`;

const StatsHeroStatMicro = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  font-family: 'Tomorrow', sans-serif;
  line-height: 1.5;
  margin-top: 0.75rem;
  text-align: center;
  width: 100%;
  max-width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  display: block;
  overflow: visible;
  box-sizing: border-box;

  @media (max-width: 968px) {
    font-size: 1.0625rem;
    margin-top: 0.625rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    margin-top: 0.4375rem;
  }
`;

const CTADivider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 85, 247, 0.2) 20%,
    rgba(168, 85, 247, 0.4) 50%,
    rgba(168, 85, 247, 0.2) 80%,
    transparent 100%
  );
  margin: 0;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
`;

const CTASection = styled.section`
  width: 100%;
  max-width: 100vw;
  padding: 140px 2rem 60px;
  background: transparent;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-sizing: border-box;

  /* Dark background layer to separate from particles */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
    pointer-events: none;
    z-index: 0;
  }

  /* Enhanced purple glow background */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 100% 60% at 50% 50%,
      rgba(168, 85, 247, 0.15) 0%,
      rgba(168, 85, 247, 0.08) 30%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 1;
    animation: ${particleFloat} 20s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    padding: 100px 1.5rem 40px;
  }

  @media (max-width: 480px) {
    padding: 80px 1rem 30px;
  }
`;

const CTAContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }
`;

const CTAContent = styled(motion.div)`
  text-align: center;
  position: relative;
  z-index: 3;
  background: linear-gradient(
    135deg,
    rgba(25, 25, 35, 0.9) 0%,
    rgba(30, 30, 40, 0.95) 50%,
    rgba(25, 25, 35, 0.9) 100%
  );
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 32px;
  padding: 4rem 3rem;
  border: 1px solid rgba(168, 85, 247, 0.25);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 8px 32px rgba(168, 85, 247, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(168, 85, 247, 0.1);
  box-sizing: border-box;
  overflow: hidden;

  /* Additional inner glow */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.3) 0%,
      rgba(168, 85, 247, 0.1) 50%,
      rgba(168, 85, 247, 0.3) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: -1;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
    border-radius: 24px;

    &::before {
      border-radius: 24px;
    }
  }

  @media (max-width: 480px) {
    padding: 2rem 1.25rem;
    border-radius: 20px;

    &::before {
      border-radius: 20px;
    }
  }

  @media (max-width: 360px) {
    padding: 1.75rem 1rem;
    border-radius: 16px;

    &::before {
      border-radius: 16px;
    }
  }
`;

const CTATitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-family: 'Tomorrow', sans-serif;
  box-sizing: border-box;
  word-wrap: break-word;

  @media (max-width: 968px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.875rem;
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }

  @media (max-width: 360px) {
    font-size: 1.625rem;
  }
`;

const shimmerCTA = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const CTAGradient = styled.span`
  background: linear-gradient(
    135deg,
    #7120b0 0%,
    #9d20b0 25%,
    #bb20ff 50%,
    #9d20b0 75%,
    #7120b0 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmerCTA} 8s ease-in-out infinite;
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 3rem;
  font-family: 'Tomorrow', sans-serif;
  font-weight: 400;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    padding: 0;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.75rem;
    padding: 0;
  }

  @media (max-width: 360px) {
    font-size: 0.9375rem;
    margin-bottom: 1.5rem;
  }
`;

const CTAButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    gap: 0.875rem;
  }

  @media (max-width: 360px) {
    gap: 0.75rem;
  }
`;

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.125rem 2.5rem;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  white-space: nowrap;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.75rem;
    font-size: 1rem;
    width: 100%;
    justify-content: center;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
    gap: 0.5rem;
  }

  @media (max-width: 360px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }

  &.primary {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    color: #ffffff;
    box-shadow: 0 4px 20px rgba(113, 32, 176, 0.3);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(113, 32, 176, 0.5);

      &::before {
        left: 100%;
      }
    }
  }

  &.secondary {
    background: transparent;
    color: #ffffff;
    border: 2px solid rgba(168, 85, 247, 0.5);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(168, 85, 247, 0.15);
      border-color: rgba(168, 85, 247, 0.8);
      box-shadow: 0 4px 20px rgba(168, 85, 247, 0.2);
    }
  }
`;

const WhatWeDoSection = styled.section`
  width: 100%;
  max-width: 100vw;
  padding: 40px 2rem 120px;
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
    padding: 30px 1.5rem 100px;
  }

  @media (max-width: 480px) {
    padding: 20px 1rem 80px;
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
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-width: 1400px;
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
  background: linear-gradient(135deg, #a855f7 0%, #bb20ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: -2px;
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 60px rgba(168, 85, 247, 0.4);
  filter: drop-shadow(0 4px 20px rgba(168, 85, 247, 0.3)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.2));

  &::before {
    content: 'What We Do';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    z-index: -1;
    filter: blur(20px);
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.9), rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.4), transparent);
    border-radius: 2px;
    box-shadow: 
      0 0 20px rgba(168, 85, 247, 0.5),
      0 0 40px rgba(168, 85, 247, 0.3);
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
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 1rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.3px;
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  strong {
    color: rgba(168, 85, 247, 0.95);
    font-weight: 700;
    text-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  }
`;

const WhatWeDoNav = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-top: 3rem;
  position: relative;
  z-index: 2;
  padding: 2rem 0;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-top: 2rem;
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding: 1.25rem 0;
  }
`;

const WhatWeDoNavLink = styled.button`
  padding: 0.875rem 2rem;
  background: rgba(25, 25, 35, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(168, 85, 247, 0.4);
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 
    0 0 0 1px rgba(168, 85, 247, 0.2) inset,
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(168, 85, 247, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.15) 0%,
      rgba(168, 85, 247, 0.05) 50%,
      rgba(168, 85, 247, 0.15) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.6) 0%,
      rgba(168, 85, 247, 0.3) 50%,
      rgba(168, 85, 247, 0.6) 100%
    );
    opacity: 0;
    filter: blur(8px);
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    background: rgba(30, 30, 40, 0.85);
    border-color: rgba(168, 85, 247, 0.7);
    color: #ffffff;
    transform: translateY(-3px);
    box-shadow: 
      0 0 0 1px rgba(168, 85, 247, 0.3) inset,
      0 8px 24px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(168, 85, 247, 0.3),
      0 0 60px rgba(168, 85, 247, 0.15);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    letter-spacing: 0.4px;
  }

  @media (max-width: 480px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
    letter-spacing: 0.3px;
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
  gap: 3rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 2rem;
  position: relative;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    gap: 2.5rem;
    padding: 2rem 2rem;
    max-width: 100%;
  }

  @media (max-width: 968px) {
    gap: 2rem;
    padding: 2rem 1.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 1.5rem;
  }
`;

/* Image Carousel Container */
const WhatWeDoBlockImage = styled(motion.div)`
  flex: 0 0 auto;
  max-width: 650px;
  width: 650px;
  height: 380px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.15);

  @media (max-width: 1200px) {
    max-width: 580px;
    width: 580px;
    height: 360px;
  }

  @media (max-width: 968px) {
    max-width: 520px;
    width: 520px;
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
      rgba(40, 35, 50, 0.95) 0%,
      rgba(35, 30, 45, 0.95) 100%
    ),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
  flex: 0 0 auto;
  max-width: 550px;
  min-height: 280px;
  height: 100%;
  width: 550px;
  padding: 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(168, 85, 247, 0.3);
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
    0 4px 20px rgba(168, 85, 247, 0.15);
  transition: all 0.3s ease;
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
      rgba(168, 85, 247, 0.08) 0%,
      transparent 50%,
      rgba(168, 85, 247, 0.04) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 16px;
    z-index: 1;
    pointer-events: none;
    mix-blend-mode: overlay;
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
    min-height: 260px;
    padding: 2.25rem 2rem;
    max-width: 480px;
    width: 480px;
  }

  @media (max-width: 768px) {
    min-height: 240px;
    padding: 2rem 1.75rem;
    max-width: 100%;
    width: 100%;
  }

  @media (max-width: 480px) {
    min-height: 220px;
    padding: 1.75rem 1.5rem;
  }

  /* Interactive hover effects - subtle */
  &:hover {
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 
      0 4px 20px rgba(168, 85, 247, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);

    &::before {
      opacity: 0.2;
    }
  }

  /* Active state */
  &:active {
    transform: translateY(0);
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
  margin: 0 0 0.875rem 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
  flex-shrink: 0;
`;

const WhatWeDoMetaRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 0.4375rem;
    margin-bottom: 1.125rem;
  }

  @media (max-width: 480px) {
    gap: 0.375rem;
    margin-bottom: 1rem;
  }
`;

const WhatWeDoMetaPill = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgba(168, 85, 247, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'Tomorrow', sans-serif;
  transition: all 0.3s ease;
  white-space: nowrap;

  ${WhatWeDoBlock}:hover & {
    background: rgba(168, 85, 247, 0.18);
    border-color: rgba(168, 85, 247, 0.35);
    color: rgba(168, 85, 247, 1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.3125rem 0.625rem;
    font-size: 0.625rem;
  }

  @media (max-width: 480px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.5625rem;
  }
`;

const WhatWeDoOutcome = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  margin: 1.5rem 0 1rem 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 10px;
  position: relative;
  z-index: 2;
  box-shadow: 
    0 0 0 1px rgba(168, 85, 247, 0.1) inset,
    0 2px 8px rgba(0, 0, 0, 0.3);

  ${WhatWeDoBlock}:hover & {
    border-color: rgba(168, 85, 247, 0.3);
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 
      0 0 0 1px rgba(168, 85, 247, 0.15) inset,
      0 4px 12px rgba(168, 85, 247, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.875rem;
    margin: 1.25rem 0 0.875rem 0;
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
    margin: 1rem 0 0.75rem 0;
  }
`;

const OutcomeLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  color: rgba(168, 85, 247, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.5625rem;
  }
`;

const OutcomeText = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  font-family: 'Tomorrow', sans-serif;
  flex: 1;
  text-align: right;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    text-align: left;
    font-size: 0.6875rem;
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
  font-family: 'Tomorrow', sans-serif;
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
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    line-height: 1.6;
    gap: 0.75rem;
    margin-bottom: 0;
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

const WhatWeDoBlockCTAWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  position: relative;
  z-index: 10;
`;

const WhatWeDoBlockCTA = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  z-index: 10;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
  border: none;
  width: 100%;
  max-width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 
    0 4px 16px rgba(113, 32, 176, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    color: #ffffff;
    background: linear-gradient(135deg, #7a30c0 0%, #c430ff 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 6px 24px rgba(113, 32, 176, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    padding: 0.875rem 2rem;
    gap: 0.625rem;
    letter-spacing: 0.6px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    letter-spacing: 0.5px;

    svg {
      width: 15px;
      height: 15px;
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
          <DiscordButton
            href="https://discord.gg/hnjtVpb9H5"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Discord width={24} height={24} />
            Join Discord Community
          </DiscordButton>
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
            src={clubGroupPhoto} 
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
            <PinnedLogo
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 5 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <img src={BBLogo} alt="Boiler Blockchain Logo" />
            </PinnedLogo>
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

      {/* Stats Hero Section */}
      <StatsHeroSection
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Network Field */}
        <NetworkField>
          {[...Array(12)].map((_, i) => (
            <NetworkNode
              key={`node-${i}`}
              left={`${15 + (i * 7)}%`}
              top={`${30 + (i % 3) * 20}%`}
              duration={20 + (i % 5) * 3}
              delay={i * 0.5}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <NetworkLine
              key={`line-${i}`}
              left={`${10 + (i * 12)}%`}
              top={`${35 + (i % 2) * 30}%`}
              width={`${80 + (i % 3) * 20}px`}
              rotate={-15 + (i % 3) * 15}
              duration={15 + (i % 4) * 2}
              delay={i * 0.3}
            />
          ))}
        </NetworkField>

        <StatsHeroContainer>
          <StatsHeroHeader
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsHeroEyebrow>BY THE NUMBERS</StatsHeroEyebrow>
          </StatsHeroHeader>
          <StatsHeroLedgerRow
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Chain Line */}
            <ChainLine>
              {[0, 1, 2, 3].map((i) => (
                <ChainLineSegment
                  key={`segment-${i}`}
                  data-segment-index={i}
                  left={`${i * 25}%`}
                  width="25%"
                  top={`${i * 25}%`}
                  height="25%"
                />
              ))}
            </ChainLine>

            {[
              // Update these values as needed - all stats use the same structure
              { icon: FiZap, value: 100, suffix: "+", label: "Weekly Active", micro: "Members every week" },
              { icon: FiDollarSign, value: 50000, prefix: "$", suffix: "+", label: "in Prize Money Won", micro: "Across global hackathons" },
              { icon: FiBriefcase, value: 25, suffix: "+", label: "Partners & Sponsors", micro: "Backed by leading protocols" },
              { icon: FiAward, value: 400, suffix: "+", label: "Students Graduated", micro: "From technical course" }
            ].map((stat, index) => {
              const baseDelay = 0.4 + index * 0.15;
              return (
                <React.Fragment key={index}>
                  <StatNodeWrapper>
                    <StatNode
                      data-node-index={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: baseDelay }}
                    >
                      <StatNodeDot
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: baseDelay }}
                      />
                      <StatsHeroStatValue
                        as={motion.div}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: baseDelay + 0.4 }}
                      >
                        <CountUp 
                          end={stat.value} 
                          duration={2000} 
                          prefix={stat.prefix || ""} 
                          suffix={stat.suffix || ""} 
                        />
                      </StatsHeroStatValue>
                      <StatsHeroStatLabel
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: baseDelay + 0.6 }}
                      >
                        {stat.label}
                      </StatsHeroStatLabel>
                      <StatsHeroStatMicro
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: baseDelay + 0.7 }}
                      >
                        {stat.micro}
                      </StatsHeroStatMicro>
                    </StatNode>
                  </StatNodeWrapper>
                  {index < 3 && (
                    <StatConnectionLine
                      as={motion.div}
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: baseDelay + 0.3 }}
                      style={{ originX: 0 }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </StatsHeroLedgerRow>
        </StatsHeroContainer>
        <StatsHeroDivider className="bottom" />
      </StatsHeroSection>

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
                <span>Education</span>
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
                <span>Development</span>
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
                <span>Research</span>
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
                <span>Operations</span>
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
                <WhatWeDoMetaRow>
                  <WhatWeDoMetaPill>12 weeks</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Full-Stack</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Workshops</WhatWeDoMetaPill>
                </WhatWeDoMetaRow>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>12-week technical course covering Web3 fundamentals</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Student instructors + dedicated TAs for weekly support</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Guest lectures, protocol workshops, and company visits</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTAWrapper>
                  <WhatWeDoBlockCTA to="/courses">
                    Explore
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </WhatWeDoBlockCTA>
                </WhatWeDoBlockCTAWrapper>
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
                <WhatWeDoMetaRow>
                  <WhatWeDoMetaPill>Hackathons</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Grants</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Bounties</WhatWeDoMetaPill>
                </WhatWeDoMetaRow>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>Ship products through hackathons, grants, and bounties</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Small builder teams with weekly sprints + code review</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Demo days with protocol feedback + iteration</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTAWrapper>
                  <WhatWeDoBlockCTA to="/teams">
                    Explore
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </WhatWeDoBlockCTA>
                </WhatWeDoBlockCTAWrapper>
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
                <WhatWeDoMetaRow>
                  <WhatWeDoMetaPill>Investments</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Consulting</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Due Diligence</WhatWeDoMetaPill>
                </WhatWeDoMetaRow>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>Investment and protocol research with real deliverables</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Formal due diligence for partners and sponsors</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Publish theses on emerging crypto markets and sectors</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTAWrapper>
                  <WhatWeDoBlockCTA to="/teams/research">
                    Explore
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </WhatWeDoBlockCTA>
                </WhatWeDoBlockCTAWrapper>
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
                <WhatWeDoMetaRow>
                  <WhatWeDoMetaPill>Events</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Funding</WhatWeDoMetaPill>
                  <WhatWeDoMetaPill>Growth</WhatWeDoMetaPill>
                </WhatWeDoMetaRow>
                <WhatWeDoBlockBody>
                  <WhatWeDoBlockBullet>Organize and run all events, speakers, and workshops</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Secure funding + manage sponsorship relationships</WhatWeDoBlockBullet>
                  <WhatWeDoBlockBullet>Scale teams through media, recruiting and onboarding</WhatWeDoBlockBullet>
                </WhatWeDoBlockBody>
                <WhatWeDoBlockCTAWrapper>
                  <WhatWeDoBlockCTA to="/teams/operations">
                    Explore
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </WhatWeDoBlockCTA>
                </WhatWeDoBlockCTAWrapper>
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

      {/* CTA Divider */}
      <CTADivider />

      {/* Improved CTA Section */}
      <CTASection>
        <CTAContainer>
          <CTAContent
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CTATitle>
              Ready to Build the <CTAGradient>Future</CTAGradient>?
            </CTATitle>
            <CTADescription>
              Join Purdue's premier Web3 organization. Whether you're a builder, researcher, or entrepreneur, 
              we provide the resources, community, and opportunities to launch your career in blockchain.
            </CTADescription>
            <CTAButtonGroup
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CTAButton
              as="a"
              href="https://discord.gg/hnjtVpb9H5"
              target="_blank"
              rel="noopener noreferrer"
              className="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              Join Discord
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </CTAButton>
              <CTAButton
                to="/contact"
                className="secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </CTAButton>
            </CTAButtonGroup>
          </CTAContent>
        </CTAContainer>
      </CTASection>
    </PageContainer>
  );
};

export default Home;
