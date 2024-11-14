import React, { useEffect } from 'react';

import img1 from "../assets/images/1.jpg";
import img2 from "../assets/images/2.jpg";
import img3 from "../assets/images/3.jpg";
import img4 from "../assets/images/4.jpg";
import img5 from "../assets/images/5.jpg";
import img6 from "../assets/images/6.jpg";
import img7 from "../assets/images/7.jpg";
import img8 from "../assets/images/8.jpg";
import img9 from "../assets/images/9.jpg";
import img10 from "../assets/images/10.jpg";

// Image data structure
const IMAGES = [
  { title: "Image 1", src: img1 },
  { title: "Image 2", src: img2 },
  { title: "Image 3", src: img3 },
  { title: "Image 4", src: img4 },
  { title: "Image 5", src: img5 },
  { title: "Image 6", src: img6 },
  { title: "Image 7", src: img7 },
  { title: "Image 8", src: img8 },
  { title: "Image 9", src: img9 },
  { title: "Image 10", src: img10 },
];

const IMAGE_HEIGHT = 325; // Main height control for each image
const IMAGE_WIDTH = 550; // Width of the images

export const AutoScrollCarousel = () => {
  const duplicatedImages = [...IMAGES, ...IMAGES];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scrollVertical {
        0% { transform: translateY(0); }
        100% { transform: translateY(calc(-${IMAGE_HEIGHT}px * ${IMAGES.length})) }
      }
      .animate-scroll-vertical {
        animation: scrollVertical 120s linear infinite;
        height: calc(${IMAGE_HEIGHT}px * ${IMAGES.length * 2});
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${IMAGE_HEIGHT * 2.25}px` }}>
      {/* Vertical Sliding Track */}
      <div className="animate-scroll-vertical">
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 mb-4"
            style={{ height: `${IMAGE_HEIGHT}px`, width: `${IMAGE_WIDTH}px` }}
          >
            <img
              src={image.src}
              alt={`${image.title}`}
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoScrollCarousel;
