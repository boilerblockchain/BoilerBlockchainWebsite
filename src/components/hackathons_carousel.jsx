import React from 'react';
import ethSf22 from '../assets/logos/eth_sf_2022.png';
import pennBlockchain from '../assets/logos/penn_blockchain.jpg';
import ethDenver23 from '../assets/logos/eth_denver_2023.webp';
import scalingEth23 from '../assets/logos/scaling_eth_2023.png';
import ethOnline23 from '../assets/logos/ETHGlobal.png';
import ethNyc23 from '../assets/logos/eth_nyc_2023(1).png';
import ethDenver24 from '../assets/logos/eth_denver_2024.png';
import ethSf24 from '../assets/logos/eth_sf_2024.png';
import sui from '../assets/logos/sui.png';

// Hackathon data structure
const HACKATHONS = [
  { title: "ETH San Francisco '22", src: ethSf22 },
  { title: "Penn Blockchain", src: pennBlockchain },
  { title: "ETH Denver '23", src: ethDenver23 },
  { title: "Scaling ETH '23", src: scalingEth23 },
  { title: "ETH Online '23", src: ethOnline23 },
  { title: "ETH New York City '23", src: ethNyc23 },
  { title: "ETH Denver '24", src: ethDenver24 },
  { title: "ETH San Francisco '24", src: ethSf24 },
  { title: "SUI Network Grants", src: sui },
];

const CAROUSEL_HEIGHT = 80; // Main height control
const LOGO_MAX_HEIGHT = 80; // Maximum logo height

export const HackathonCarousel = () => {
  const duplicatedHackathons = [...HACKATHONS, ...HACKATHONS];

  return (
    <div className="flex justify-center bg-black p-8">
      <div 
        className="relative overflow-hidden bg-black"
        style={{ 
          width: '1960px',
          height: `${CAROUSEL_HEIGHT}px`
        }}
      >
        {/* Gradient Overlay - Left */}
        <div 
          className="absolute left-0 top-0 w-[200px] z-10 bg-gradient-to-r from-black to-transparent"
          style={{ height: `${CAROUSEL_HEIGHT}px` }}
        ></div>
        
        {/* Gradient Overlay - Right */}
        <div 
          className="absolute right-0 top-0 w-[200px] z-10 bg-gradient-to-l from-black to-transparent"
          style={{ height: `${CAROUSEL_HEIGHT}px` }}
        ></div>
        
        {/* Sliding Track */}
        <div className="flex animate-scroll">
          {duplicatedHackathons.map((hackathon, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 flex items-center justify-start gap-4 px-6"
              style={{ 
                width: '250px',
                height: `${CAROUSEL_HEIGHT}px`
              }}
            >
              {/* Logo Container */}
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{ 
                  width: `${LOGO_MAX_HEIGHT}px`,
                  height: `${LOGO_MAX_HEIGHT}px`
                }}
              >
                <img
                  src={hackathon.src}
                  alt={`${hackathon.title} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Title */}
              <div className="text-base font-medium text-gray-200 leading-tight flex-1 min-w-0">
                {hackathon.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add the custom animation to Tailwind
const style = document.createElement('style');
style.textContent = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-250px * ${HACKATHONS.length}))}
  }
  
  .animate-scroll {
    animation: scroll 40s linear infinite;
    width: calc(250px * ${HACKATHONS.length * 2});
  }
`;
document.head.appendChild(style);

export default HackathonCarousel;