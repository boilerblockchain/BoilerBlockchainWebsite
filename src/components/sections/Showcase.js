import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Button from "../Button";
import { dark } from "../../styles/Themes";

// Section Wrapper with dark background
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 3rem 1rem;
  box-sizing: border-box; /* Include padding and borders in the width */

  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }
`;

// Title with light text color
const Header = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.textWhite};
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl}; /* Reduce font size on tablets */
  }
  @media (max-width: 480px) {
    font-size: ${(props) => props.theme.fontlg}; /* Further reduce font size on phones */
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.textDark};
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  border: 2px solid transparent;
  background-image: linear-gradient(#000, #000), linear-gradient(to right, #8a2be2, #ff1493);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  flex: 1;
  max-width: 100%; /* Full width on smaller screens */

  &:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    max-width: 100%; /* Ensure no overflow on smaller screens */
    padding: 1.5rem;
  }
  @media (max-width: 480px) {
    padding: 1rem; /* Reduce padding for very small screens */
  }
`;


const CardContainer = styled.div`
display: flex;
justify-content: space-between;
align-items: stretch;
gap: 1rem;
width: 100%;
height: 400px;
margin: 5% 0;

@media (max-width: 768px) {
  flex-direction: column; /* Stack cards vertically on tablets and smaller screens */
  height: auto; /* Allow auto height on smaller screens */
  width 90%;
}
`;


// Sub-heading inside card
const SubHeading = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.textWhite};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
  @media (max-width: 480px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

// Body Text with lighter color for readability
const Text = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.textWhite};
  line-height: 1.6;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// List for topics with lighter color and spacing
const List = styled.ul`
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.textWhite};

  @media (max-width: 480px) {
    margin-left: 1rem;
  }
`;

// List item style
const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

// Simple Divider
const Divider = styled.hr`
  width: 100%;
  border: 0;
  height: 1px;
  background: ${(props) => props.theme.textWhite};
  margin: 3rem 0;

  @media (max-width: 480px) {
    margin: 2rem 0; /* Reduce margin on smaller screens */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

// Small sub-heading for social media
const Smallheader = styled.h4`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.textWhite};
  margin-bottom: 1.5rem;
`;

const Showcase = () => {
  return (
    <ThemeProvider theme={dark}>
      <Section id="showcase">
        <Header>Blockchain Research at Purdue</Header>
        <CardContainer>
          {/* Research Card */}
          <Card>
            <SubHeading>Research</SubHeading>
            <Text>
              Our research explores the mechanics and real-world applications of decentralized blockchain technology. We collaborate across industries and disciplines to develop solutions in:
            </Text>
            <List>
              <ListItem>Consensus algorithms</ListItem>
              <ListItem>Smart contracts</ListItem>
              <ListItem>Scalability solutions</ListItem>
              <ListItem>Decentralized applications</ListItem>
            </List>
            <Text>
              We focus on industries like finance, healthcare, and supply chain management to uncover blockchain’s transformative potential.
            </Text>
          </Card>

          {/* Delegation Card */}
          <Card>
            <SubHeading>Delegations</SubHeading>
            <Text>
              The Delegations team investigates decentralized governance and delegation protocols such as:
            </Text>
            <List>
              <ListItem>Delegated proof-of-stake (DPoS)</ListItem>
              <ListItem>Liquid democracy</ListItem>
              <ListItem>Innovative governance models</ListItem>
            </List>
            <Text>
              We enhance blockchain decision-making efficiency, making decentralized systems more inclusive and secure.
            </Text>
          </Card>
        </CardContainer>
        <Divider />
      </Section>
    </ThemeProvider>
  );
};

export default Showcase;
