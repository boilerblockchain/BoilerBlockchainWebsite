import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
const BBLogo = '/images/logos/boiler_blockchain_logo_svg.webp';
import Discord from "../Icons/Discord";
import Instagram from "../Icons/Instagram";
import Twitter from "../Icons/Twitter";
import Medium from "../Icons/Medium";
import Github from "../Icons/Github";
import LinkedIn from "../Icons/LinkedIn";

const FooterContainer = styled.footer`
  width: 100%;
  margin-top: auto;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  background: ${({ theme }) => theme.color.black};
  border-top: 1px solid ${({ theme }) => theme.color.border};
  padding-block: ${({ theme }) => theme.space[16]} ${({ theme }) => theme.space[8]};
  padding-inline: ${({ theme }) => theme.sectionPadding.inline};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[10]};
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-inline: auto;
  margin-bottom: ${({ theme }) => theme.space[12]};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[16]};
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  max-width: 400px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  overflow: visible;

  img {
    width: 110px;
    height: auto;
    max-height: 45px;
    max-width: 110px;
    object-fit: contain;
  }
`;

const LogoText = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
`;

const LogoDescription = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
`;

const SocialLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  list-style: none;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  line-height: 0;
  color: ${({ theme }) => theme.color.textMuted};
  transition: color ${({ theme }) => theme.motion.base};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.space[8]};

  ${({ theme }) => theme.media.lg} {
    justify-content: end;
  }
`;

const FooterSection = styled.div`
  min-width: 0;
`;

const SectionTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
`;

const FooterLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const FooterLink = styled(Link)`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.color.textMuted};
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.base};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const BottomBar = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-inline: auto;
  padding-top: ${({ theme }) => theme.space[8]};
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;

const Copyright = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.color.textFaint};
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <LeftSection>
          <LogoContainer>
            <LogoBox>
              <img
                src={BBLogo}
                alt="Boiler Blockchain Logo"
                width="110"
                height="45"
                loading="lazy"
              />
            </LogoBox>
            <LogoText>Boiler Blockchain</LogoText>
          </LogoContainer>
          <LogoDescription>
            Bringing Purdue Onchain.
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
                href="https://discord.gg/vNwXZ39vmG"
              target="_blank"
              rel="noopener noreferrer"
                aria-label="Discord"
            >
                <Discord width={20} height={20} />
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
            <SectionTitle>Resources</SectionTitle>
            <FooterLinks>
              <li>
                <FooterLink to="/courses/technical">Technical Course</FooterLink>
              </li>
              <li>
                <FooterLink to="/partners">Partners</FooterLink>
              </li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Connect</SectionTitle>
            <FooterLinks>
              <li>
                <FooterLink to="/people/team">The Team</FooterLink>
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
      </BottomBar>
    </FooterContainer>
  );
}
