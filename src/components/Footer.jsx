import React from 'react'
import Discord from "../Icons/Discord";
import Instagram from "../Icons/Instagram";
import Twitter from "../Icons/Twitter";
import LinkedIn from "../Icons/LinkedIn";
import Medium from "../Icons/Medium";
import Github from "../Icons/Github";

export default function Footer() {
  return (
    <footer>
      <div className="bg-purple-700 py-16 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Bottom area */}
          <div className="md:flex md:items-center md:justify-between">

            {/* Social links */}
            <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
              <li>
                <a
                  href="https://discord.gg/hnjtVpb9H5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-purple-600 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Discord"
                >
                  <Discord />
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://www.instagram.com/boilerblockchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-purple-600 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Instagram"
                >
                  <Instagram />
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://twitter.com/boilerchain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-purple-600 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Twitter"
                >
                  <Twitter />
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://www.linkedin.com/company/boilerblockchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-purple-600 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="LinkedIn"
                >
                  <LinkedIn />
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://boilerblockchain.medium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-purple-600 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Medium"
                >
                  <Medium />
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://github.com/boilerblockchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-purple-600 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Github"
                >
                  <Github />
                </a>
              </li>
            </ul>

            {/* Copyrights note */}
            <div className="text-gray-200 font-medium mr-4">
              &copy; Boiler Blockchain
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
