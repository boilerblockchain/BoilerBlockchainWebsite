import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';


const CTASection = () => {
  return (
    <div className="bg-black text-white px-8 pt-24 pb-36">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-900/10 blur-3xl rounded-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-purple-900/10 to-purple-900/40 rounded-3xl p-12 backdrop-blur-sm border border-purple-700/30">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-700/10 rounded-full blur-xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h2 className="text-4xl font-display">
                  <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    Join Our Community
                  </span>
                </h2>
                
                <p className="text-gray-400 font-mont text-base max-w-xl">
                  Connect with 400+ fellow blockchain enthusiasts, get exclusive updates, and access specialized resources in our growing Discord community.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://discord.gg/hnjtVpb9H5"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 font-mont px-8 py-4 bg-purple-700 text-white rounded-full hover:bg-purple-600 transition-colors duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Join Discord</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                
                <a
                  href="#contact"
                  className="group flex items-center gap-2 font-mont px-8 py-4 border border-purple-700/50 text-purple-400 rounded-full hover:bg-purple-700/10 transition-colors duration-300"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;