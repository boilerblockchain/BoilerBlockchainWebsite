import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import Logo from "./Logo";

const Navigation = () => {
  const ref = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header ref={ref}>
      <div className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800/50'
        : 'bg-transparent'
        }`}>
        <div className="container flex items-center justify-between pl-8 pt-6 pb-4 mx-auto">
          <div className="flex items-center">
            <a
              href="#home"
              className="text-zinc-300 hover:text-zinc-100"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('home');
              }}
            >
              <Logo />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-between gap-8 pr-6">
            {['About', 'Courses', 'Devs'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-zinc-400 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;