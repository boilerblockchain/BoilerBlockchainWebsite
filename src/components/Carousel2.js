import React from 'react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
// import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './Carousel.css';



import { Pagination, Navigation, Autoplay, EffectCards } from "swiper/modules";

import img11 from '../assets/images/11.png';
import img12 from '../assets/images/12.png';
import img13 from '../assets/images/13.png';
import img14 from '../assets/images/14.png';
import img15 from '../assets/images/15.png';

import Arrow from '../assets/Arrow.svg';


const Container = styled.div`
// width: 25vw;
height: 70vh;

display: flex;
justify-content: center;
align-items: center;

@media (max-width: 70em){
    height: 60vh;
}

@media (max-width: 64em){
    height: 50vh;
    width: 30vw;
}
@media (max-width: 48em){
    height: 50vh;
    width: 40vw;
}
@media (max-width: 30em){
    height: 45vh;
    width: 60vw;
}

.swiper{
    width: 100%;
    height: 100%;
}

.swiper-slide{
    background-color: ${props => props.theme.carouselColor};

    border-radius: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    img{
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
    }
}

.swiper-button-next{
    color: ${props => props.theme.text};
    right: 0;
    width: 4rem;
    top: 60%;
    
    background-image: url(${Arrow});
    background-position: center;
    background-size: cover;

    &:after{
        display: none;
    }

    @media (max-width: 64em){
    width: 3rem;

    }
    @media (max-width: 30em){
    width: 2rem;

    }
}
.swiper-button-prev{
    color: ${props => props.theme.text};
    left: 0;
    top: 60%;
    width: 4rem;
    transform: rotate(180deg);
    background-image: url(${Arrow});
    background-position: center;
    background-size: cover;

    &:after{
        display: none;
    }
    @media (max-width: 64em){
    width: 3rem;

    }
    @media (max-width: 30em){
    width: 2rem;

    }


}

`

const Carousel2 = () => {
    const [showIndicators, setShowIndicators] = useState(window.innerWidth > 768);  // 768px is equivalent to about 48em

    useEffect(() => {
        function handleResize() {
            if (window.matchMedia("(max-width: 768px)").matches) {  // Using 768px as the equivalent of 48em
                setShowIndicators(false);
            } else {
                setShowIndicators(true);
            }
        }

        // Listen for window resize event
        window.addEventListener('resize', handleResize);

        // Call the handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <Container>
        <Carousel
            autoPlay={true}
            showStatus={false}
            showThumbs={false}
            dynamicHeight={true}
            width={"100%"}
            infiniteLoop={true}
            showIndicators={showIndicators}
            className='carousel'
        >
            <div className='img-div'>
                <img src={img11} />
            </div>
            <div className='img-div'>
                <img src={img12} />
            </div>
            <div className='img-div'>
                <img src={img13} />
            </div>
            <div className='img-div'>
                <img src={img14} />
            </div>
            <div className='img-div'>
                <img src={img15} />
            </div>
        </Carousel>
    </Container>
  )
}

export default Carousel2