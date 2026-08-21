import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LinkedIn from '../../Icons/LinkedIn';
import Twitter from '../../Icons/Twitter';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  Lead,
} from '../ui/primitives';

// Executive Board
const eliImage = '/images/pfps/exec/eli_dubizh.webp';
const joeyImage = '/images/pfps/exec/joey_kokinda.webp';
const neenaImage = '/images/pfps/exec/neena_naikar.webp';
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

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h1};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[4]};

  span {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const FilterNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

/* `$active` is transient: styled-components strips it instead of forwarding it
   to the underlying <button>, which is what React was warning about. */
const FilterButton = styled(motion.button)`
  padding: 0.7rem 1.25rem;
  min-height: 44px;
  background: ${({ theme, $active }) =>
    $active ? theme.color.accentDeep : 'transparent'};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.color.accentDeep : theme.color.border};
  color: ${({ theme, $active }) =>
    $active ? theme.color.text : theme.color.textMuted};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.none};
  transition: background ${({ theme }) => theme.motion.base},
    border-color ${({ theme }) => theme.motion.base},
    color ${({ theme }) => theme.motion.base};

  &:hover {
    color: ${({ theme }) => theme.color.text};
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const TeamRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  align-items: start;
  gap: ${({ theme }) => theme.space[6]};
`;

const MemberCard = styled(motion.div)`
  position: relative;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.none};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.motion.base},
    transform ${({ theme }) => theme.motion.base};

  &:hover {
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-3px);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 25%;
  }
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textFaint};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;

  &::before {
    content: 'BB';
  }
`;

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.space[5]};
`;

const MemberName = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1.25;
  color: ${({ theme }) => theme.color.text};
`;

const MemberTitle = styled.p`
  margin-top: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
`;

const SocialIconsContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space[2]};
  right: ${({ theme }) => theme.space[2]};
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  z-index: 2;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: ${({ theme }) => theme.color.textMuted};
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.none};
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.fast},
    border-color ${({ theme }) => theme.motion.fast};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
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
// Example: { id: 1, image: eliImage, category: "executive", title: "Advisor", socials: {...} }
// If no "title" is provided, it will default to the team name (e.g., "Executive Board", "Developer Team")
const allTeamMembersUnsorted = [
  // Executive Board
  { id: 1, image: eliImage, category: "executive", title: "Advisor", socials: { linkedin: "https://www.linkedin.com/in/eli-dubizh/", twitter: "https://x.com/EliDubizh" } },
  { id: 2, image: joeyImage, category: "executive", title: "Chief Degen Officer", socials: { linkedin: "https://www.linkedin.com/in/jkokinda", twitter: "https://x.com/sp3ked" } },
  { id: 3, image: neenaImage, category: "executive", title: "Co-President", socials: { linkedin: "https://www.linkedin.com/in/neena-naikar/", twitter: "https://x.com/neenanaikar" } },
  { id: 5, image: siyaImage, category: "executive", title: "Co-President", socials: { linkedin: "https://www.linkedin.com/in/siya-jariwala", twitter: "https://x.com/siyasiyasiyaaa" } },
  { id: 6, image: adityaImage, category: "developer", socials: { linkedin: "https://www.linkedin.com/in/aditya-kuniyil-kattil/", twitter: "https://x.com/iamadityakk?s=21&t=Aw27j3VM8u8ewB9mb4Ga-w" } },
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
  { id: 40, image: anubhutiImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/anubhutimittal/", twitter: "https://x.com/anu_m03?s=11" } },
  { id: 41, image: emilyImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/emilyxizhang", twitter: "https://x.com/zhangemily_?s=11&t=VK1kWg_xbZkHBnzoe87yAw" } },
  { id: 42, image: jacobImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/jacobgutwein27/", twitter: "https://x.com/jacob6gutwein" } },
  { id: 43, image: sahilImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/sahil-shk", twitter: "https://x.com/sasasenor" } },
  { id: 44, image: shariqImage, category: "operations", socials: { linkedin: "http://linkedin.com/in/shariq-kapadia", twitter: "https://x.com/KapadiaShariq" } },
  { id: 45, image: garvImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/garv-tayade/", twitter: "https://x.com/0xgt_27" } },
  { id: 46, image: mugdhaImage, category: "operations", title: "External Dev Lead", socials: { linkedin: "https://www.linkedin.com/in/mugdhadpatil/", twitter: "https://x.com/mugdhapatil17?s=21" } },
  { id: 47, image: shivamImage, category: "operations", socials: { linkedin: "http://linkedin.com/in/rastog18", twitter: "https://x.com/rastog1800" } },
  { id: 48, image: mahiImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/mahi-tripathi", twitter: "https://x.com/mahi_tripathii" } },
  { id: 49, image: akashImage, category: "operations", title: "Internal Dev Lead", socials: { linkedin: "https://www.linkedin.com/in/the-akash-mishra/", twitter: "https://x.com/Akash_Mishra3" } },
  { id: 50, image: pradyumnImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/pradyumn-malik/", twitter: "https://x.com/MalikPradyumn" } },
  { id: 51, image: alexImage, category: "operations", socials: { linkedin: "https://www.linkedin.com/in/belangeralexander/", twitter: "https://x.com/thedcfguy" } }
];

const PeopleTeam = () => {
  const [activeFilters, setActiveFilters] = useState(new Set());

  /**
   * Display order, computed once per page load.
   *
   * Executive board first, ranked by role rather than by name, then everyone
   * else shuffled. The shuffle lives in a useMemo with an empty dependency
   * array so toggling a filter re-renders against the same order instead of
   * dealing a new one and making every card jump.
   */
  const orderedMembers = useMemo(() => {
    /* Fisher-Yates on a copy. Never sort/shuffle the module-level array in
       place: it is shared across every mount and navigation. */
    const shuffle = (members) => {
      const result = [...members];
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    /* Only these roles are ranked. Everything else on the board is peer level,
       so it gets shuffled with the rest of the exec block. */
    const execRoleOrder = ['Co-President'];

    const isExecutive = (member) => member.category === 'executive';

    const executives = allTeamMembersUnsorted.filter(isExecutive);
    /* filter, not find: a role can be held by more than one person (there are
       two Co-Presidents), and find would silently drop all but the first.
       Same-rank holders are shuffled so neither is permanently listed first. */
    const ranked = execRoleOrder.flatMap((role) =>
      shuffle(executives.filter((member) => member.title === role)),
    );
    const rankedIds = new Set(ranked.map((member) => member.id));
    const remainingExecutives = shuffle(
      executives.filter((member) => !rankedIds.has(member.id)),
    );

    const everyoneElse = shuffle(
      allTeamMembersUnsorted.filter((member) => !isExecutive(member)),
    );

    return [...ranked, ...remainingExecutives, ...everyoneElse];
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

  /* Filtering only removes members, so the order above carries into every
     filtered view unchanged. */
  const displayedMembers = activeFilters.size === 0
    ? orderedMembers
    : orderedMembers.filter((member) => activeFilters.has(member.category));

  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container $wide>
        <Head>
          <Eyebrow>Who we are</Eyebrow>
          <Title>
            OUR <span>TEAM</span>
          </Title>
          <Lead>
            Meet the passionate individuals who lead and drive innovation at
            Boiler Blockchain
          </Lead>
        </Head>

        <FilterNav>
          {filters.map((filter) => {
            const isActive = activeFilters.has(filter.id);
            return (
              <FilterButton
                key={filter.id}
                $active={isActive}
                aria-pressed={isActive}
                onClick={() => toggleFilter(filter.id)}
                whileTap={{ scale: 0.97 }}
              >
                <span>{filter.label}</span>
              </FilterButton>
            );
          })}
        </FilterNav>

        <AnimatePresence mode="wait">
          <TeamRow
            key={Array.from(activeFilters).sort().join(',') || 'all'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {displayedMembers.map((member) => (
              <MemberCard key={member.id}>
                <ImageContainer>
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={formatName(null, member.image)}
                      width="400"
                      height="400"
                      loading="lazy"
                    />
                  ) : (
                    <PlaceholderIcon />
                  )}
                  <SocialIconsContainer>
                    <SocialIcon
                      aria-label={`${formatName(member.name, member.image)} on LinkedIn`}
                      href={member.socials?.linkedin && member.socials.linkedin !== "#" ? member.socials.linkedin : "#"}
                      target={member.socials?.linkedin && member.socials.linkedin !== "#" ? "_blank" : undefined}
                      rel={member.socials?.linkedin && member.socials.linkedin !== "#" ? "noopener noreferrer" : undefined}
                    >
                      <LinkedIn width={14} height={14} />
                    </SocialIcon>
                    <SocialIcon
                      aria-label={`${formatName(member.name, member.image)} on X`}
                      href={member.socials?.twitter && member.socials.twitter !== "#" ? member.socials.twitter : "#"}
                      target={member.socials?.twitter && member.socials.twitter !== "#" ? "_blank" : undefined}
                      rel={member.socials?.twitter && member.socials.twitter !== "#" ? "noopener noreferrer" : undefined}
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
    </Section>
  );
};

export default PeopleTeam;
