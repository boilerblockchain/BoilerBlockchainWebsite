import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaLinkedin } from 'react-icons/fa';
import Twitter from '../../Icons/Twitter';
import Navigation from '../Navigation';
import Footer from '../Footer';

// Executive Board
import eliImage from '../../assets/images/pfps/exec/eli_dubizh.jpg';
import joeyImage from '../../assets/images/pfps/exec/joey_kokinda.jpg';
import neenaImage from '../../assets/images/pfps/exec/neena_naikar.jpg';
import albertImage from '../../assets/images/pfps/exec/albert_wu.jpg';
import siyaImage from '../../assets/images/pfps/exec/siya_jariwala.jpg';
import adityaImage from '../../assets/images/pfps/exec/aditya_kattil.jpeg';

// Developer Team
import ansonImage from '../../assets/images/pfps/dev/anson_lam.JPG';
import aryanSinghalImage from '../../assets/images/pfps/dev/aryan_singhal.png';
import christopherImage from '../../assets/images/pfps/dev/christopher_herzog.jpg';
import danielImage from '../../assets/images/pfps/dev/daniel_gong.png';
import jazibImage from '../../assets/images/pfps/dev/jazib_qureshi.jpg';
import matthewImage from '../../assets/images/pfps/dev/matthew_iskandar.png';
import adiImage from '../../assets/images/pfps/dev/adi_chaudhary.png';
import abrahamImage from '../../assets/images/pfps/dev/abraham_kabon.jpg';
import rithvikImage from '../../assets/images/pfps/dev/rithvik_krishnan.png';
import ishanImage from '../../assets/images/pfps/dev/ishan_ghosh.jpg';
import juliusImage from '../../assets/images/pfps/dev/julius_zhou.jpg';
import sebastianImage from '../../assets/images/pfps/dev/sebastian_ting.png';
import kritavImage from '../../assets/images/pfps/dev/kritav_dalal.jpg';
import danielJinImage from '../../assets/images/pfps/dev/daniel_jin.jpg';
import siddheshImage from '../../assets/images/pfps/dev/siddhesh_songirkar.jpg';
import dhiyaanImage from '../../assets/images/pfps/dev/dhiyaan_nirmal.jpg';
import pranavImage from '../../assets/images/pfps/dev/pranav_doshi.png';
import manasviImage from '../../assets/images/pfps/dev/manasvi_meka.PNG';
import joshuaImage from '../../assets/images/pfps/dev/joshua_cho.JPG';
import yashImage from '../../assets/images/pfps/dev/yash_bapat.jpeg';
import manningImage from '../../assets/images/pfps/dev/manning_wu.jpeg';

// Research Team
import aryanPatelImage from '../../assets/images/pfps/res/aryan_patel.png';
import divyanshImage from '../../assets/images/pfps/res/divyansh_pramanick.jpg';
import ishaanImage from '../../assets/images/pfps/res/ishaan_saxena.png';
import muhammadImage from '../../assets/images/pfps/res/ayaan_ameen.jpeg';
import vaibhavImage from '../../assets/images/pfps/res/vaibhav_sunkada.jpg';
import nickImage from '../../assets/images/pfps/res/nick_diaz.jpg';
import anikethImage from '../../assets/images/pfps/res/aniketh_upadhya.jpg';
import oscarfImage from '../../assets/images/pfps/res/oscarf_velasco.jpg';
import kevalImage from '../../assets/images/pfps/res/keval_shah.jpg';
import lakulishImage from '../../assets/images/pfps/res/lakulish_saini.png';
import nikhilImage from '../../assets/images/pfps/res/nikhil_aerabati.jpeg';
import sohumImage from '../../assets/images/pfps/res/sohum_kashyap.jpg';

// Operations Team
import anubhutiImage from '../../assets/images/pfps/ops/anubhuti_mittal.jpg';
import emilyImage from '../../assets/images/pfps/ops/emily_zhang.jpg';
import jacobImage from '../../assets/images/pfps/ops/jacob_gutwein.jpeg';
import sahilImage from '../../assets/images/pfps/ops/sahil_shaikh.jpg';
import shariqImage from '../../assets/images/pfps/ops/shariq_kapadia.jpeg';
import garvImage from '../../assets/images/pfps/ops/garv_tayade.jpg';
import mugdhaImage from '../../assets/images/pfps/ops/mugdha_patil.jpg';
import shivamImage from '../../assets/images/pfps/ops/shivam_rastogi.jpg';
import mahiImage from '../../assets/images/pfps/ops/mahi_tripathi.jpg';
import akashImage from '../../assets/images/pfps/ops/akash_mishra.jpg';
import pradyumnImage from '../../assets/images/pfps/ops/pradyumn_malik.jpeg';
import alexImage from '../../assets/images/pfps/ops/alex_belanger.png';

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 8rem 0 0;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }

  @media (max-width: 480px) {
    padding: 6rem 0 0;
  }
`;

const Container = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: 0 auto 0;
  padding: 120px 2rem 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    width: 95%;
    padding: 110px 1.75rem 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 100px 1.5rem 0;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1rem 0;
  }

  @media (max-width: 360px) {
    padding: 70px 0.75rem 0;
  }
`;

const Title = styled(motion.h1)`
  font-size: 5rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4px;
  line-height: 1.1;
  position: relative;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
  filter: drop-shadow(0 4px 20px rgba(168, 85, 247, 0.2));

  span {
    background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.95) 30%, rgba(168, 85, 247, 0.95) 70%, rgba(168, 85, 247, 0.85) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.9), rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.4), transparent);
    border-radius: 2px;
    box-shadow: 
      0 0 20px rgba(168, 85, 247, 0.5),
      0 0 40px rgba(168, 85, 247, 0.3);

    @media (max-width: 768px) {
      width: 150px;
      height: 3px;
      bottom: -0.75rem;
    }

    @media (max-width: 480px) {
      width: 120px;
      height: 2px;
      bottom: -0.5rem;
    }
  }

  @media (max-width: 1024px) {
    font-size: 4rem;
    letter-spacing: 3px;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    letter-spacing: 1.5px;
    word-break: break-word;
  }

  @media (max-width: 360px) {
    font-size: 2rem;
    letter-spacing: 1px;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 320px) {
    font-size: 1.75rem;
    letter-spacing: 0.5px;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 900px;
  margin: 0 auto 4rem;
  line-height: 1.8;
  font-weight: 400;
  letter-spacing: 0.4px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    font-size: 1.15rem;
    margin-bottom: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 3rem;
    line-height: 1.7;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    margin-bottom: 2.5rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 360px) {
    font-size: 0.875rem;
    margin-bottom: 2rem;
  }
`;

const FilterNav = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 5rem;
  flex-wrap: wrap;
  padding: 0;
  width: 100%;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 4rem;
    max-width: 95%;
  }

  @media (max-width: 480px) {
    gap: 0.4rem;
    margin-bottom: 3rem;
    max-width: 100%;
  }

  @media (max-width: 360px) {
    gap: 0.3rem;
    margin-bottom: 2.5rem;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.875rem 1.75rem;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #7120b0 0%, #8d2dd4 100%)' 
    : 'rgba(30, 30, 40, 0.6)'};
  border: ${props => props.active 
    ? '1.5px solid rgba(168, 85, 247, 0.5)' 
    : '1px solid rgba(168, 85, 247, 0.2)'};
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.75)'};
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '700' : '600'};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  white-space: nowrap;
  box-shadow: ${props => props.active 
    ? '0 4px 16px rgba(113, 32, 176, 0.4), 0 0 20px rgba(168, 85, 247, 0.2)' 
    : '0 2px 8px rgba(0, 0, 0, 0.2)'};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
    opacity: ${props => props.active ? 1 : 0};
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
  }

  .count {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.8;
    font-weight: 500;
  }

  &:hover {
    color: #ffffff;
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #8d2dd4 0%, #a040e8 100%)' 
      : 'rgba(113, 32, 176, 0.2)'};
    border-color: ${props => props.active 
      ? 'rgba(168, 85, 247, 0.7)' 
      : 'rgba(168, 85, 247, 0.4)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active 
      ? '0 6px 24px rgba(113, 32, 176, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)' 
      : '0 4px 12px rgba(168, 85, 247, 0.2)'};

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.25rem;
    font-size: 0.75rem;
    letter-spacing: 1px;

    .count {
      font-size: 0.6875rem;
      margin-left: 0.375rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.6875rem;
    letter-spacing: 0.8px;
    min-height: 44px;

    .count {
      font-size: 0.625rem;
      margin-left: 0.25rem;
    }
  }

  @media (max-width: 360px) {
    padding: 0.5625rem 0.75rem;
    font-size: 0.625rem;
    min-height: 42px;
    letter-spacing: 0.6px;
  }
`;

const TeamRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  justify-items: center;
  align-items: start;
  justify-content: center;
  gap: 2.5rem;
  margin: 4rem 0 6rem;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.75rem;
    margin: 3rem 0 4rem;
    padding: 0 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 2.5rem 0 3.5rem;
    padding: 0 0.75rem;
    max-width: 100%;
  }

  @media (max-width: 360px) {
    gap: 1.25rem;
    margin: 2rem 0 3rem;
    padding: 0 0.5rem;
  }
`;

const MemberCard = styled(motion.div)`
  width: 100%;
  max-width: 290px;
  margin: 0 auto;
  background: rgba(25, 25, 35, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1.5px solid rgba(168, 85, 247, 0.25);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(168, 85, 247, 0.15) inset,
    0 0 60px rgba(168, 85, 247, 0.08);
  padding: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: 1;
    border-radius: 20px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1));
    opacity: 0;
    filter: blur(12px);
    transition: opacity 0.5s ease;
    z-index: -1;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(168, 85, 247, 0.3) inset,
      0 0 80px rgba(168, 85, 247, 0.25),
      0 0 120px rgba(168, 85, 247, 0.1);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 18px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    border-radius: 16px;
  }

  @media (max-width: 360px) {
    border-radius: 14px;
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0f2e 0%, #2d1a3d 100%);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
    z-index: 1;
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 25%;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${MemberCard}:hover img {
    transform: scale(1.03);
  }
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(113, 32, 176, 0.1);
  border-radius: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(113, 32, 176, 0.2);

  &::before {
    content: '👤';
    font-size: 2.5rem;
    opacity: 0.4;
  }
`;

const ContentContainer = styled.div`
  padding: 1.75rem 1.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 1.5rem 1.25rem 1.75rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem 1rem 1.5rem;
    gap: 0.625rem;
  }

  @media (max-width: 360px) {
    padding: 1rem 0.875rem 1.25rem;
    gap: 0.5rem;
  }
`;

const MemberName = styled.h3`
  font-size: 1.375rem;
  color: #ffffff;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
  line-height: 1.3;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${MemberCard}:hover & {
    color: #a855f7;
    text-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    line-height: 1.4;
  }

  @media (max-width: 360px) {
    font-size: 1rem;
  }
`;

const MemberTitle = styled.p`
  font-size: 0.75rem;
  color: rgba(168, 85, 247, 0.8);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
  line-height: 1.5;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${MemberCard}:hover & {
    color: rgba(168, 85, 247, 1);
    text-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0.6875rem;
    letter-spacing: 1.2px;
  }

  @media (max-width: 480px) {
    font-size: 0.625rem;
    letter-spacing: 1px;
  }
`;

const SocialIconsContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 2;

  @media (max-width: 480px) {
    top: 0.5rem;
    right: 0.5rem;
    gap: 0.375rem;
  }
`;

const SocialIcon = styled(motion.a)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 0.85;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 32px;
  min-height: 32px;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
  }

  @media (max-width: 360px) {
    width: 38px;
    height: 38px;
    min-width: 38px;
    min-height: 38px;
  }

  &:hover {
    opacity: 1;
    color: #ffffff;
    background: rgba(113, 32, 176, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-color: rgba(113, 32, 176, 0.5);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px rgba(113, 32, 176, 0.3);
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 480px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }

  /* LinkedIn icon from react-icons */
  svg[data-icon="linkedin"] {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    svg[data-icon="linkedin"] {
      font-size: 1rem;
    }
  }
`;

// Extract name from image path (e.g., "eli_dubizh.jpg" -> "eli_dubizh")
const getNameFromImage = (imagePath) => {
  if (!imagePath) return null;
  
  // Handle both string paths and imported modules
  let path = '';
  if (typeof imagePath === 'string') {
    path = imagePath;
  } else if (imagePath.default) {
    path = imagePath.default;
  } else if (typeof imagePath === 'object' && imagePath.toString) {
    path = imagePath.toString();
  } else {
    return null;
  }
  
  // Extract filename from path
  const filename = path.split('/').pop().split('\\').pop();
  
  // Remove file extension (handles both regular and webpack hashed files)
  // Pattern: name.hash.ext or name.ext -> extract "name" part
  // For hashed files like "eli_dubizh.abc123.jpg", we want "eli_dubizh"
  const withoutExt = filename.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif|GIF|webp|WEBP)$/i, '');
  
  // If it contains dots (webpack hash), take the part before the first dot after the underscore pattern
  // e.g., "eli_dubizh.abc123" -> "eli_dubizh"
  if (withoutExt.includes('.')) {
    // Find the pattern "first_last" before any hash
    const underscoreIndex = withoutExt.indexOf('_');
    if (underscoreIndex !== -1) {
      // Find the next dot after the underscore (this is where the hash starts)
      const dotAfterUnderscore = withoutExt.indexOf('.', underscoreIndex);
      if (dotAfterUnderscore !== -1) {
        return withoutExt.substring(0, dotAfterUnderscore);
      }
    }
  }
  
  return withoutExt;
};

// Format name from "first_last" to "First Last"
const formatName = (name, imagePath) => {
  // If explicit name is provided, use it
  if (name) {
    return name
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Otherwise, extract from image path
  if (imagePath) {
    const extractedName = getNameFromImage(imagePath);
    if (extractedName) {
      return extractedName
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
  }
  
  return 'Team Member';
};

// Helper function to get title based on category
const getTitleByCategory = (category) => {
  const titles = {
    developer: "Developer Team",
    research: "Research Team",
    operations: "Operations Team",
    executive: "Executive Board",
  };
  return titles[category] || "Team Member";
};

// Team member data - names will be extracted from image filenames
// UPDATE SOCIAL LINKS HERE - Each person only needs to be updated once!
// Replace "#" with actual LinkedIn/Twitter URLs
// 
// TO ADD A CUSTOM TITLE: Add a "title" property to any member object
// Example: { id: 1, image: eliImage, category: "executive", title: "President", socials: {...} }
// If no "title" is provided, it will default to the team name (e.g., "Executive Board", "Developer Team")
const allTeamMembersUnsorted = [
  // Executive Board
  { id: 1, image: eliImage, category: "executive", title: "President", socials: { linkedin: "https://www.linkedin.com/in/eli-dubizh/", twitter: "https://x.com/EliDubizh" } },
  { id: 2, image: joeyImage, category: "executive", title: "Chief Degen Officer", socials: { linkedin: "https://www.linkedin.com/in/jkokinda", twitter: "https://x.com/sp3ked" } },
  { id: 3, image: neenaImage, category: "executive", title: "Head of Operations", socials: { linkedin: "https://www.linkedin.com/in/neena-naikar/", twitter: "https://x.com/neenanaikar" } },
  { id: 4, image: albertImage, category: "executive", title: "Chief Legal Officer", socials: { linkedin: "https://www.linkedin.com/in/ajxwu/", twitter: "https://x.com/Hauntpex" } },
  { id: 5, image: siyaImage, category: "executive", title: "Vice President", socials: { linkedin: "https://www.linkedin.com/in/siya-jariwala", twitter: "https://x.com/siyasiyasiyaaa" } },
  { id: 6, image: adityaImage, category: "executive", title: "Head of Education", socials: { linkedin: "https://www.linkedin.com/in/aditya-kuniyil-kattil/", twitter: "https://x.com/iamadityakk?s=21&t=Aw27j3VM8u8ewB9mb4Ga-w" } },
  // Developer Team
  { id: 7, image: ansonImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/ansonlam23/", twitter: "https://twitter.com/anslam23" } },
  { id: 8, image: aryanSinghalImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/aryan-singhal-ai/", twitter: "https://x.com/ai_singhal" } },
  { id: 9, image: christopherImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/christopherrherzog/", twitter: "https://x.com/chrisherzog78" } },
  { id: 10, image: danielImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/daniel-gong-27a303383/", twitter: "https://x.com/ManyDZG" } },
  { id: 11, image: jazibImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/jazib-qureshi/", twitter: "https://x.com/Jazibrq225" } },
  { id: 12, image: matthewImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/matthew-iskandar-1aa425309/", twitter: "https://twitter.com/IskandarMatthew" } },
  { id: 13, image: adiImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/adi-chaudharyy/", twitter: "https://x.com/akc__2025" } },
  { id: 14, image: abrahamImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/abraham-kabon/", twitter: "https://x.com/AbrahamKabon" } },
  { id: 15, image: rithvikImage, category: "developer", socials: { linkedin: "http://linkedin.com/in/rithvikkrishnan", twitter: "https://x.com/rithvikk06" } },
  { id: 16, image: ishanImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/ishan-ghosh1330/", twitter: "https://x.com/masterish0" } },
  { id: 17, image: juliusImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/julius-zhou-6ab3a2230/", twitter: "https://x.com/gng910216042682" } },
  { id: 18, image: sebastianImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/sebastian-ting-2b2032363?trk=people-guest_people_search-card", twitter: "https://x.com/sebastiant98235" } },
  { id: 19, image: kritavImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/kritav/", twitter: "https://x.com/kritvd" } },
  { id: 20, image: danielJinImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/djin25/", twitter: "https://x.com/ninebitcomputer" } },
  { id: 21, image: siddheshImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/siddhesh-songirkar/", twitter: "https://x.com/TenerSed5" } },
  { id: 22, image: dhiyaanImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/dhiyaan/", twitter: "https://x.com/dh1yaan?s=21" } },
  { id: 23, image: pranavImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/pranav-doshi-60a647213/", twitter: "https://x.com/0xPranavDoshi" } },
  { id: 24, image: manasviImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/manasvi-meka-80221327a/", twitter: "https://x.com/manasvi60777" } },
  { id: 25, image: joshuaImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/sanghyun-j-cho/", twitter: "https://x.com/himynameisjahsh" } },
  { id: 26, image: yashImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/yash-bapat-4810a4251/", twitter: "https://twitter.com/YashBapat178164" } },
  { id: 27, image: manningImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/manning-w-9a0399318/", twitter: "https://x.com/manningwu_" } },
  // Research Team
  { id: 28, image: aryanPatelImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/aryan-patel-a59117386/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", twitter: "https://x.com/aryanmp4_?s=21" } },
  { id: 29, image: divyanshImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/divyansh-pramanick/", twitter: "https://x.com/DivPramanick" } },
  { id: 30, image: ishaanImage, category: "research", socials: { linkedin: "http://linkedin.com/in/ishaan-saxena-75b1262a5", twitter: "https://x.com/Ishsax07" } },
  { id: 31, image: muhammadImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/muhammad-ayaan-ameen-17178b2b2/", twitter: "https://twitter.com/Ayaanafterhours" } },
  { id: 32, image: vaibhavImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/vaibhav-sunkada", twitter: "https://x.com/vaibhavsunkada?s=21" } },
  { id: 33, image: nickImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/nickdiaz-/", twitter: "https://x.com/authnick34" } },
  { id: 34, image: anikethImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/aniketh-upadhya-079b68316/", twitter: "https://x.com/anikethu138?s=21" } },
  { id: 35, image: oscarfImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/oscarf-velasco/", twitter: "https://x.com/oscar_vec" } },
  { id: 36, image: kevalImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/keval-shah-3b46a2241", twitter: "https://x.com/kshahdevelops?s=21" } },
  { id: 37, image: lakulishImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/lakulishsaini/", twitter: "https://x.com/lakulishsaini" } },
  { id: 38, image: nikhilImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/nikhil-aerabati/", twitter: "https://twitter.com/nikhilaerabati" } },
  { id: 39, image: sohumImage, category: "research", socials: { linkedin: "https://www.linkedin.com/in/sohumkashyap/", twitter: "https://x.com/SohumKashyap" } },
  // Operations Team
  { id: 40, image: anubhutiImage, category: "operations", title: "Partnerships Lead", socials: { linkedin: "https://www.linkedin.com/in/anubhutimittal/", twitter: "https://x.com/anu_m03?s=11" } },
  { id: 41, image: emilyImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/emilyxizhang", twitter: "https://x.com/zhangemily_?s=11&t=VK1kWg_xbZkHBnzoe87yAw" } },
  { id: 42, image: jacobImage, category: "operations", title: "Investments Lead", socials: { linkedin: "https://www.linkedin.com/in/jacobgutwein27/", twitter: "https://x.com/jacob6gutwein" } },
  { id: 43, image: sahilImage, category: "operations", title: "Developer Lead", socials: { linkedin: "https://www.linkedin.com/in/sahil-shk", twitter: "https://x.com/sasasenor" } },
  { id: 44, image: shariqImage, category: "operations", title: "Head of Consulting", socials: { linkedin: "http://linkedin.com/in/shariq-kapadia", twitter: "https://x.com/KapadiaShariq" } },
  { id: 45, image: garvImage, category: "operations", title: "Developer Lead", socials: { linkedin: "https://www.linkedin.com/in/garv-tayade/", twitter: "https://x.com/0xgt_27" } },
  { id: 46, image: mugdhaImage, category: "operations", title: "Developer Lead", socials: { linkedin: "https://www.linkedin.com/in/mugdhadpatil/", twitter: "https://x.com/mugdhapatil17?s=21" } },
  { id: 47, image: shivamImage, category: "operations", title: "Head Instructor", socials: { linkedin: "http://linkedin.com/in/rastog18", twitter: "https://x.com/rastog1800" } },
  { id: 48, image: mahiImage, category: "operations", title: "Head of Marketing", socials: { linkedin: "https://www.linkedin.com/in/mahi-tripathi", twitter: "https://x.com/mahi_tripathii" } },
  { id: 49, image: akashImage, category: "operations", title: "Partnerships Lead", socials: { linkedin: "https://www.linkedin.com/in/the-akash-mishra/", twitter: "https://x.com/Akash_Mishra3" } },
  { id: 50, image: pradyumnImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/pradyumn-malik/", twitter: "https://x.com/MalikPradyumn" } },
  { id: 51, image: alexImage, category: "operations", title: "Investments Lead", socials: { linkedin: "https://www.linkedin.com/in/belangeralexander/", twitter: "https://x.com/thedcfguy" } }
];

// Sort team members alphabetically by name (extracted from image filename)
const allTeamMembersSorted = [...allTeamMembersUnsorted].sort((a, b) => {
  const nameA = formatName(null, a.image).toLowerCase();
  const nameB = formatName(null, b.image).toLowerCase();
  return nameA.localeCompare(nameB);
});

// Automatically organize by category (no need to update socials here)
// Each category is also sorted alphabetically
const teamMembers = {
  all: allTeamMembersSorted,
  executive: allTeamMembersSorted.filter(m => m.category === "executive"),
  developer: allTeamMembersSorted.filter(m => m.category === "developer"),
  research: allTeamMembersSorted.filter(m => m.category === "research"),
  operations: allTeamMembersSorted.filter(m => m.category === "operations")
};

const PeopleTeam = () => {
  const [particleKey, setParticleKey] = useState(Date.now());
  const [activeFilters, setActiveFilters] = useState(new Set());

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  const filters = [
    { id: 'developer', label: 'DEVELOPER TEAM' },
    { id: 'research', label: 'RESEARCH TEAM' },
    { id: 'operations', label: 'OPERATIONS TEAM' },
    { id: 'executive', label: 'EXECUTIVE BOARD' }
  ];

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filterId)) {
        newFilters.delete(filterId);
      } else {
        newFilters.add(filterId);
      }
      return newFilters;
    });
  };

  // If no filters are active, show everyone. Otherwise, show members from active filters
  const displayedMembers = activeFilters.size === 0
    ? teamMembers.all
    : allTeamMembersSorted.filter(member => activeFilters.has(member.category));

  return (
    <PageSection>
      <Navigation />
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
            opacity: { value: 0.5 },
            size: { value: 3 },
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
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          OUR <span>TEAM</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet the passionate individuals who lead and drive innovation at Boiler Blockchain
        </Subtitle>

        <FilterNav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filters.map((filter) => {
            const isActive = activeFilters.has(filter.id);
            return (
              <FilterButton
                key={filter.id}
                active={isActive}
                onClick={() => toggleFilter(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{filter.label}</span>
              </FilterButton>
            );
          })}
        </FilterNav>

        <AnimatePresence mode="wait">
          <TeamRow
            key={Array.from(activeFilters).sort().join(',') || 'all'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {displayedMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.08,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <ImageContainer>
                  {member.image ? (
                     <img src={member.image} alt={formatName(null, member.image)} />
                  ) : null}
                  {!member.image && <PlaceholderIcon />}
                  <SocialIconsContainer>
                      <SocialIcon
                        type="linkedin"
                      href={member.socials?.linkedin && member.socials.linkedin !== "#" ? member.socials.linkedin : "#"}
                      target={member.socials?.linkedin && member.socials.linkedin !== "#" ? "_blank" : undefined}
                      rel={member.socials?.linkedin && member.socials.linkedin !== "#" ? "noopener noreferrer" : undefined}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                      <FaLinkedin style={{ fontSize: '0.9rem' }} />
                      </SocialIcon>
                      <SocialIcon
                        type="twitter"
                      href={member.socials?.twitter && member.socials.twitter !== "#" ? member.socials.twitter : "#"}
                      target={member.socials?.twitter && member.socials.twitter !== "#" ? "_blank" : undefined}
                      rel={member.socials?.twitter && member.socials.twitter !== "#" ? "noopener noreferrer" : undefined}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                      <Twitter width={14} height={14} />
                      </SocialIcon>
                  </SocialIconsContainer>
                </ImageContainer>
                 <ContentContainer>
                   <MemberName>{formatName(member.name, member.image)}</MemberName>
                   <MemberTitle>{member.title || getTitleByCategory(member.category)}</MemberTitle>
                 </ContentContainer>
              </MemberCard>
            ))}
          </TeamRow>
        </AnimatePresence>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default PeopleTeam;
