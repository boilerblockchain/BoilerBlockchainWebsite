import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #000000;
  color: #ffffff;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  padding: 120px 2rem 4rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 2rem;

  .gradient-text {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    color: #ffffff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(113, 32, 176, 0.4);
    }
  }

  &.secondary {
    background: transparent;
    color: #7120b0;
    border: 2px solid #7120b0;

    &:hover {
      background: rgba(113, 32, 176, 0.1);
    }
  }
`;

const Section = styled.section`
  width: 100%;
  padding: 6rem 2rem;
  background: #000000;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;

  .gradient-text {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 3rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const Card = styled.div`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(113, 32, 176, 0.3);
    background: rgba(15, 15, 15, 0.85);

    &::before {
      opacity: 1;
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: 0.3px;
  line-height: 1.3;
`;

const CardText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  letter-spacing: 0.2px;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const TextContent = styled.div`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;

  p {
    margin-bottom: 1.5rem;
  }
`;

const Home = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroSubtitle>Purdue University</HeroSubtitle>
          <HeroTitle>
            Boiler <span className="gradient-text">Blockchain</span>
          </HeroTitle>
          <HeroDescription>
            Purdue's premier student-led organization dedicated to advancing blockchain technology through innovation, education, and community building.
          </HeroDescription>
          <ButtonGroup>
            <Button to="/about" className="primary">
              Learn More
            </Button>
            <Button to="/contact" className="secondary">
              Contact Us
            </Button>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      {/* Who We Are Section */}
      <Section>
        <Container>
          <SectionTitle>
            Who <span className="gradient-text">We Are</span>
          </SectionTitle>
          <SectionDescription>
            Boiler Blockchain is Purdue's leading student organization for blockchain technology, empowering students through education, innovation, and community.
          </SectionDescription>
          <TwoColumn>
            <TextContent>
              <p>
                At Boiler Blockchain, we provide comprehensive educational programs, hands-on development opportunities, and a vibrant community for students passionate about blockchain technology.
              </p>
              <p>
                Our mission is to bridge the gap between academic learning and real-world blockchain applications, preparing students for careers in the rapidly evolving Web3 ecosystem.
              </p>
            </TextContent>
            <div>
              <Card>
                <CardTitle>Technical Courses</CardTitle>
                <CardText>
                  Comprehensive 16-week courses covering blockchain fundamentals, smart contract development, and decentralized applications.
                </CardText>
              </Card>
            </div>
          </TwoColumn>
        </Container>
      </Section>

      {/* What We Do Section */}
      <Section style={{ background: '#0a0a0a' }}>
        <Container>
          <SectionTitle>
            What <span className="gradient-text">We Do</span>
          </SectionTitle>
          <SectionDescription>
            We provide comprehensive programs and opportunities for students passionate about blockchain technology.
          </SectionDescription>
          <Grid>
            <Card>
              <CardTitle>Educational Courses</CardTitle>
              <CardText>
                Comprehensive technical and non-technical courses designed to empower students with blockchain knowledge and practical skills.
              </CardText>
            </Card>
            <Card>
              <CardTitle>Development Projects</CardTitle>
              <CardText>
                Hands-on experience building real-world blockchain applications, smart contracts, and decentralized systems.
              </CardText>
            </Card>
            <Card>
              <CardTitle>Community Building</CardTitle>
              <CardText>
                Connect with like-minded peers, industry professionals, and blockchain enthusiasts in a supportive environment.
              </CardText>
            </Card>
            <Card>
              <CardTitle>Hackathon Participation</CardTitle>
              <CardText>
                Compete in premier blockchain hackathons, win prizes, and showcase innovative solutions to industry leaders.
              </CardText>
            </Card>
            <Card>
              <CardTitle>Research Initiatives</CardTitle>
              <CardText>
                Contribute to cutting-edge blockchain research, exploring new protocols, consensus mechanisms, and applications.
              </CardText>
            </Card>
            <Card>
              <CardTitle>Industry Partnerships</CardTitle>
              <CardText>
                Collaborate with leading blockchain companies and organizations to drive innovation and create opportunities.
              </CardText>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Achievements Section */}
      <Section>
        <Container>
          <SectionTitle>
            Our <span className="gradient-text">Achievements</span>
          </SectionTitle>
          <SectionDescription>
            From ETH SF to ETH Denver, our journey through the blockchain ecosystem has been marked by innovation and success.
          </SectionDescription>
          <Grid>
            <Card>
              <CardTitle>11+ Hackathons</CardTitle>
              <CardText>
                Participated in premier blockchain hackathons including ETH SF, ETH Denver, ETH NYC, and more.
              </CardText>
            </Card>
            <Card>
              <CardTitle>15+ Prizes Won</CardTitle>
              <CardText>
                Recognized for innovative solutions and outstanding projects across multiple competitions.
              </CardText>
            </Card>
            <Card>
              <CardTitle>$25,000+ Prize Value</CardTitle>
              <CardText>
                Total value of prizes and awards won through hackathon participation and competitions.
              </CardText>
            </Card>
            <Card>
              <CardTitle>150+ Students Taught</CardTitle>
              <CardText>
                Empowered students through comprehensive courses and hands-on learning experiences.
              </CardText>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section style={{ background: '#0a0a0a' }}>
        <Container style={{ textAlign: 'center' }}>
          <SectionTitle>
            Join Our <span className="gradient-text">Community</span>
          </SectionTitle>
          <SectionDescription>
            Connect with 400+ fellow blockchain enthusiasts, get exclusive updates, and access specialized resources in our growing Discord community.
          </SectionDescription>
          <ButtonGroup>
            <Button
              as="a"
              href="https://discord.gg/hnjtVpb9H5"
              target="_blank"
              rel="noopener noreferrer"
              className="primary"
            >
              Join Discord
            </Button>
            <Button to="/contact" className="secondary">
              Contact Us
            </Button>
          </ButtonGroup>
        </Container>
      </Section>
    </PageContainer>
  );
};

export default Home;
