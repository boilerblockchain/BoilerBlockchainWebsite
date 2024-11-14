import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { HackathonCarousel } from '../hackathons_carousel.js';

const HackathonSummary = () => {
  const TOTAL_HACKATHONS = 11;
  const TOTAL_PRIZES = 15;
  const ESTIMATED_PRIZE_VALUE = 25000;

  const [countHackathons, setCountHackathons] = useState(0);
  const [countPrizes, setCountPrizes] = useState(0);
  const [countValue, setCountValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          startCountAnimation();
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated]);

  const startCountAnimation = () => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;

    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      
      if (currentStep <= steps) {
        const progress = currentStep / steps;
        setCountHackathons(Math.floor(TOTAL_HACKATHONS * progress));
        setCountPrizes(Math.floor(TOTAL_PRIZES * progress));
        setCountValue(Math.floor(ESTIMATED_PRIZE_VALUE * progress));
      } else {
        clearInterval(interval);
      }
    }, stepTime);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-display mb-8">Hackathon Highlights</h1>
            <p className="text-gray-400 font-mont text-base">
              From ETH SF to ETH Denver, our journey through the blockchain hackathon
              ecosystem has been marked by innovation and success. Our projects span
              across educational platforms, social impact initiatives, and cutting-edge
              DeFi solutions.
            </p>
            <p className="text-gray-400 font-mont text-base">
              Notable achievements include awards from industry leaders like Scroll,
              The Graph, and XMTP, demonstrating our technical excellence and
              innovative approach to blockchain challenges.
            </p>
            <div className="pt-10">
                <a href="/hackathons" className="font-mont px-8 py-3 bg-purple-700 font-semibold text-black rounded-full hover:bg-gray-100 transition-colors duration-300">
                View all Projects
                </a>
            </div>
          </div>

          {/* Right Column - Statistics */}
          <div className="grid grid-cols-1 gap-8">
            {/* Hackathons Count */}
            <div className="bg-purple-900/35 p-8 mr-64 rounded-2xl">
              <div className="text-4xl font-display mb-2 ml-2">{countHackathons}+</div>
              <div className="text-gray-400 font-mont ml-2">Hackathons Participated</div>
            </div>

            {/* Prizes Count */}
            <div className="bg-purple-900/35 p-8 mr-44 rounded-2xl">
              <div className="text-4xl font-display mb-2 ml-2">{countPrizes}+</div>
              <div className="text-gray-400 font-mont ml-2">Prizes Won</div>
            </div>

            {/* Prize Value */}
            <div className="bg-purple-900/35 p-8 mr-24 rounded-2xl">
              <div className="text-4xl font-display mb-2 ml-2">${countValue.toLocaleString()}+</div>
              <div className="text-gray-400 font-mont ml-2">In Prize Value</div>
            </div>
          </div>
        </div>
      </div>
      {/* Add HackathonCarousel inside the main container */}
      <div className="w-full mt-16">
        <HackathonCarousel />
      </div>
    </div>
  );
};

export default HackathonSummary;