import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiCode, FiUsers, FiAward, FiBook, FiZap, FiTrendingUp, FiGithub, FiTarget, FiSearch, FiSettings } from 'react-icons/fi';
// Fallback placeholder if group image doesn't exist
import placeholderImage from '../../assets/images/1.jpg';

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
  background: #000000;
  padding: 120px 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
  background: #000000;
  position: relative;
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

const IdentitySection = styled(motion.section)`
  width: 100%;
  max-width: 100vw;
  padding: 120px 2rem;
  background: #000000;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;

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
  padding: 80px 2rem;
  background: #000000;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 60px 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 50px 1rem;
  }
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
  max-width: 1150px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const WhatWeDoTitle = styled(motion.h2)`
  font-size: 3.25rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  text-align: center;
  letter-spacing: -1px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  @media (max-width: 480px) {
    font-size: 1.875rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0;
  }
`;

const WhatWeDoSubtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 3rem;
  text-align: center;
  font-weight: 400;
  letter-spacing: 0.1px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 2.5rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    line-height: 1.4;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }
`;

const WhatWeDoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const WhatWeDoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(168, 85, 247, 0.18);
  border-radius: 24px;
  padding: 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    border-color: rgba(168, 85, 247, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(168, 85, 247, 0.15);
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const WhatWeDoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const WhatWeDoCardIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(168, 85, 247, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: rgba(168, 85, 247, 0.85);
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;

    svg {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;

    svg {
      font-size: 16px;
    }
  }
`;

const WhatWeDoCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.2px;
  line-height: 1.3;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1.0625rem;
  }
`;

const WhatWeDoCardBody = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 20px;
  letter-spacing: 0.05px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    line-height: 1.5;
    margin-bottom: 18px;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 16px;
  }
`;

const WhatWeDoCardLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(168, 85, 247, 0.9);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin-top: 4px;

  &:hover {
    color: rgba(168, 85, 247, 1);
    gap: 8px;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    gap: 5px;

    svg {
      width: 14px;
      height: 14px;
    }
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
      {/* Hero Section */}
      <HeroSection>
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
                  opacity: 0.2,
                  width: 1,
                },
                move: { enable: true, speed: 0.5 },
                number: { value: 50 },
                opacity: { value: 0.15 },
                size: { value: 1.5 },
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
                    distance: 100,
                    links: { opacity: 0.2 }
                  }
                }
              }
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </ParticlesContainer>
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
        <WhatWeDoContainer>
          <WhatWeDoDivider />
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
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Four pillars. One outcome: elite Web3 talent.
          </WhatWeDoSubtitle>
          <WhatWeDoGrid
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <WhatWeDoCard variants={itemVariants}>
              <WhatWeDoCardHeader>
                <WhatWeDoCardIcon>
                  <FiBook />
                </WhatWeDoCardIcon>
                <WhatWeDoCardTitle>Education</WhatWeDoCardTitle>
              </WhatWeDoCardHeader>
              <WhatWeDoCardBody>
                Structured courses, workshops, and technical training designed to build real depth—from fundamentals to advanced systems.
              </WhatWeDoCardBody>
              <WhatWeDoCardLink to="/courses">
                Explore Education
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </WhatWeDoCardLink>
            </WhatWeDoCard>

            <WhatWeDoCard variants={itemVariants}>
              <WhatWeDoCardHeader>
                <WhatWeDoCardIcon>
                  <FiCode />
                </WhatWeDoCardIcon>
                <WhatWeDoCardTitle>Development</WhatWeDoCardTitle>
              </WhatWeDoCardHeader>
              <WhatWeDoCardBody>
                Cross-functional teams that ship real products, tooling, and infrastructure with high standards, reviews, and deadlines.
              </WhatWeDoCardBody>
              <WhatWeDoCardLink to="/teams">
                View Development
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </WhatWeDoCardLink>
            </WhatWeDoCard>

            <WhatWeDoCard variants={itemVariants}>
              <WhatWeDoCardHeader>
                <WhatWeDoCardIcon>
                  <FiSearch />
                </WhatWeDoCardIcon>
                <WhatWeDoCardTitle>Research</WhatWeDoCardTitle>
              </WhatWeDoCardHeader>
              <WhatWeDoCardBody>
                Protocol analysis, market structure work, and frontier exploration—turning curiosity into rigorous, publishable insight.
              </WhatWeDoCardBody>
              <WhatWeDoCardLink to="/teams/research">
                See Research
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </WhatWeDoCardLink>
            </WhatWeDoCard>

            <WhatWeDoCard variants={itemVariants}>
              <WhatWeDoCardHeader>
                <WhatWeDoCardIcon>
                  <FiSettings />
                </WhatWeDoCardIcon>
                <WhatWeDoCardTitle>Operations</WhatWeDoCardTitle>
              </WhatWeDoCardHeader>
              <WhatWeDoCardBody>
                The engine behind everything: partnerships, events, logistics, and systems that let builders focus and scale impact.
              </WhatWeDoCardBody>
              <WhatWeDoCardLink to="/teams/operations">
                How Operations Works
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </WhatWeDoCardLink>
            </WhatWeDoCard>
          </WhatWeDoGrid>
        </WhatWeDoContainer>
      </WhatWeDoSection>

      {/* Who We Are Section */}
      <Section>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Who <span className="gradient-text">We Are</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Boiler Blockchain is Purdue's leading student organization for blockchain technology, empowering students through education, innovation, and community.
          </SectionDescription>
          <TwoColumn>
            <TextContent
              as={motion.div}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p>
                At Boiler Blockchain, we provide comprehensive educational programs, hands-on development opportunities, and a vibrant community for students passionate about blockchain technology.
              </p>
              <p>
                Our mission is to bridge the gap between academic learning and real-world blockchain applications, preparing students for careers in the rapidly evolving Web3 ecosystem.
              </p>
            </TextContent>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardIcon>
                  <FiCode />
                </CardIcon>
                <CardTitle>Technical Courses</CardTitle>
                <CardText>
                  Comprehensive 16-week courses covering blockchain fundamentals, smart contract development, and decentralized applications.
                </CardText>
              </Card>
            </motion.div>
          </TwoColumn>
        </Container>
      </Section>

      {/* Achievements Section */}
      <Section>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="gradient-text">Achievements</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From ETH SF to ETH Denver, our journey through the blockchain ecosystem has been marked by innovation and success.
          </SectionDescription>
          <Grid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={11} suffix="+" />
              </StatNumber>
              <StatLabel>Hackathons</StatLabel>
              <StatCardText>
                Participated in premier blockchain hackathons including ETH SF, ETH Denver, ETH NYC, and more.
              </StatCardText>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={15} suffix="+" />
              </StatNumber>
              <StatLabel>Prizes Won</StatLabel>
              <StatCardText>
                Recognized for innovative solutions and outstanding projects across multiple competitions.
              </StatCardText>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={25} prefix="$" suffix="K+" />
              </StatNumber>
              <StatLabel>Prize Value</StatLabel>
              <StatCardText>
                Total value of prizes and awards won through hackathon participation and competitions.
              </StatCardText>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={150} suffix="+" />
              </StatNumber>
              <StatLabel>Students Taught</StatLabel>
              <StatCardText>
                Empowered students through comprehensive courses and hands-on learning experiences.
              </StatCardText>
            </StatCard>
          </Grid>
        </Container>
      </Section>

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
