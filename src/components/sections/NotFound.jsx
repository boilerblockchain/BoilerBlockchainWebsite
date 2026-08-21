import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Section, Container, GridBackdrop, ButtonLink, Button } from '../ui/primitives';

const Block = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.display};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.accent};
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h2};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.color.text};
  margin-top: ${({ theme }) => theme.space[4]};
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.bodyLarge};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin-top: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  max-width: 320px;

  ${({ theme }) => theme.media.sm} {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: auto;
    max-width: none;
    gap: ${({ theme }) => theme.space[6]};
  }
`;

const ErrorLine = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
  margin-top: ${({ theme }) => theme.space[12]};
`;

const NotFound = () => {
  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container>
        <Block
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <ErrorCode>404</ErrorCode>
          <Title>Page Not Found</Title>
          <Description>
            Oops! It seems like you&apos;ve ventured into uncharted blockchain
            territory. The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </Description>
          <Actions>
            <ButtonLink to="/">Return Home</ButtonLink>
            {/* Was a styled(Link) with an onClick and no `to`, which renders an
                anchor with no href. It is a history control, so it is a button. */}
            <Button
              as="button"
              type="button"
              $variant="outline"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Actions>
          <ErrorLine>{'// ERROR: PAGE_NOT_FOUND'}</ErrorLine>
        </Block>
      </Container>
    </Section>
  );
};

export default NotFound;
