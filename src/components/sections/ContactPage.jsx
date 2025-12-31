import React, { useCallback, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiMail, FiMessageSquare, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiCalendar, FiRadio } from 'react-icons/fi';
import Navigation from '../Navigation';
import Footer from '../Footer';

// Animations
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(113, 32, 176, 0.3), 0 0 40px rgba(113, 32, 176, 0.1), inset 0 0 20px rgba(113, 32, 176, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(113, 32, 176, 0.5), 0 0 60px rgba(113, 32, 176, 0.2), inset 0 0 30px rgba(113, 32, 176, 0.15);
  }
`;

const scanlineSweep = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(800px);
    opacity: 0;
  }
`;

const gradientSweep = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const nodeDrift = keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, -10px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  75% {
    transform: translate(5px, 10px);
  }
`;

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 120px 2rem 0;
  position: relative;
  z-index: 2;
  flex: 1;
  
  @media (max-width: 1024px) {
    width: 95%;
    padding: 110px 1.75rem 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 100px 1.5rem 0;
    margin: 0 auto 3rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1rem 0;
    margin: 0 auto 2rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const InfoCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(113, 32, 176, 0.15) 0%, rgba(187, 32, 255, 0.1) 100%);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 16px;
  padding: 3rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: fit-content;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${pulseGlow} 4s ease-in-out infinite;

  /* Grid overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        to right,
        rgba(168, 85, 247, 0.03) 0,
        rgba(168, 85, 247, 0.03) 1px,
        transparent 1px,
        transparent 40px
      ),
      repeating-linear-gradient(
        to bottom,
        rgba(168, 85, 247, 0.03) 0,
        rgba(168, 85, 247, 0.03) 1px,
        transparent 1px,
        transparent 40px
      );
    pointer-events: none;
    z-index: 0;
  }

  /* Diagonal mesh overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(168, 85, 247, 0.02) 2px,
      rgba(168, 85, 247, 0.02) 4px
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Scanline effect */
  .scanline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(168, 85, 247, 0.6) 50%,
      transparent 100%
    );
    z-index: 1;
    pointer-events: none;
    animation: ${scanlineSweep} 10s linear infinite;
    will-change: transform;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(113, 32, 176, 0.5);
    box-shadow: 0 20px 60px rgba(113, 32, 176, 0.3);
  }

  @media (max-width: 768px) {
    padding: 2.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const CardHeader = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 2.5rem;
`;

const NodeStatus = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;
  z-index: 2;
`;

const StatusLine = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgba(168, 85, 247, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-family: 'Tomorrow', sans-serif;
  
  .status-online {
    color: rgba(34, 197, 94, 0.9);
    text-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  }
`;

const InfoTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
  letter-spacing: 0.3px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const InfoSubtitle = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  position: relative;
  z-index: 1;
`;

const InfoSection = styled.div`
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 1;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(113, 32, 176, 0.2);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  
  svg {
    color: #7120b0;
    font-size: 1.125rem;
  }
`;

const InfoLabel = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
`;

const InfoText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  margin-left: 2.75rem;
  
  a {
    color: #ffffff;
    text-decoration: none;
    font-family: 'Courier New', monospace;
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 20px rgba(113, 32, 176, 0.5);
    transition: all 0.2s ease;
    
    &:hover {
      filter: brightness(1.2);
      text-shadow: 0 0 30px rgba(113, 32, 176, 0.8);
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  margin-left: 2.75rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(20, 20, 20, 0.6);
    border: 1px solid rgba(113, 32, 176, 0.3);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.125rem;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      border-color: rgba(113, 32, 176, 0.6);
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(113, 32, 176, 0.4);
      
      &::before {
        opacity: 1;
      }
    }
  }
`;

const SessionHash = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 3rem;
  font-size: 0.6875rem;
  font-family: 'Courier New', monospace;
  color: rgba(168, 85, 247, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  z-index: 1;
  
  @media (max-width: 768px) {
    left: 2.5rem;
    bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    left: 2rem;
    bottom: 1rem;
    font-size: 0.625rem;
  }
`;

const FormCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  color: #ffffff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(113, 32, 176, 0.3);
  }

  @media (max-width: 768px) {
    padding: 2.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem 1.125rem;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-family: 'Tomorrow', sans-serif;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #7120b0;
    box-shadow: 0 0 0 3px rgba(113, 32, 176, 0.1), 0 0 20px rgba(113, 32, 176, 0.2);
    background: rgba(20, 20, 20, 0.95);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 1rem 1.125rem;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-family: 'Tomorrow', sans-serif;
  min-height: 140px;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #7120b0;
    box-shadow: 0 0 0 3px rgba(113, 32, 176, 0.1), 0 0 20px rgba(113, 32, 176, 0.2);
    background: rgba(20, 20, 20, 0.95);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(113, 32, 176, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #7a30c0 0%, #c430ff 100%);
    box-shadow: 0 6px 25px rgba(113, 32, 176, 0.5);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [particleKey, setParticleKey] = useState(Date.now());

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('establishing');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitStatus('confirmed');

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitStatus(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    }, 3000);
  };

  const getButtonText = () => {
    if (submitStatus === 'establishing') return 'Establishing connection...';
    if (submitStatus === 'confirmed') return 'Connection confirmed.';
    return 'Open Channel';
  };

  return (
    <PageSection>
      <Particles
        key={particleKey}
        init={particlesInit}
        options={{
          background: { color: "#000000" },
          particles: {
            color: { value: ["rgba(113, 32, 176, 0.2)", "rgba(187, 32, 255, 0.2)"] },
            links: {
              color: "rgba(113, 32, 176, 0.15)",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: { enable: true, speed: 0.3 },
            number: { value: 25 },
            opacity: { value: 0.3 },
            size: { value: 2 },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab"
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: { opacity: 0.3 }
              }
            }
          }
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      
      <Navigation />
      
      <Container>
        <ContentGrid>
          <InfoCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="scanline" />
            <CardHeader>
              <NodeStatus>
                <StatusLine>NODE: BB-CORE</StatusLine>
                <StatusLine className="status-online">STATUS: ONLINE</StatusLine>
              </NodeStatus>
              <InfoTitle>Connect to Boiler Blockchain</InfoTitle>
              <InfoSubtitle>Establish a link with our team.</InfoSubtitle>
            </CardHeader>
            
            <InfoSection>
              <InfoLabel>
                <SectionIcon>
                  <FiCalendar />
                </SectionIcon>
                Weekly Node Sync
              </InfoLabel>
              <InfoText>
                Boiler Blockchain Weekly Meeting<br />
                Thursdays · 7–8 PM EST<br />
                Armory 101 (AR 101)
              </InfoText>
            </InfoSection>

            <InfoSection>
              <InfoLabel>
                <SectionIcon>
                  <FiRadio />
                </SectionIcon>
                Direct Channel
              </InfoLabel>
              <InfoText>
                Reach the core team.<br />
                <a href="mailto:boilerblockchain@gmail.com">boilerblockchain@gmail.com</a>
              </InfoText>
            </InfoSection>

            <InfoSection>
              <InfoLabel>
                <SectionIcon>
                  <FiMessageSquare />
                </SectionIcon>
                Network Endpoints
              </InfoLabel>
              <SocialIcons>
                <a href="https://facebook.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FiFacebook />
                </a>
                <a href="https://linkedin.com/company/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
                <a href="https://instagram.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FiInstagram />
                </a>
                <a href="https://twitter.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FiTwitter />
                </a>
              </SocialIcons>
            </InfoSection>

            <SessionHash>SESSION HASH: 0xA7F9...C12E</SessionHash>
          </InfoCard>

          <FormCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <FormInput
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <FormInput
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  placeholder="Tell us what you're building / what you need"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting || submitStatus === 'confirmed'}>
                {getButtonText()}
              </SubmitButton>
            </form>
          </FormCard>
        </ContentGrid>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default ContactPage;
