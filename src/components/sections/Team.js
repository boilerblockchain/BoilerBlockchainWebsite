import React, { lazy, Suspense } from "react";
import styled from "styled-components";

import img1 from "../../assets/images/1.jpg";
import img2 from "../../assets/images/2.jpg";
import img3 from "../../assets/images/3.jpg";
import img4 from "../../assets/images/4.jpg";
import img5 from "../../assets/images/5.jpg";
import Loading from "../Loading";
// import ConfettiComponent from '../Confetti';

// const ConfettiComponent = lazy(() => import("../Confetti"));

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.body};
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: uppercase;
  color: ${(props) => props.theme.textWhite};
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${(props) => props.theme.textWhite};
  letter-spacing: 2px;
  width: fit-content;

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const SubTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; /* Stack items vertically on mobile */
  margin: 2rem auto;
  width: 80%;
  gap: 1rem;
  padding: 2rem;
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;

  @media (min-width: 769px) {
    flex-direction: row; /* Row layout for larger screens */
    justify-content: space-between;
    width: 80%;
  }
`;

const SubTextColumn = styled.div`
  flex: 1;
  padding: 1rem;

  &:first-child {
    order: 2;
    max-width: 50%;
  }
  &:last-child {
    max-width: 50%;
  }

  img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    order: initial;
    max-width: 100%;
    padding: 0;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.textWhite};
  font-weight: 600;
  text-transform: uppercase;
  margin: 0.5rem 0;
  border-bottom: 1px solid ${(props) => props.theme.textWhite};
  width: 100%;
  text-align: left;
  letter-spacing: 1.5px; /* Adds modern spacing */

  a {
    color: ${(props) => props.theme.textWhite};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${(props) => props.theme.accentColor}; /* Accent color on hover */
    }
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};
    text-align: center;
  }
`;

const SubText = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => props.theme.textWhite};
  margin: 1rem 0;
  line-height: 1.6;
  text-align: left;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
    text-align: center;
  }
`;

const Team = () => {
  return (
    <Section id="team">
      <Suspense fallback={<Loading />} />
      <Title>Educational Courses</Title>
      <SubTextContainer>
        <SubTextColumn>
          <img src={img2} alt="Blockchain Course" />
        </SubTextColumn>
        <SubTextColumn>
          <SubTitle>
            <a
              href="https://www.eventreg.purdue.edu/ec2k/courselisting.aspx?1=%20&master_ID=6311%20&course_area=1285%20&course_number=130%20&course_subtitle=00"
              rel="noreferrer"
            >
              Principles and Practices of Blockchain (Technical)
            </a>
          </SubTitle>
          <SubText>
            This course aims to provide individuals with a comprehensive,
            hands-on overview of blockchain technology and decentralized
            applications from a developer perspective. From basic cryptography
            concepts and blockchain use cases to the latest developments in the
            technical field, this course will provide students with the
            necessary skills and tools to pursue opportunities in the technology
            field.
          </SubText>
        </SubTextColumn>
      </SubTextContainer>
    </Section>
  );
};

export default Team;

{
  /* <SubTextColumn>
          <SubTitle> <a href="https://www.eventreg.purdue.edu/ec2k/courselisting.aspx?1=%20&master_ID=6311%20&course_area=1285%20&course_number=129%20&course_subtitle=00" rel="noreferrer">
          Introduction to Blockchain (non-technical)</a></SubTitle>          
          <SubText>
          This course aims to provide individuals with a comprehensive general overview of a wide range of blockchain 
          technologies and applications. From the basics of how blockchain and bitcoin works to current developments in 
          L1s, Defi, NFTs, Gaming, Consumer markets, Enterprise Solutions, this syllabus will equip participants with basic 
          knowledge to understand the blockchain-space. No prior CS experience needed.
          </SubText>
          <img src={img5} alt="img5" />
        </SubTextColumn> */
}
