import React from 'react';
import styled, { keyframes } from 'styled-components';
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #0d0d0d; /* Darker background close to black */
  color: #fff;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  padding: 2rem;
`;

const Card = styled.div`
  background: #1a1a1a; /* Slightly lighter than the main background */
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  animation: ${fadeIn} 0.8s ease forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1); /* Enlarges the card slightly */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7); /* Increases shadow for focus */
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e91e63; /* Accent color */
  margin-bottom: 1rem;
  object-fit: cover; /* Ensures proper cropping of image */
`;

const Name = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  margin: 0.5rem 0;
`;

const Role = styled.h3`
  font-size: 1.1rem;
  color: #bfbfbf;
  margin: 0.3rem 0;
`;

const Bio = styled.p`
  font-size: 0.95rem;
  color: #ccc;
  margin: 0.5rem 0 1rem 0;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  & > a {
    color: #e91e63;
    font-size: 1.5rem;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.2);
      color: #8a2be2; /* Alternate accent color */
    }
  }
`;

const TeamPage = () => {
  return (
    <PageContainer>
      <Title>Meet Our Team</Title>
      <CardGrid>
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <ProfileImage src={member.image} alt={member.name} />
            <Name>{member.name}</Name>
            <Role>{member.role}</Role>
            <Bio>{member.bio}</Bio>
            <SocialIcons>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaWhatsapp /></a>
            </SocialIcons>
          </Card>
        ))}
      </CardGrid>
    </PageContainer>
  );
};

export default TeamPage;
