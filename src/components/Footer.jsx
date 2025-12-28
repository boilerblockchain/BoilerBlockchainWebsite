import React from 'react';
import styled from 'styled-components';
import Discord from "../Icons/Discord";
import Instagram from "../Icons/Instagram";
import Twitter from "../Icons/Twitter";
import LinkedIn from "../Icons/LinkedIn";
import Medium from "../Icons/Medium";
import Github from "../Icons/Github";

const FooterContainer = styled.footer`
  width: 100%;
  background: #000000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const SocialLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    background: rgba(113, 32, 176, 0.2);
    border-color: rgba(113, 32, 176, 0.5);
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 500;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          &copy; {new Date().getFullYear()} Boiler Blockchain
        </Copyright>
        <SocialLinks>
          <li>
            <SocialLink
              href="https://discord.gg/hnjtVpb9H5"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <Discord />
            </SocialLink>
          </li>
          <li>
            <SocialLink
              href="https://www.instagram.com/boilerblockchain/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram />
            </SocialLink>
          </li>
          <li>
            <SocialLink
              href="https://twitter.com/boilerchain"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter />
            </SocialLink>
          </li>
          <li>
            <SocialLink
              href="https://www.linkedin.com/company/boilerblockchain/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedIn />
            </SocialLink>
          </li>
          <li>
            <SocialLink
              href="https://boilerblockchain.medium.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Medium"
            >
              <Medium />
            </SocialLink>
          </li>
          <li>
            <SocialLink
              href="https://github.com/boilerblockchain/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
            >
              <Github />
            </SocialLink>
          </li>
        </SocialLinks>
      </FooterContent>
    </FooterContainer>
  );
}
