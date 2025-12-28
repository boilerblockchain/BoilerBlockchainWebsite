import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import BBLogo from "../assets/Boiler_BLockchain_Logo_SVG.png";
import Discord from "../Icons/Discord";
import Instagram from "../Icons/Instagram";
import Twitter from "../Icons/Twitter";
import LinkedIn from "../Icons/LinkedIn";
import Medium from "../Icons/Medium";
import Github from "../Icons/Github";

const FooterContainer = styled.footer`
  width: 100%;
  background: rgba(0, 0, 0, 0.95);
  padding: 4rem 2rem 2rem;
  margin-top: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem 1.5rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 3rem;
  }

  @media (max-width: 768px) {
    gap: 2.5rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  max-width: 400px;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

const LogoText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
`;

const LogoDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
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
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  cursor: pointer;
  line-height: 0;
  width: 24px;
  height: 24px;

  &:hover {
    color: #7120b0;
    opacity: 0.9;
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
    flex-shrink: 0;
    
    path {
      fill: currentColor;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  gap: 3rem;
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 140px;
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-transform: none;
  letter-spacing: 0;
  font-family: system-ui, -apple-system, sans-serif;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
  font-family: system-ui, -apple-system, sans-serif;

  &:hover {
    color: #7120b0;
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 400;
  font-family: system-ui, -apple-system, sans-serif;
`;

const LegalLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
`;

const LegalLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: underline;
  font-size: 0.875rem;
  font-weight: 400;
  font-family: system-ui, -apple-system, sans-serif;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <LeftSection>
          <LogoContainer>
            <LogoBox>
              <img src={BBLogo} alt="Boiler Blockchain Logo" />
            </LogoBox>
            <LogoText>Boiler Blockchain</LogoText>
          </LogoContainer>
          <LogoDescription>
            Purdue's premier student-led organization dedicated to advancing blockchain technology through innovation, education, and community building.
          </LogoDescription>
          <SocialLinks>
            <li>
              <SocialLink
                href="https://twitter.com/boilerchain"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <Twitter width={20} height={20} />
              </SocialLink>
            </li>
            <li>
              <SocialLink
                href="https://www.instagram.com/boilerblockchain/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram width={20} height={20} />
              </SocialLink>
            </li>
            <li>
              <SocialLink
                href="https://www.linkedin.com/company/boilerblockchain/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedIn width={20} height={20} />
              </SocialLink>
            </li>
            <li>
              <SocialLink
                href="https://boilerblockchain.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
              >
                <Medium width={20} height={20} />
              </SocialLink>
            </li>
            <li>
              <SocialLink
                href="https://github.com/boilerblockchain/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
              >
                <Github width={20} height={20} />
              </SocialLink>
            </li>
          </SocialLinks>
        </LeftSection>

        <RightSection>
          <FooterSection>
            <SectionTitle>Teams</SectionTitle>
            <FooterLinks>
              <li>
                <FooterLink to="/teams/developer">Developer Team</FooterLink>
              </li>
              <li>
                <FooterLink to="/teams/research">Research Team</FooterLink>
              </li>
              <li>
                <FooterLink to="/teams/operations">Operations Team</FooterLink>
              </li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Courses</SectionTitle>
            <FooterLinks>
              <li>
                <FooterLink to="/courses/technical">Technical Course</FooterLink>
              </li>
              <li>
                <FooterLink to="/courses/non-technical">Non-Technical Course</FooterLink>
              </li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Connect</SectionTitle>
            <FooterLinks>
              <li>
                <FooterLink to="/people/team">Our Team</FooterLink>
              </li>
              <li>
                <FooterLink to="/partners">Partners</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Contact Us</FooterLink>
              </li>
            </FooterLinks>
          </FooterSection>
        </RightSection>
      </FooterContent>

      <BottomBar>
        <Copyright>
          &copy; {new Date().getFullYear()} Boiler Blockchain. All rights reserved.
        </Copyright>
        <LegalLinks>
          <LegalLink href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </LegalLink>
          <LegalLink href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </LegalLink>
          <LegalLink href="/cookies" target="_blank" rel="noopener noreferrer">
            Cookies Settings
          </LegalLink>
        </LegalLinks>
      </BottomBar>
    </FooterContainer>
  );
}
