import React, { useEffect, useState, useRef } from 'react';

const CoursesSection = () => {
  const TOTAL_STUDENTS = 150;
  const [countStudents, setCountStudents] = useState(0);
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
        threshold: 0.2,
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
    const duration = 3000;
    const steps = 50;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep <= steps) {
        const progress = currentStep / steps;
        setCountStudents(Math.floor(TOTAL_STUDENTS * progress));
      } else {
        clearInterval(interval);
      }
    }, stepTime);
  };

  return (
    <div className="bg-black text-white px-8 pb-28" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Enhanced Student Counter */}
          <div className="relative">
            <div className="absolute inset-0 bg-purple-900/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-purple-900/40 to-purple-900/10 rounded-3xl p-12 backdrop-blur-sm border border-purple-700/20">
              <div className="flex flex-col items-center space-y-6">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-700/10 rounded-full blur-xl"></div>
                
                {/* Counter Content */}
                <div className="relative">
                  <div className="text-7xl font-display bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {countStudents}+
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                </div>
                
                <div className="text-xl text-gray-300 font-mont tracking-wide">
                  Students Empowered
                </div>
                
                {/* Additional Stats */}
                <div className="pt-8 grid grid-cols-2 gap-8 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-display text-purple-400">16</div>
                    <div className="text-sm text-gray-400 font-mont">Weeks Course</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-display text-purple-400">4</div>
                    <div className="text-sm text-gray-400 font-mont">Credits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Course Description */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="text-purple-500 font-mont text-sm tracking-wider uppercase pt-4">Our Courses</div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-display">
                <a className="text-white transition-colors duration-300">
                  Principles and Practices of Blockchain (Technical)
                </a>
              </h2>
              <p className="text-gray-400 font-mont text-base leading-relaxed">
                This course provides a comprehensive, hands-on overview of blockchain technology
                and decentralized applications from a developer's perspective. From basic cryptography
                concepts and blockchain use cases to the latest developments in the technical field,
                this course equips students with the necessary skills and tools to pursue opportunities
                in technology.
              </p>
              <div className="pt-8">
                <a
                  href="https://www.eventreg.purdue.edu/ec2k/courselisting.aspx?1=%20&master_ID=6311%20&course_area=1285%20&course_number=130%20&course_subtitle=00"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mont px-8 py-3 bg-purple-700 font-semibold text-black rounded-full hover:bg-gray-100 transition-colors duration-300"
                  >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;