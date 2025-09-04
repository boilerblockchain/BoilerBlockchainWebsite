import React, { Suspense } from 'react';
import { AutoScrollCarousel } from '../carousel_temp';
import { BookOpen, SearchCode, Wrench, ChartLine } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
  </div>
);

const About = () => {
  return (
    <section id="about" className="min-h-screen w-full bg-black flex flex-col justify-center items-center relative overflow-hidden">
      <div className="w-full md:w-4/5 h-full mx-auto flex flex-col lg:flex-row justify-center items-center gap-8 px-4 md:px-0 py-12">
        {/* Carousel Section - Left on desktop, bottom on mobile */}
        <div className="w-full lg:w-1/2 min-h-[40vh] lg:min-h-[70vh] flex flex-col justify-center items-center order-2 lg:order-1">
          <Suspense fallback={<LoadingSpinner />}>
            <div className="w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-full px-4">
              <AutoScrollCarousel />
            </div>
          </Suspense>
        </div>

        {/* Content Section - Right on desktop, top on mobile */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-4 order-1 lg:order-2">
          <h2 className="text-3xl md:text-4xl text-white w-full text-left font-display mb-6">
            Who are we?
          </h2>

          <p className="text-base text-gray-400 w-full text-left font-mont mb-6">
            Boiler Blockchain is Purdue's leading student organization for blockchain technology. At Boiler Blockchain, you can take part in:
          </p>

          <ul className="w-full text-gray-400 font-mont list-none mb-6">
            <li className="flex items-center mb-4">
              <span className="mr-4"><BookOpen className="w-5 h-5" /></span>
              <span>Technical Courses</span>
            </li>
            <li className="flex items-center mb-4">
              <span className="mr-4"><Wrench className="w-5 h-5" /></span>
              <span>Hackathons</span>
            </li>
            <li className="flex items-center mb-4">
              <span className="mr-4"><SearchCode className="w-5 h-5" /></span>
              <span>Development Projects</span>
            </li>
            <li className="flex items-center mb-4">
              <span className="mr-4"><ChartLine className="w-5 h-5" /></span>
              <span>Delegations and Investments</span>
            </li>
          </ul>

          <p className="text-gray-400 w-full text-left font-mont mb-6">
            Join our community and connect with like-minded peers. <a href="https://discord.gg/hnjtVpb9H5" target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-300">Join our Discord</a>.
          </p>

          <div className="w-full">
            <a href="/about" className="inline-block font-mont px-8 py-3 bg-purple-700 font-semibold text-black rounded-full hover:bg-gray-100 transition-colors duration-300">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
