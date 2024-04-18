import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Button from "../Button";
import { dark } from "../../styles/Themes";






const Title = styled.h1`
 font-size: ${(props) => props.theme.fontxxl};
 text-transform: capitalize;
 color: ${(props) => props.theme.textWhite};
 display: flex;
 justify-content: center;
 align-items: center;
 margin: 1rem auto;
 border-bottom: 2px solid ${(props) => props.theme.textWhite};
 width: fit-content;


 @media (max-width: 40em){
   font-size: ${(props) => props.theme.fontxl};


}
`;


const Section = styled.section`
min-height: 100vh;
width: 100vw;
background-color: ${props => props.theme.text};
display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;
position: relative;
overflow: hidden;


&>*:first-child{
 animation-duration: 20s;


 @media (max-width: 30em){
   animation-duration: 15s;


 }
}
&>*:last-child{
 animation-duration: 15s;
 @media (max-width: 30em){
   animation-duration: 10s;


 }
}
`




const Header = styled.h2`
 font-size: ${(props) => props.theme.fontxl};
 text-transform: capitalize;
 margin: 0;
 color: ${(props) => props.theme.textWhite};
 display: flex;
 justify-content: center;
 align-items: center;
 margin: 1rem auto;
 border-bottom: 2px solid ${(props) => props.theme.textWhite};
 width: fit-content;


 @media (max-width: 40em){
   font-size: ${(props) => props.theme.fontxl};
}
`;

const Smallheader = styled.h2`
 font-size: ${(props) => props.theme.fontxl};
 text-transform: capitalize;
 margin: 0;
 color: ${(props) => props.theme.textWhite};
 display: flex;
 justify-content: center;
 align-items: center;
 margin: 1rem auto;
 width: fit-content;


 @media (max-width: 40em){
   font-size: ${(props) => props.theme.fontxl};
}
`;
const ButtonContainer = styled.div`
 width: 80%;
 margin: 1rem auto;
 display: flex;
 justify-content: center;
   padding: 10px;


 @media (max-width: 64em) {
   width: 100%;
   justify-content: center;


   button {
     margin: 0 auto;
   }
 }
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const DividerText = styled.span`
  font-size: 40px;
  color: ${(props) => props.theme.textWhite}; /* Adjust color as needed */
`;


const Wrapper = styled.div`
 display: flex;
 justify-content: space-between; /* Distribute items evenly along the main axis */
 padding: 20px; /* Add padding to the wrapper */
`;


const RectangleStyle = styled.div`
 width: 88%; /* Adjust width as needed */
 max-width: 1200px; /* Limit maximum width */
 height: auto;
 border-radius: 10px;
 border: 0.05em solid ${(props) => `rgba(${props.theme.bodyRgba}, 0.5)`}; /* Use em unit for border thickness */
 color: ${(props) => `rgb(${props.theme.bodyRgba})`};
 text-align: center;
 font-size: 1em;
 padding: 10px;
 margin: 2%;
`;
const RectangleComponent = (props) => {
  const childrenArray = React.Children.toArray(props.children);
  const childrenCount = childrenArray.length;

  return (
    <RectangleStyle theme={props.theme}>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />} {/* Add line break between components */}
          {React.cloneElement(child, {
            style: { marginBottom: '10px', lineHeight: '1.5' } // Adjust line height for increased spacing
          })}
        </React.Fragment>
      ))}
    </RectangleStyle>
  );
};



const Showcase = () => {

  return (
    <Section id="showcase">
      <Wrapper style={{ paddingTop: '0' }}>
        <RectangleComponent>
          <Header>Research</Header>
          <div>
            <p style={{ fontSize: '16px', }}>
              The Research is at the forefront of blockchain research, exploring the intricate mechanics and real-world applications of decentralized technology. Our team of students and researchers collaborates on cutting-edge projects spanning various areas, including:
            </p>
            <ul style={{ listStylePosition: 'inside', padding: 0, margin: 0, fontSize: '16px' }}>
              <li>Consensus algorithms</li>
              <li>Smart contracts</li>
              <li>Scalability solutions</li>
              <li>Decentralized applications</li>
            </ul>
            <p style={{ fontSize: '16px', }}>
              We delve into diverse industries, such as finance, healthcare, and supply chain management, to uncover the transformative potential of blockchain. Through interdisciplinary collaboration and innovative thinking, we strive to push the boundaries of blockchain technology and drive positive change in the world. Join us as we pave the way for the future of decentralized innovation.
            </p>
          </div>
        </RectangleComponent>


        <Divider>
          <DividerText>x</DividerText>
        </Divider>
        

        <RectangleComponent>
          <Header>Delegations</Header>
          <div>
            <p style={{ fontSize: '16px', }}>
              The Delegations Team at Purdue University is dedicated to advancing research in decentralized governance and consensus mechanisms. Comprised of enthusiastic students and researchers, our team explores the intricacies of delegated proof-of-stake (DPoS), liquid democracy, and other innovative governance models within blockchain networks. Our research focuses on:
            </p>
            <ul style={{ listStylePosition: 'inside', padding: 0, margin: 0, fontSize: '16px' }}>
              <li>Delegated proof-of-stake (DPoS)</li>
              <li>Liquid democracy</li>
              <li>Innovative governance models</li>
            </ul>
            <p style={{ fontSize: '16px', }}>
              We investigate the scalability, security, and decentralization implications of delegation protocols, aiming to enhance the efficiency and inclusivity of decentralized decision-making processes. Through rigorous analysis and experimentation, we contribute to the evolution of decentralized governance frameworks, paving the way for more resilient and democratic blockchain ecosystems. Join us in shaping the future of decentralized governance through research and collaboration.
            </p>
          </div>
        </RectangleComponent>


      </Wrapper>

      <Smallheader>Follow the Research and Delegation team on Social Media!</Smallheader>

      <div style={{ width: '40%', minWidth: '300px' }}> {/* Adjust the width as needed */}
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="BoilerChain"
          options={{ height: 350 }} />
      </div>


      <ButtonContainer>
        <ThemeProvider theme={dark}>
          <Button text="FOLLOW ON MEDIUM" link="https://boilerblockchain.medium.com/" newTab={true} />
        </ThemeProvider>
      </ButtonContainer>


    </Section>



  )
}


export default Showcase