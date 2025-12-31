import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiInstagram, FiLinkedin } from 'react-icons/fi';
import Discord from '../../Icons/Discord';
import Twitter from '../../Icons/Twitter';
import Medium from '../../Icons/Medium';
import Github from '../../Icons/Github';
import Navigation from '../Navigation';
import Footer from '../Footer';


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
  margin: 0 auto;
  padding: 120px 2rem 4rem;
  position: relative;
  z-index: 2;
  flex: 1;
  
  @media (max-width: 1024px) {
    width: 95%;
    padding: 110px 1.75rem 3.5rem;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 100px 1.5rem 3rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1rem 2rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const InfoCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: fit-content;
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

const CardHeader = styled.div`
  margin-bottom: 2rem;
`;

const InfoTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #ffffff;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const InfoSubtitle = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.6;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const InfoText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  padding-top: 0.25rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  padding-top: 0.25rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.125rem;
    text-decoration: none;
    transition: all 0.3s ease;
    
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      
      path {
        fill: currentColor;
      }
    }
    
    &:hover {
      border-color: #7120b0;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 0 0 3px rgba(113, 32, 176, 0.1), 0 0 20px rgba(113, 32, 176, 0.2);
      background: rgba(20, 20, 20, 0.95);
    }
  }
`;

const FormCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: fit-content;
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
    return 'Send Message';
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
            <CardHeader>
              <InfoTitle>Connect with Boiler Blockchain</InfoTitle>
              <InfoSubtitle>Establish a link with our team</InfoSubtitle>
            </CardHeader>
            
            <InfoSection>
              <InfoLabel>Weekly Meeting</InfoLabel>
              <InfoText>
                Boiler Blockchain Weekly Meeting<br />
                Thursdays · 7–8 PM EST<br />
                Armory 101 (AR 101)
              </InfoText>
            </InfoSection>

            <InfoSection>
              <InfoLabel>Follow Us</InfoLabel>
              <SocialIcons>
                <a href="https://twitter.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <Twitter width={20} height={20} />
                </a>
                <a href="https://instagram.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FiInstagram />
                </a>
                <a href="https://discord.gg/hnjtVpb9H5" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                  <Discord width={20} height={20} />
                </a>
                <a href="https://linkedin.com/company/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
                <a href="https://boilerblockchain.medium.com/" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                  <Medium width={20} height={20} />
                </a>
                <a href="https://github.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github width={20} height={20} />
                </a>
              </SocialIcons>
            </InfoSection>
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
                  placeholder="Tell us what you're building :)"
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
