import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Button from "../Button";
import { dark } from "../../styles/Themes";

// Section Wrapper with dark background
const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.body}; /* Dark background */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 3rem 1.5rem;
`;

// Title with light text color
const Header = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.textWhite}; /* Light text for dark theme */
  margin-bottom: 1.5rem;
`;

// Modern Card for each content block with darker background and shadow
// Card with gradient border
// Card with gradient border, fixed height and width
const Card = styled.div`
background-color: ${(props) => props.theme.textDark}; /* Dark card background */
border-radius: 10px;
padding: 2rem;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Darker shadow for depth */
transition: transform 0.3s ease;
border: 2px solid transparent; /* Transparent border */
background-image: linear-gradient(#000, #000), linear-gradient(to right, #8a2be2, #ff1493); /* Gradient border */
background-origin: border-box;
background-clip: padding-box, border-box; /* Apply gradient to the border */
flex: 1; /* Allow flexbox to adjust width equally */
min-width: 300px; /* Set a minimum width to avoid shrinking too much */
max-width: 500px; /* Set a maximum width */
height: 100%; /* Ensure both cards have the same height */

&:hover {
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  max-width: 100%; /* Adjust for smaller screens */
}
`;

// Container to hold cards side by side with equal width
const CardContainer = styled.div`
display: flex;
justify-content: space-between;
align-items: stretch; /* Ensure equal height cards */
gap: 1rem; /* Add some spacing between the cards */
max-width: 1200px;
width: 100%;
height: 400px; /* Set a fixed height for the container so cards will match */
margin: 5% 0;

@media (max-width: 768px) {
  flex-direction: column; /* Stack cards vertically on smaller screens */
  height: auto; /* Allow auto height on smaller screens */
}
`;


// Sub-heading inside card
const SubHeading = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.textWhite};
  margin-bottom: 1rem;
`;

// Body Text with lighter color for readability
const Text = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.textWhite};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

// List for topics with lighter color and spacing
const List = styled.ul`
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.textWhite};
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
  background: ${(props) => props.theme.textWhite}; /* Light color for divider */
  margin: 3rem 0;
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

        {/* Social Media Section */}
        <Smallheader>Follow the Research and Delegations Team on Social Media!</Smallheader>
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <TwitterTimelineEmbed sourceType="profile" screenName="BoilerChain" options={{ height: 350 }} />
        </div>

        <ButtonContainer>
          <Button text="FOLLOW ON MEDIUM" link="https://boilerblockchain.medium.com/" newTab={true} />
        </ButtonContainer>
      </Section>
    </ThemeProvider>
  );
};

export default Showcase;
