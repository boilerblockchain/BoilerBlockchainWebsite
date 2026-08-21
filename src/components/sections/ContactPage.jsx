import { useState } from 'react';
import styled, { css } from 'styled-components';
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
  align-items: start;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

/* Flat panel: 1px border, square corners, no blur and no glow. */
const Panel = styled(motion.div)`
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

const FormGroup = styled.div`
  & + & {
    margin-top: ${({ theme }) => theme.space[5]};
  }
`;

/* font-size stays at 16px minimum: anything smaller makes iOS Safari zoom the
   viewport when the field takes focus. */
const fieldStyles = css`
  width: 100%;
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.none};
  transition: border-color ${({ theme }) => theme.motion.base};
`;

const FormInput = styled.input`
  ${fieldStyles}

  &::placeholder {
    color: ${({ theme }) => theme.color.textFaint};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const FormTextarea = styled.textarea`
  ${fieldStyles}
  min-height: 140px;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.color.textFaint};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: ${({ theme }) => theme.space[8]};
  padding: 0.9rem 1.75rem;
  background: ${({ theme }) => theme.color.accentDeep};
  border: 1px solid ${({ theme }) => theme.color.accentDeep};
  border-radius: ${({ theme }) => theme.radius.none};
  color: #ffffff;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.base},
    border-color ${({ theme }) => theme.motion.base};

  &:hover {
    background: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
    <Section $divided={false}>
      <GridBackdrop />
      <Container>
        <ContentGrid>
          <Panel
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <CardHeader>
              <SectionTitle>Connect with Boiler Blockchain</SectionTitle>
              <Lead style={{ marginTop: '1rem' }}>
                Establish a link with our team
              </Lead>
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

          <Panel
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
          >
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
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
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
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
                <FieldLabel htmlFor="message">Message</FieldLabel>
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
          </Panel>
        </ContentGrid>
      </Container>
    </Section>
  );
};

export default ContactPage;
