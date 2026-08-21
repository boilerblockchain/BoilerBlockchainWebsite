import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Arrow } from '../../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  Button,
  ButtonLink,
} from '../../ui/primitives';

/**
 * Was a 32px-radius glass panel with four stacked box-shadows, a masked
 * gradient border, a blurred backdrop and an animated radial glow. Now: a
 * bordered block.
 */
const Panel = styled(motion.div)`
  border: 1px solid ${({ theme }) => theme.color.accentBorder};
  background: ${({ theme }) => theme.color.surface};
  padding: clamp(2rem, 1rem + 5vw, 4.5rem);
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h1};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.02;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[5]};

  span {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Copy = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.bodyLarge};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: 56ch;
  margin: 0 auto ${({ theme }) => theme.space[10]};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
  justify-content: center;
`;

export default function CTA() {
  return (
    <Section>
      <GridBackdrop />
      <Container>
        <Panel
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Eyebrow style={{ textAlign: 'center' }}>Get involved</Eyebrow>
          <Title>
            Ready to build the <span>future</span>?
          </Title>
          <Copy>
            Join Purdue&apos;s premier Web3 organization. Whether you are a
            builder, researcher or entrepreneur, we provide the resources,
            community and opportunities to launch your career in blockchain.
          </Copy>
          <Actions>
            <Button
              href="https://discord.gg/vNwXZ39vmG"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
              <Arrow size={16} />
            </Button>
            <ButtonLink to="/contact" $variant="outline">
              Get in Touch
            </ButtonLink>
          </Actions>
        </Panel>
      </Container>
    </Section>
  );
}
