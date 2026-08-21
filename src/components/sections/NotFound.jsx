import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const PageSection = styled.section`
  width: 100%;
  background-color: ${({ theme }) => theme.color.black};
  position: relative;
  padding: ${({ theme }) => theme.sectionPadding.block} 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled(motion.div)`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 1024px) {
    width: 90%;
    padding: 1.75rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }

  @media (max-width: 360px) {
    padding: 0.75rem;
  }
`;

const ErrorCode = styled(motion.h1)`
  font-size: 12rem;
  color: ${({ theme }) => theme.color.accent};
  margin: 0;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 1024px) {
    font-size: 10rem;
  }

  @media (max-width: 768px) {
    font-size: 8rem;
  }

  @media (max-width: 480px) {
    font-size: 6rem;
  }

  @media (max-width: 360px) {
    font-size: 5rem;
  }
`;

const Title = styled(motion.h2)`
  font-size: 3rem;
  color: ${({ theme }) => theme.color.text};
  margin: 1rem 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  @media (max-width: 360px) {
    font-size: 1.25rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.color.textMuted};
  margin: 1rem 0 2.5rem;
  max-width: 600px;
  line-height: 1.6;
  font-family: 'Lato', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 1rem 0 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 0.75rem 0 1.5rem;
  }

  @media (max-width: 360px) {
    font-size: 0.9rem;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
`;

const HomeButton = styled(Link)`
  padding: 1rem 2.5rem;
  background: ${({ theme }) => theme.color.accentDeep};
  color: #ffffff;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background ${({ theme }) => theme.motion.base},
              transform ${({ theme }) => theme.motion.base},
              box-shadow ${({ theme }) => theme.motion.base};
  box-shadow: ${({ theme }) => theme.elevation[1]};
  border: 2px solid transparent;

  &:hover {
    background: ${({ theme }) => theme.color.accent};
    box-shadow: ${({ theme }) => theme.elevation[2]};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.875rem 2rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const BackButton = styled(Link)`
  padding: 1rem 2.5rem;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base},
              transform ${({ theme }) => theme.motion.base};
  border: 2px solid ${({ theme }) => theme.color.accentBorderStrong};

  &:hover {
    background: ${({ theme }) => theme.color.accentWash};
    border-color: ${({ theme }) => theme.color.accent};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.875rem 2rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const GlitchText = styled(motion.div)`
  position: relative;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.color.textFaint};
  font-family: 'Tomorrow', sans-serif;
  margin-top: 3rem;
  letter-spacing: 3px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    letter-spacing: 2px;
  }
`;

const NotFound = () => {
  return (
    <PageSection>
      <Container
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        <ErrorCode
          variants={fadeInUp}
        >
          404
        </ErrorCode>
        <Title
          variants={fadeInUp}
        >
          Page Not Found
        </Title>
        <Description
          variants={fadeInUp}
        >
          Oops! It seems like you've ventured into uncharted blockchain territory.
          The page you're looking for doesn't exist or has been moved.
        </Description>
        <ButtonContainer
          variants={fadeInUp}
        >
          <HomeButton to="/">
            Return Home
          </HomeButton>
          <BackButton onClick={() => window.history.back()}>
            Go Back
          </BackButton>
        </ButtonContainer>
        <GlitchText
          variants={fadeInUp}
        >
          {"// ERROR: PAGE_NOT_FOUND"}
        </GlitchText>
      </Container>
    </PageSection>
  );
};

export default NotFound;
