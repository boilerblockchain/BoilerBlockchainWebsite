import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import DrawSvg from "../DrawSvg";

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.body};
  position: relative;
  display: inline-block;
  overflow: hidden;

`;
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.textWhite};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
  border-bottom: 2px solid ${(props) => props.theme.textWhite};
  width: fit-content;

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const Container = styled.div`
  width: 70%;
  height: 150vw;
  background-color: ${(props) => props.theme.body};
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 95em) {
    height: 170vw;
  }
  @media (max-width: 84em) {
    height: 200vw;
  }
  @media (max-width: 72em) {
    height: 250vw;
  }
  @media (max-width: 64em) {
    width: 80%;
    height: 400vh;
  }
  @media (max-width: 52em) {
    width: 90%;
  }
`;
const SvgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Items = styled.ul`
  list-style: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: lightblue; */

  @media (max-width: 48em) {
    width: 90%;
  }

  & > *:nth-of-type(2n + 1) {
    justify-content: start;
    @media (max-width: 48em) {
      justify-content: center;
    }

    ul {
        list-style-type: none;
    }

    div {
      border-radius: 50px 0 50px 0;
      text-align: right;

      @media (max-width: 48em) {
        border-radius: 0 50px 0 50px;
      text-align: left;
        p {
          border-radius: 0 40px 0 40px;

        }
      }
    }
    p {
      border-radius: 40px 0 40px 0;
    }
  }
  & > *:nth-of-type(2n) {
    justify-content: end;
    @media (max-width: 48em) {
      justify-content: center;
    }
    div {
      border-radius: 0 50px 0 50px;
      text-align: left;

      
    }
    p {
      border-radius: 0 40px 0 40px;
    }
  }
`;
const Item = styled.li`
  width: 100%;
  height: 100%;
  display: flex;

  @media (max-width: 48em) {
    justify-content: flex-end !important;
  }
`;
const ItemContainer = styled.div`
  width: 40%;
  height: fit-content;
  padding: 1rem;
  border: 3px solid ${(props) => props.theme.textWhite};

  @media (max-width: 48em) {
    width: 70%;

  }
`;

const Box = styled.p`
  height: fit-content;
  background-color: ${(props) => props.theme.carouselColor};
  color: ${(props) => props.theme.text};
  padding: 1rem;
  position: relative;
  border: 1px solid ${(props) => props.theme.textWhite};
`;
const SubTitle = styled.span`
  display: block;
  font-size: ${(props) => props.theme.fontxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.text};

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontlg};
    font-weight: 600;
  }
`;
const Text = styled.span`
  display: block;
  font-size: ${(props) => props.theme.fontsm};
  text-transform: capitalize;
  color: ${(props) => props.theme.text};

  font-weight: 400;
  margin: 0.5rem 0;
  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontxs};
  }
`;

const HackathonsItem = ({ hackathon, project, link, devs, prize, prizes, addToRef }) => {
return (
    <Item ref={addToRef}>
        <ItemContainer>
            <Box>
                <SubTitle>{hackathon}<br /><a href={link} target='_blank' style={{textDecorationLine: 'underline'}}>{project}</a></SubTitle>
                {prizes ? (
                    <Text>
                        Devs: {devs}<br />
                        Prizes: <ul style={{paddingLeft: '30px'}}>
                        {prizes.map((prize, index) => (
                            <li key={index}>{prize} </li>
                        ))}
                        </ul>
                    </Text>
                ) : prize === "" ? (
                    <Text>Devs: {devs}</Text>
                ) : (
                    <Text>
                        Devs: {devs}<br />
                        Prize: {prize}
                    </Text>
                )}
            </Box>
        </ItemContainer>
    </Item>
);
};

const Hackathons = () => {
  const revealRefs = useRef([]);
  revealRefs.current = [];
  gsap.registerPlugin(ScrollTrigger);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    let t1 = gsap.timeline();
    revealRefs.current.forEach((el, index) => {
      t1.fromTo(
        el.childNodes[0],
        {
          y: "0",
        },
        {
          y: "-30%",

          scrollTrigger: {
            id: `section-${index + 1}`,
            trigger: el,
            start: "top center+=200px",
            end: "bottom center",
            scrub: true,
            // markers:true,
          },
        }
      );
    });

    return () => {
      if (t1) t1.kill();
    };
  }, []);

  return (
    <Section id="hackathons">
      <Title>Hackathon Projects / Prizes</Title>
      <Container>
        <SvgContainer>
          <DrawSvg />
        </SvgContainer>
        <Items>
          <Item>&nbsp;</Item>
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH SF '22"
            project="Tokenized Education"
            link="https://ethglobal.com/showcase/tokenized-education-fmixx"
            devs="Kshtij, Adithya, Ian, Saumya, Ajay"
            prize="👥 Triangle — Best Social Use"
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH SF '22"
            project="Verf3d"
            link="https://ethglobal.com/showcase/verf3d-gb7h9"
            devs="Eashan, Soham, Andrean"
            prize="🏊‍♂️ SKALE — Pool Prize"
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="Penn Blockchain"
            project="Koraline"
            link="https://dorahacks.io/buidl/4274"
            devs="Eashan, Soham, Kshtij, Devesh, Adithya"
            prize=""
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH Denver 23'"
            project="LiquidEase"
            link="https://app.buidlbox.io/projects/liquidease"
            devs="Adithya, Kshitij, Will"
            prize="0x Bounty - Third Place"
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="Scaling ETH 23'"
            project="ToldYouSo"
            link="https://ethglobal.com/showcase/told-you-so-auvch"
            devs="Soham"
            prizes={["👯 Polybase — Pool Prize", "📜 Scroll — Just Deploy!"]}
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH Online 23'"
            project="DaoLingo"
            link="https://ethglobal.com/showcase/daolingo-fd6uw"
            devs="Soham"
            prize="🏃 FVM — Runner Up"
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH NYC 23'"
            project="Soho"
            link="https://ethglobal.com/showcase/soho-xo1fi"
            devs="Soham, Eli, Vincent, Ibrahim"
            prizes={["🎨 Nouns DAO — Best Use of Artwork", "🥈 XMTP — Best Use", "🏊‍♂️ The Graph — Pool Prize", "🏃 Scroll — Honorable Mentions", "🏊‍♂️ Scroll — Pool Prize"]}
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH NYC 23'"
            project="Sndwch_protocol"
            link="https://ethglobal.com/showcase/sndwch-protocol-cqsb0"
            devs="Kshtij, Eashan, Stanley, Mihika"
            prize=""
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH Online 23'"
            project="Rio"
            link="https://ethglobal.com/showcase/rio-fyams"
            devs="Vincent, Eli"
            prizes={["🏊‍♀️ Mantle — Build on Mantle", "🏊 Scroll — Pool Prize"]}
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="ETH Denver 24'"
            project="CrypTap"
            link="https://devfolio.co/projects/boiler-blockchain-ee81"
            devs="Soham, Armanya, Ansh"
            prizes={["Top 6 in Infrastructure Category", "3000 SPORK$ in Community Voting"]}
          />
          <HackathonsItem
            addToRef={addToRefs}
            hackathon="SUI Network Grants"
            project="Kove"
            link="https://twitter.com/BoilerChain/status/1768089308357910975"
            devs="Vincent, Eli, Ansh"
            prize=""
          />
        </Items>
      </Container>
    </Section>
  );
};

export default Hackathons;
