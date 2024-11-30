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
    <section className="min-h-screen w-full bg-black flex flex-col justify-center items-center relative overflow-hidden">
      <div className="w-4/5 h-full mx-auto flex justify-center items-center lg:flex-row flex-col mb-24 mt-12">
        {/* Left side - Carousel */}
        <div className="w-1/2 pt-6 min-h-[60vh] flex flex-col justify-center items-center">
          <Suspense fallback={<LoadingSpinner />}>
            <AutoScrollCarousel />
          </Suspense>
        </div>
        
        <div className="w-1/2 min-h-[60vh] flex flex-col justify-center items-center px-8">
          <h2 className="text-3xl md:text-4xl lg:text-4xl text-white self-start w-4/5 mx-auto lg:text-left text-center font-display">
            Who are we?
          </h2>
          
          <p className="text-base text-gray-400 self-start w-4/5 mx-auto mt-8 lg:text-left text-center font-mont">
            Boiler Blockchain is Purdue's leading student organization for blockchain technology. At Boiler Blockchain, you can take part in:
          </p>

          <ul className="w-4/5 mx-auto mt-4 text-gray-400 font-mont list-none">
            <li className="flex items-center mb-2">
              <span className="ml-3 mr-6"><BookOpen /></span>  Technical Courses
            </li>
            <li className="flex items-center mb-2">
              <span className="ml-3 mr-6"><Wrench /></span> Hackathons
            </li>
            <li className="flex items-center mb-2">
              <span className="ml-3 mr-6"><SearchCode /></span> Development Projects
            </li>
            <li className="flex items-center mb-2">
              <span className="ml-3 mr-6"><ChartLine /></span> Investments
            </li>
          </ul>

          <p className="text-gray-400 self-start w-4/5 mx-auto mt-6 font-mont lg:text-left text-center">
            Join our community and connect with like-minded peers. <a href="https://discord.com/invite/YdBH68uXUQ" target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-300">Join our Discord</a>.
          </p>

          <div className="w-4/5 mx-auto mt-10 flex lg:justify-start justify-center">
            <a href="/about" className="font-mont px-8 py-3 bg-purple-700 font-semibold text-black rounded-full hover:bg-gray-100 transition-colors duration-300">
              Learn More
            </a>
          </div>
        </div>
      </div>

    </section>
  );
};

export default About;
