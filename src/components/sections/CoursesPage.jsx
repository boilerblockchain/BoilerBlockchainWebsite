import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Card,
  Button,
  Tag,
} from '../ui/primitives';

const BBLogo = '/images/logos/boiler_blockchain_logo_svg.webp';
const educationImage1 = '/images/education/edu1.webp';
const educationImage3 = '/images/education/edu3.webp';

const courseStaff = ['Aditya Kuniyil Kattil', 'Shivam Rastogi'];

const learningOutcomes = [
  'Understand blockchain technologies at a technical level',
  'Master cryptography fundamentals in blockchain systems',
  "Develop with Ethereum's EVM",
  'Write & deploy Solidity smart contracts',
  'Utilize popular open-source solidity libraries',
  'Build dApps with ethers.js & hardhat framework',
  'Create real-world blockchain solutions',
];

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.color.accent};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[8]};
  align-items: start;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: ${({ theme }) => theme.space[12]};
  }
`;

const Media = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[6]};
  min-width: 0;
`;

const Frame = styled.div`
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* Was 180 / 220 / 280 / 380px steps at four breakpoints. One fluid clamp
   covers the same range without any of them. */
const LogoPlate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};

  img {
    width: clamp(10rem, 22vw, 20rem);
    height: auto;
    aspect-ratio: 276 / 275;
    object-fit: contain;
  }
`;

const CourseTitle = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const InfoCard = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.space[5]};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};

  &.large {
    grid-column: 1 / -1;
  }

  h4 {
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.accent};
    margin-bottom: ${({ theme }) => theme.space[3]};
  }

  p {
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    color: ${({ theme }) => theme.color.textMuted};
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

const DetailsSection = styled.div`
  padding-top: ${({ theme }) => theme.space[8]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  & + & {
    margin-top: ${({ theme }) => theme.space[8]};
  }

  h3 {
    font-family: ${({ theme }) => theme.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSize.h4};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: ${({ theme }) => theme.color.text};
    margin-bottom: ${({ theme }) => theme.space[4]};
  }

  p {
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    line-height: 1.7;
    color: ${({ theme }) => theme.color.textMuted};
  }
`;

const List = styled.ul`
  list-style: none;

  li {
    position: relative;
    padding-left: ${({ theme }) => theme.space[5]};
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.color.textMuted};
  }

  li + li {
    margin-top: ${({ theme }) => theme.space[3]};
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.65em;
    width: 8px;
    height: 1px;
    background: ${({ theme }) => theme.color.accent};
  }
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.space[8]};
  padding-top: ${({ theme }) => theme.space[8]};
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;

const CoursesPage = () => {
  return (
    <Section>
      <GridBackdrop />
      <Container $wide>
        <Head
          as={motion.div}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Eyebrow>Courses</Eyebrow>
          <SectionTitle>
            Intro to <Accent>Blockchain</Accent>
          </SectionTitle>
        </Head>

        <Layout
          as={motion.div}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Media>
            <Frame>
              <img
                src={educationImage1}
                alt="Education pic 1"
                loading="lazy"
                width="1280"
                height="960"
              />
            </Frame>
            <LogoPlate>
              <img
                src={BBLogo}
                alt="Boiler Blockchain Logo"
                loading="lazy"
                width="276"
                height="275"
              />
            </LogoPlate>
            <Frame>
              <img
                src={educationImage3}
                alt="Education pic 3"
                loading="lazy"
                width="1280"
                height="960"
              />
            </Frame>
          </Media>

          <Card>
            <CourseTitle>Spring 2025 Techincal Course</CourseTitle>

            <InfoGrid>
              <InfoCard>
                <h4>Location</h4>
                <p>WANG 2599</p>
              </InfoCard>
              <InfoCard>
                <h4>Schedule</h4>
                <p>Mondays 6-7 PM </p>
              </InfoCard>
              <InfoCard className="large">
                <h4>Course Staff</h4>
                <Tags>
                  {courseStaff.map((staff) => (
                    <Tag key={staff}>{staff}</Tag>
                  ))}
                </Tags>
              </InfoCard>
            </InfoGrid>

            <DetailsSection>
              <h3>Course Description</h3>
              <p>
                This comprehensive course provides hands-on experience with
                blockchain technology and decentralized applications from a
                developer perspective. Students will learn everything from basic
                cryptography concepts to the latest developments in Web3, gaining
                practical skills through weekly coding assignments and a final
                group project.
              </p>
            </DetailsSection>

            <DetailsSection>
              <h3>Learning Outcomes</h3>
              <List>
                {learningOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </List>
            </DetailsSection>

            <Footer>
              <Button href="#" download="#" $variant="outline">
                Download Syllabus (Coming Soon)
              </Button>
            </Footer>
          </Card>
        </Layout>
      </Container>
    </Section>
  );
};

export default CoursesPage;
