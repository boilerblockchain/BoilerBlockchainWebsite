import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Button,
  Tag,
} from '../ui/primitives';

/**
 * Technical course page.
 *
 * Previously: a photo, an oversized club logo eating a whole column as filler,
 * and three fat info boxes in an auto-fill grid that left half a row black.
 * Now a banner, then a two-column reading layout — the syllabus is the content,
 * so it gets the width; location/schedule/staff collapse into one hairline spec
 * table in a sticky rail.
 */

const educationImage1 = '/images/education/edu1.webp';
const educationImage3 = '/images/education/edu3.webp';

const courseStaff = ['Garv Tayade', 'Aditya Chaudhary'];

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
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.color.accent};
`;

const Reveal = styled(motion.div)`
  min-width: 0;
`;

/* Wide banner rather than a column of stacked plates: one image, full measure,
   with the course title sitting on it so the fold carries both. */
const Banner = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.space[10]};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 16 / 11;
    filter: grayscale(1) brightness(0.45);
    transition: filter ${({ theme }) => theme.motion.slow};
  }

  &:hover img {
    filter: grayscale(0) brightness(0.6);
  }

  ${({ theme }) => theme.media.md} {
    img {
      aspect-ratio: 21 / 8;
    }
  }
`;

const BannerCaption = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.space[5]};
  background: ${({ theme }) => theme.color.black};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.md} {
    right: auto;
    max-width: 34rem;
    border-right: 1px solid ${({ theme }) => theme.color.border};
    padding: ${({ theme }) => theme.space[6]};
  }
`;

const CourseTitle = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-transform: uppercase;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[10]};
  align-items: start;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) 20rem;
    gap: ${({ theme }) => theme.space[12]};
  }
`;

const Main = styled.div`
  min-width: 0;
`;

/* Leading accent rule instead of another bordered box, so the two headings on
   the page read as one column of content rather than two more cards. */
const Block = styled.div`
  padding-left: ${({ theme }) => theme.space[5]};
  border-left: 2px solid ${({ theme }) => theme.color.accent};

  & + & {
    margin-top: ${({ theme }) => theme.space[10]};
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
    font-size: ${({ theme }) => theme.fontSize.bodyLarge};
    line-height: 1.7;
    color: ${({ theme }) => theme.color.textMuted};
  }
`;

/* The syllabus is the real content, so it is numbered and gets a hairline of
   its own per row rather than a bullet dash. */
const Outcomes = styled.ol`
  list-style: none;
  border-top: 1px solid ${({ theme }) => theme.color.border};

  li {
    display: grid;
    grid-template-columns: 2.75rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[3]};
    align-items: baseline;
    padding-block: ${({ theme }) => theme.space[4]};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.color.textMuted};
  }

  li span {
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.16em;
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.space[10]};
  padding-top: ${({ theme }) => theme.space[8]};
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;

/* Sticky on desktop so the logistics stay with the reader through the syllabus;
   a plain block on mobile, where it simply follows the content. */
const Aside = styled.aside`
  min-width: 0;

  ${({ theme }) => theme.media.lg} {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.navHeight} + ${({ theme }) => theme.space[6]});
  }
`;

const Panel = styled.div`
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[6]};
`;

/* Label left, accent value right. One table where there used to be three boxes. */
const Spec = styled.dl`
  border-top: 1px solid ${({ theme }) => theme.color.border};

  div {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: ${({ theme }) => theme.space[4]};
    padding-block: ${({ theme }) => theme.space[3]};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
  }

  dt {
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.textFaint};
    white-space: nowrap;
  }

  dd {
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.small};
    letter-spacing: 0.04em;
    text-align: right;
    color: ${({ theme }) => theme.color.accent};
  }

  div.stack {
    display: block;
  }

  div.stack dd {
    margin-top: ${({ theme }) => theme.space[3]};
    text-align: left;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

const AsideFrame = styled.div`
  margin-top: ${({ theme }) => theme.space[5]};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    filter: grayscale(1) brightness(0.62);
    transition: filter ${({ theme }) => theme.motion.slow};
  }

  &:hover img {
    filter: grayscale(0) brightness(0.85);
  }
`;

const CoursesPage = () => {
  return (
    <Section>
      <GridBackdrop />
      <Container>
        <Reveal
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Head>
            <Eyebrow>Courses</Eyebrow>
            <SectionTitle>
              Intro to <Accent>Blockchain</Accent>
            </SectionTitle>
          </Head>

          <Banner>
            <img
              src={educationImage1}
              alt="Education pic 1"
              loading="lazy"
              width="1280"
              height="960"
            />
            <BannerCaption>
              <CourseTitle>Spring 2025 Technical Course</CourseTitle>
            </BannerCaption>
          </Banner>
        </Reveal>

        <Layout>
          <Main
            as={motion.div}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Block>
              <h3>Course Description</h3>
              <p>
                This comprehensive course provides hands-on experience with
                blockchain technology and decentralized applications from a
                developer perspective. Students will learn everything from basic
                cryptography concepts to the latest developments in Web3, gaining
                practical skills through weekly coding assignments and a final
                group project.
              </p>
            </Block>

            <Block>
              <h3>Learning Outcomes</h3>
              <Outcomes>
                {learningOutcomes.map((outcome, index) => (
                  <li key={outcome}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {outcome}
                  </li>
                ))}
              </Outcomes>
            </Block>

            <Footer>
              <Button
                href="http://www.eventreg.purdue.edu/online/BlockchainIntro"
                target="_blank"
                rel="noreferrer"
                $variant="outline"
              >
                Register for the Course
              </Button>
            </Footer>
          </Main>

          <Aside>
            <Reveal
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
            >
              <Panel>
                <Spec>
                  <div>
                    <dt>Location</dt>
                    <dd>WANG 2599</dd>
                  </div>
                  <div>
                    <dt>Schedule</dt>
                    <dd>Mondays 6-7 PM </dd>
                  </div>
                  <div className="stack">
                    <dt>Course Staff</dt>
                    <dd>
                      <Tags>
                        {courseStaff.map((staff) => (
                          <Tag key={staff}>{staff}</Tag>
                        ))}
                      </Tags>
                    </dd>
                  </div>
                </Spec>
              </Panel>

              <AsideFrame>
                <img
                  src={educationImage3}
                  alt="Education pic 3"
                  loading="lazy"
                  width="1280"
                  height="960"
                />
              </AsideFrame>
            </Reveal>
          </Aside>
        </Layout>
      </Container>
    </Section>
  );
};

export default CoursesPage;
