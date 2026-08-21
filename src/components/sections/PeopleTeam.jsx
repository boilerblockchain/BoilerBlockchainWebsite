import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedIn from '../../Icons/LinkedIn';
import Twitter from '../../Icons/Twitter';

// Executive Board
const eliImage = '/images/pfps/exec/eli_dubizh.webp';
const joeyImage = '/images/pfps/exec/joey_kokinda.webp';
const neenaImage = '/images/pfps/exec/neena_naikar.webp';
const albertImage = '/images/pfps/exec/albert_wu.webp';
const siyaImage = '/images/pfps/exec/siya_jariwala.webp';
const adityaImage = '/images/pfps/exec/aditya_kattil.webp';

// Developer Team
const ansonImage = '/images/pfps/dev/anson_lam.webp';
const aryanSinghalImage = '/images/pfps/dev/aryan_singhal.webp';
const christopherImage = '/images/pfps/dev/christopher_herzog.webp';
const danielImage = '/images/pfps/dev/daniel_gong.webp';
const jazibImage = '/images/pfps/dev/jazib_qureshi.webp';
const matthewImage = '/images/pfps/dev/matthew_iskandar.webp';
const adiImage = '/images/pfps/dev/adi_chaudhary.webp';
const abrahamImage = '/images/pfps/dev/abraham_kabon.webp';
const rithvikImage = '/images/pfps/dev/rithvik_krishnan.webp';
const ishanImage = '/images/pfps/dev/ishan_ghosh.webp';
const juliusImage = '/images/pfps/dev/julius_zhou.webp';
const sebastianImage = '/images/pfps/dev/sebastian_ting.webp';
const kritavImage = '/images/pfps/dev/kritav_dalal.webp';
const danielJinImage = '/images/pfps/dev/daniel_jin.webp';
const siddheshImage = '/images/pfps/dev/siddhesh_songirkar.webp';
const dhiyaanImage = '/images/pfps/dev/dhiyaan_nirmal.webp';
const pranavImage = '/images/pfps/dev/pranav_doshi.webp';
const manasviImage = '/images/pfps/dev/manasvi_meka.webp';
const joshuaImage = '/images/pfps/dev/joshua_cho.webp';
const yashImage = '/images/pfps/dev/yash_bapat.webp';
const manningImage = '/images/pfps/dev/manning_wu.webp';
const vatsalImage = '/images/pfps/dev/vatsal_maheshwari.webp';

// Research Team
const aryanPatelImage = '/images/pfps/res/aryan_patel.webp';
const divyanshImage = '/images/pfps/res/divyansh_pramanick.webp';
const ishaanImage = '/images/pfps/res/ishaan_saxena.webp';
const muhammadImage = '/images/pfps/res/ayaan_ameen.webp';
const vaibhavImage = '/images/pfps/res/vaibhav_sunkada.webp';
const nickImage = '/images/pfps/res/nick_diaz.webp';
const anikethImage = '/images/pfps/res/aniketh_upadhya.webp';
const oscarfImage = '/images/pfps/res/oscarf_velasco.webp';
const kevalImage = '/images/pfps/res/keval_shah.webp';
const lakulishImage = '/images/pfps/res/lakulish_saini.webp';
const nikhilImage = '/images/pfps/res/nikhil_aerabati.webp';
const sohumImage = '/images/pfps/res/sohum_kashyap.webp';

// Operations Team
const anubhutiImage = '/images/pfps/ops/anubhuti_mittal.webp';
const emilyImage = '/images/pfps/ops/emily_zhang.webp';
const jacobImage = '/images/pfps/ops/jacob_gutwein.webp';
const sahilImage = '/images/pfps/ops/sahil_shaikh.webp';
const shariqImage = '/images/pfps/ops/shariq_kapadia.webp';
const garvImage = '/images/pfps/ops/garv_tayade.webp';
const mugdhaImage = '/images/pfps/ops/mugdha_patil.webp';
const shivamImage = '/images/pfps/ops/shivam_rastogi.webp';
const mahiImage = '/images/pfps/ops/mahi_tripathi.webp';
const akashImage = '/images/pfps/ops/akash_mishra.webp';
const pradyumnImage = '/images/pfps/ops/pradyumn_malik.webp';
const alexImage = '/images/pfps/ops/alex_belanger.webp';

const PageSection = styled.section`
  width: 100%;
  background-color: ${({ theme }) => theme.color.black};
  position: relative;
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
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 4px;
  line-height: 1.1;
  position: relative;

  span {
    color: ${({ theme }) => theme.color.accent};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 1px;
    background: ${({ theme }) => theme.color.accentBorder};

    @media (max-width: 768px) {
      width: 150px;
      bottom: -0.75rem;
    }

    @media (max-width: 480px) {
      width: 120px;
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
  background: ${({ theme, active }) => active ? theme.color.accentDeep : theme.color.surfaceRaised};
  border: 1px solid ${({ theme, active }) => active ? theme.color.accentBorderStrong : theme.color.accentBorder};
  color: ${({ theme, active }) => active ? theme.color.text : theme.color.textMuted};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base},
              color ${({ theme }) => theme.motion.base},
              transform ${({ theme }) => theme.motion.base},
              box-shadow ${({ theme }) => theme.motion.base};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.elevation[1]};

  .count {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.8;
    font-weight: 500;
  }

  &:hover {
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme, active }) => active ? theme.color.accent : theme.color.surfaceHover};
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.elevation[2]};
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  align-items: start;
  gap: 2rem;
  margin: 4rem auto 6rem;
  width: 100%;
  max-width: 1400px;
  padding: 0 ${({ theme }) => theme.sectionPadding.inline};
`;

const MemberCard = styled(motion.div)`
  width: 100%;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.elevation[1]};
  padding: 0;
  overflow: hidden;
  transition: transform ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base},
              box-shadow ${({ theme }) => theme.motion.base};
  position: relative;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    box-shadow: ${({ theme }) => theme.elevation[2]}, 0 0 32px ${({ theme }) => theme.color.accentGlow};
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
  background: ${({ theme }) => theme.color.surfaceHover};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 25%;
    transition: transform ${({ theme }) => theme.motion.base};
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
  background: ${({ theme }) => theme.color.accentWash};
  border-radius: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.color.accentBorder};

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
  transition: color ${({ theme }) => theme.motion.base};

  ${MemberCard}:hover & {
    color: ${({ theme }) => theme.color.accent};
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
  color: ${({ theme }) => theme.color.accent};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
  line-height: 1.5;

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
  color: ${({ theme }) => theme.color.textMuted};
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.fast},
              background ${({ theme }) => theme.motion.fast},
              border-color ${({ theme }) => theme.motion.fast},
              opacity ${({ theme }) => theme.motion.fast},
              transform ${({ theme }) => theme.motion.fast};
  background: rgba(0, 0, 0, 0.55);
  opacity: 0.85;
  border: 1px solid ${({ theme }) => theme.color.border};
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
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.accentDeep};
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-2px);
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
  { id: 52, image: vatsalImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/vatsal-maheshwari-m30/", twitter: "https://x.com/blackopps16666" } },
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

const PeopleTeam = () => {
  const [activeFilters, setActiveFilters] = useState(new Set());

  // Memoize team organization to ensure consistent sorted order during session
  // Sort by FIRST name (then last name as tie-breaker)
  const teamMembers = useMemo(() => {
    const sortByName = (members) => {
      return [...members].sort((a, b) => {
        const [firstA = '', ...restA] = formatName(a.name, a.image).toLowerCase().split(/\s+/).filter(Boolean);
        const [firstB = '', ...restB] = formatName(b.name, b.image).toLowerCase().split(/\s+/).filter(Boolean);

        const firstCmp = firstA.localeCompare(firstB);
        if (firstCmp !== 0) return firstCmp;

        // Tie-breaker: compare the remaining parts (last name, etc.) for stable ordering
        const lastA = restA.join(' ');
        const lastB = restB.join(' ');
        return lastA.localeCompare(lastB);
      });
    };

    const allSorted = sortByName(allTeamMembersUnsorted);
    const executiveSorted = sortByName(allTeamMembersUnsorted.filter(m => m.category === "executive"));

    return {
      all: allSorted,
      executive: executiveSorted,
      developer: sortByName(allTeamMembersUnsorted.filter(m => m.category === "developer")),
      research: sortByName(allTeamMembersUnsorted.filter(m => m.category === "research")),
      operations: sortByName(allTeamMembersUnsorted.filter(m => m.category === "operations"))
    };
  }, []); // Empty dependency array means this only runs once on mount

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
    : allTeamMembersUnsorted
        .filter(member => activeFilters.has(member.category))
        .sort((a, b) => {
          const [firstA = '', ...restA] = formatName(a.name, a.image).toLowerCase().split(/\s+/).filter(Boolean);
          const [firstB = '', ...restB] = formatName(b.name, b.image).toLowerCase().split(/\s+/).filter(Boolean);

          const firstCmp = firstA.localeCompare(firstB);
          if (firstCmp !== 0) return firstCmp;

          const lastA = restA.join(' ');
          const lastB = restB.join(' ');
          return lastA.localeCompare(lastB);
        });

  return (
    <PageSection>
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
                  delay: Math.min(index, 8) * 0.04,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <ImageContainer>
                  {member.image ? (
                     <img
                       src={member.image}
                       alt={formatName(null, member.image)}
                       width="400"
                       height="400"
                       loading="lazy"
                     />
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
                      <LinkedIn width={14} height={14} />
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
    </PageSection>
  );
};

export default PeopleTeam;
