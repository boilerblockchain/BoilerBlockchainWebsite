import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import ethan from "../../assets/images/18_Ethan_Haeberle.jpg";
import soham from "../../assets/images/16_Soham_Jog.jpg";
import adithya from "../../assets/images/17_Adithya_Ganesh.jpg";
import vincent from "../../assets/images/19_Vincent_Palmerio.jpg";
import eli from "../../assets/images/20_Eli_Dubizh.jpg";
import pradyumm from "../../assets/images/21_Pradyumn_Malik.jpg";
import albert from "../../assets/images/22_Albert_Wu.jpg";
import shivam from "../../assets/images/23_Shivam_Rastogi.jpg";

const teamMembers = [
  {
    id: 1,
    name: "Ethan",
    role: "Co-president",
    bio: "<Add Description>",
    image: ethan,
  },
  {
    id: 2,
    name: "Soham",
    role: "Co-president",
    bio: "<Add Description>",
    image: soham,
  },
  {
    id: 3,
    name: "Adithya",
    role: "Head of Strategy",
    bio: "<Add Description>",
    image: adithya,
  },
  {
    id: 4,
    name: "Vincent",
    role: "Head of Development",
    bio: "<Add Description>",
    image: vincent,
  },
  {
    id: 5,
    name: "Eli",
    role: "Head of Research and Investments",
    bio: "<Add Description>",
    image: eli,
  },
  {
    id: 6,
    name: "Pradyumm",
    role: "Lead Governance Delegate",
    bio: "<Add Description>",
    image: pradyumm,
  },
  {
    id: 7,
    name: "Albert",
    role: "Lead Governance Delegate",
    bio: "<Add Description>",
    image: albert,
  },
  {
    id: 8,
    name: "Shivam",
    role: "Course Instructor",
    bio: "<Add Description>",
    image: shivam,
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
  background: #0d0d0d;
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
  background: #1a1a1a;
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
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e91e63; 
  margin-bottom: 1rem;
  object-fit: cover;
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
      color: #8a2be2; 
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
