import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import Logo from "./Logo";

const Navigation = () => {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 duration-200 border-b ${isIntersecting
          ? 'bg-zinc-900/0 border-transparent'
          : 'bg-zinc-900/50 border-zinc-800 backdrop-blur'
          }`}
      >
        <div className="container flex items-center justify-between pl-8 pt-6 pb-4 mx-auto">
          <div className="flex items-center">
            <a
              href="#home"
              className="text-zinc-300 hover:text-zinc-100 duration-200"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('home');
              }}
            >
              <Logo />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between gap-8 pr-6">
            {['About', 'Courses', 'Devs'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="duration-200 text-sans text-zinc-400 hover:text-white animate-fade-in"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="space-y-2">
              <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute w-full bg-zinc-900/95 backdrop-blur transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          <div className="container mx-auto py-4">
            {['About', 'Courses', 'Devs'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block py-3 px-6 text-zinc-400 hover:text-zinc-100"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
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