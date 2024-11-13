import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const teamMembers = [
  {
    id: 1,
    name: "Ethan",
    role: "Project Lead",
    bio: "Ethan has over 5 years of experience in blockchain development.",
    image: "https://t4.ftcdn.net/jpg/02/19/63/31/360_F_219633151_BW6TD8D1EA9OqZu4JgdmeJGg4JBaiAHj.jpg",
  },
  {
    id: 2,
    name: "Soham",
    role: "Smart Contract Developer",
    bio: "Soham is passionate about decentralized applications and DeFi.",
    image: "https://media.istockphoto.com/id/1394347360/photo/confident-young-black-businesswoman-standing-at-a-window-in-an-office-alone.jpg?s=612x612&w=0&k=20&c=tOFptpFTIaBZ8LjQ1NiPrjKXku9AtERuWHOElfBMBvY=",
  },
  {
    id: 3,
    name: "Adithya",
    role: "Smart Contract Developer",
    bio: "Adithya is passionate about decentralized applications and DeFi.",
    image: "https://www.shutterstock.com/image-photo/headshot-close-portrait-indian-latin-260nw-2343004301.jpg",
  },
  {
    id: 4,
    name: "Vincent",
    role: "Smart Contract Developer",
    bio: "Vincent is passionate about decentralized applications and DeFi.",
    image: "https://media.istockphoto.com/id/1286810719/photo/smiling-cheerful-young-adult-african-american-ethnicity-man-looking-at-camera-standing-at.jpg?s=612x612&w=0&k=20&c=b9sWYITIZ_yjXB3m-Xftj-latPXQDhb5Roa0pA0JaNY=",
  },
];

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #0d0d0d;
  color: #fff;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
`;

const SliderContainer = styled.div`
  width: 80%;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid ${({ isActive }) => (isActive ? "#8a2be2" : "#333")};
  opacity: ${({ isActive }) => (isActive ? "1" : "0.5")};
  transition: transform 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ContentArea = styled.div`
  background-color: #1a1a1a;
  padding: 2rem 3rem;
  border-radius: 12px;
  width: 90%;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-top: 2rem;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  flex: 3;
  padding: 0 2rem;
  color: #fff;
`;

const Name = styled.h2`
  font-size: 1.8rem;
  color: #8a2be2;
  margin: 0;
  font-weight: bold;
`;

const Role = styled.h3`
  font-size: 1.2rem;
  color: #bfbfbf;
  margin: 0.2rem 0;
  font-weight: normal;
`;

const Divider = styled.div`
  width: 50px;
  height: 2px;
  background-color: #8a2be2;
  margin: 0.5rem 0;
`;

const Bio = styled.p`
  font-size: 1rem;
  color: #ccc;
  margin: 1rem 0;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  
  & > a {
    color: #8a2be2;
    font-size: 1.2rem;
    transition: color 0.3s;

    &:hover {
      color: #e74c3c;
    }
  }
`;

const TeamPage = () => {
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    focusOnSelect: true,
    beforeChange: (current, next) => setSelectedMember(teamMembers[next]),
  };

  return (
    <PageContainer>
      <Title>Meet Our Team</Title>
      
      <SliderContainer>
        <Slider {...settings}>
          {teamMembers.map(member => (
            <div key={member.id} onClick={() => setSelectedMember(member)}>
              <ProfileImage 
                src={member.image} 
                alt={member.name} 
                isActive={selectedMember.id === member.id}
              />
            </div>
          ))}
        </Slider>
      </SliderContainer>
      
      <ContentArea>
        <ImageWrapper>
          <ProfileImage src={selectedMember.image} alt={selectedMember.name} isActive />
        </ImageWrapper>
        
        <ContentWrapper>
          <Name>{selectedMember.name}</Name>
          <Role>{selectedMember.role}</Role>
          <Divider />
          <Bio>{selectedMember.bio}</Bio>
          <SocialIcons>
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaWhatsapp /></a>
          </SocialIcons>
        </ContentWrapper>
      </ContentArea>
    </PageContainer>
  );
};

export default TeamPage;
