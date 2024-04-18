import React, { lazy, Suspense } from 'react'
import styled from 'styled-components';

import img1 from '../../assets/images/1.jpg';
import img2 from '../../assets/images/2.jpg';
import img3 from '../../assets/images/3.jpg';
import img4 from '../../assets/images/4.jpg';
import img5 from '../../assets/images/5.jpg';
import Loading from '../Loading';
// import ConfettiComponent from '../Confetti';

// const ConfettiComponent = lazy(() => import("../Confetti"));


const Section = styled.section`
min-height: 100vh;
width: 100vw;
background-color: ${props => props.theme.body};
position: relative;
overflow: hidden;
`
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

const Container = styled.div`
width: 75%;
margin: 2rem auto;

display: flex;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;

@media (max-width: 64em){
width: 80%;
}
@media (max-width: 48em){
width: 90%;
justify-content: center;
}
`

const Item = styled.div`
width: calc(20rem - 4vw);
padding: 1rem 0;
color: ${props => props.theme.body};
margin: 2rem 1rem;
position: relative;
z-index:5;

backdrop-filter: blur(4px);

border: 2px solid ${props => props.theme.textWhite};
border-radius: 20px;

&:hover{
  img{
    transform: translateY(-2rem) scale(1.2);
  }
}

@media (max-width: 30em){
width: 70vw;
}

`

const ImageContainer = styled.div`
width: 80%;
margin: 0 auto;
background-color:${props => props.theme.carouselColor};
border: 1px solid ${props => props.theme.textWhite};
padding: 1rem;

border-radius: 20px;
cursor: pointer;

img{
  width: 100%;
  height: auto;
transition: all 0.3s ease;

}
`

const Name = styled.h2`
font-size: ${props => props.theme.fontlg};
display: flex;
align-items: center;
justify-content: center;
text-transform: uppercase;
color: ${props => props.theme.textWhite};
margin-top: 1rem;
`

const Position = styled.h2`
font-size: ${props => props.theme.fontmd};
display: flex;
align-items: center;
justify-content: center;
text-transform: capitalize;
color: ${props => `rgba(255,255,255,0.9)`};
font-weight:400;
`

const MemberComponent = ({img, name=" ",position=" "}) => {

  return(
    <Item>
      <ImageContainer>
        <img width={500} height={400}  src={img} alt={name} />
      </ImageContainer>
      <Name>{name}</Name>
      <Position>{position}</Position>
    </Item>
  )
}
const SubTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem auto;
  width: 80%;

  @media (max-width: 64em) {
    flex-direction: column;
    width: 100%;
  }
`;

const SubTextColumn = styled.div`
  flex: 1;
  padding: 0 1rem;

  img {
    width: 100%;
  }

  @media (max-width: 64em) {
    padding: 0;
    margin-bottom: 1rem;
  }
`;

const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.fontlg};
  text-transform: capitalize;
  color: ${(props) => props.theme.textWhite};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  border-bottom: 2px solid ${(props) => props.theme.textWhite};
  width: 80%;

  @media (max-width: 40em){
    text-align: center;
    font-size: ${(props) => props.theme.fontxl};

}
`;

const SubText = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.textWhite};
  align-self: flex-start;
  width: 80%;
  margin: 1rem auto;
  font-weight: 400;
  @media (max-width: 64em) {
    width: 100%;
    text-align: center;
    font-size: ${(props) => props.theme.fontmd};
  }
  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};
  }
  @media (max-width: 30em) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Team = () => {
  return (
    <Section id="team">
    <Suspense fallback={<Loading />}>
    </Suspense>
      <Title>Education / Courses</Title>
      <SubTextContainer>
        <SubTextColumn>
          <SubTitle> <a href="https://www.eventreg.purdue.edu/ec2k/courselisting.aspx?1=%20&master_ID=6311%20&course_area=1285%20&course_number=130%20&course_subtitle=00" rel="noreferrer">
          Principles and Practices of Blockchain (technical)</a></SubTitle>
          <SubText>
          This course aims to provide individuals with a comprehensive, hands-on overview of blockchain technology and 
          decentralized applications from a developer perspective. From basic cryptography concepts and blockchain use 
          cases to the latest developments in the technical field, this course will provide students with the necessary 
          skills and tools to pursue opportunities in the technology field.
          </SubText>
          <img src={img2} alt="img2" />
        </SubTextColumn>
        <SubTextColumn>
          <SubTitle> <a href="https://www.eventreg.purdue.edu/ec2k/courselisting.aspx?1=%20&master_ID=6311%20&course_area=1285%20&course_number=129%20&course_subtitle=00" rel="noreferrer">
          Introduction to Blockchain (non-technical)</a></SubTitle>          
          <SubText>
          This course aims to provide individuals with a comprehensive general overview of a wide range of blockchain 
          technologies and applications. From the basics of how blockchain and bitcoin works to current developments in 
          L1s, Defi, NFTs, Gaming, Consumer markets, Enterprise Solutions, this syllabus will equip participants with basic 
          knowledge to understand the blockchain-space. No prior CS experience needed.
          </SubText>
          <img src={img5} alt="img5" />
        </SubTextColumn>
      </SubTextContainer>
    </Section>
  )
}

export default Team