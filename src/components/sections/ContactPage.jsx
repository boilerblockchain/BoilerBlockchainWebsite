import styled from 'styled-components';
import { motion } from 'framer-motion';
import Discord from '../../Icons/Discord';
import Twitter from '../../Icons/Twitter';
import Medium from '../../Icons/Medium';
import Github from '../../Icons/Github';
import Instagram from '../../Icons/Instagram';
import LinkedIn from '../../Icons/LinkedIn';
import {
  Section,
  Container,
  GridBackdrop,
  SectionTitle,
  Lead,
} from '../ui/primitives';

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[8]};
  align-items: stretch;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

const PageHeader = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

/* Flat panel: 1px border, square corners, no blur and no glow. */
const Panel = styled(motion.div)`
  height: 100%;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.color.text};

  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.space[10]};
  }
`;

const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space[8]};
  padding-bottom: ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const InfoSection = styled.div`
  & + & {
    margin-top: ${({ theme }) => theme.space[8]};
  }
`;

/* Mono, wide-tracked label shared by the info blocks and the form fields. */
const FieldLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
`;

const InfoText = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.7;
  color: ${({ theme }) => theme.color.textMuted};
`;

const ContactLink = styled.a`
  color: ${({ theme }) => theme.color.text};
  text-decoration-color: ${({ theme }) => theme.color.accent};
  text-underline-offset: 0.2em;
  transition: color ${({ theme }) => theme.motion.base};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const SocialIcons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.color.border};
    color: ${({ theme }) => theme.color.textMuted};
    text-decoration: none;
    transition: color ${({ theme }) => theme.motion.base},
      border-color ${({ theme }) => theme.motion.base};

    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;

      path {
        fill: currentColor;
      }
    }

    &:hover {
      border-color: ${({ theme }) => theme.color.accent};
      color: ${({ theme }) => theme.color.accent};
    }
  }
`;

const ContactPage = () => {
  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container>
        <PageHeader>
          <SectionTitle>Connect with Boiler Blockchain</SectionTitle>
          <Lead style={{ marginTop: '1rem' }}>
            The best way to reach us is by email or through our Discord.
          </Lead>
        </PageHeader>

        <ContentGrid>
          <Panel
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <CardHeader>
              <SectionTitle>Contact us</SectionTitle>
            </CardHeader>

            <InfoSection>
              <FieldLabel as="p">Email</FieldLabel>
              <InfoText>
                <ContactLink href="mailto:boilerblockchain@gmail.com">
                  boilerblockchain@gmail.com
                </ContactLink>
              </InfoText>
            </InfoSection>

            <InfoSection>
              <FieldLabel as="p">Discord</FieldLabel>
              <InfoText>
                <ContactLink href="https://discord.gg/vNwXZ39vmG" target="_blank" rel="noopener noreferrer">
                  Join the Boiler Blockchain Discord
                </ContactLink>
              </InfoText>
            </InfoSection>
          </Panel>

          <Panel
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
          >
            <CardHeader>
              <SectionTitle>Meet &amp; follow</SectionTitle>
            </CardHeader>

            <InfoSection>
              <FieldLabel as="p">Weekly Meeting</FieldLabel>
              <InfoText>
                Boiler Blockchain Weekly Meeting<br />
                Thursdays · 7–8 PM EST<br />
                Armory 101 (AR 101)
              </InfoText>
            </InfoSection>

            <InfoSection>
              <FieldLabel as="p">Follow Us</FieldLabel>
              <SocialIcons>
                <a href="https://twitter.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <Twitter width={20} height={20} />
                </a>
                <a href="https://instagram.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram width={20} height={20} />
                </a>
                <a href="https://discord.gg/vNwXZ39vmG" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                  <Discord width={20} height={20} />
                </a>
                <a href="https://linkedin.com/company/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedIn width={20} height={20} />
                </a>
                <a href="https://boilerblockchain.medium.com/" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                  <Medium width={20} height={20} />
                </a>
                <a href="https://github.com/boilerblockchain" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github width={20} height={20} />
                </a>
              </SocialIcons>
            </InfoSection>
          </Panel>
        </ContentGrid>
      </Container>
    </Section>
  );
};

export default ContactPage;
