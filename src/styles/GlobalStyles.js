import { createGlobalStyle } from "styled-components";
import "@fontsource/akaya-telivigala"
import "@fontsource/sora"
import "@fontsource/lato"




const GlobalStyles = createGlobalStyle`

${'' /* 
*{
    outline: 1px solid red !important;
} */}

html{
    scroll-behavior: smooth;
}
*,*::before,*::after{
    margin: 0;
    padding: 0;
}

body{
    font-family: 'Lato', sans-serif;
    overflow-x: hidden;
    height: 100%;
    background-image: ${props => props.theme.body};
    background-size: 100% 100%;
    animation: Gradient 1s linear infinite;
    overflow-x: hidden;
}

@keyframes Gradient {
    0% {
      background-position: 0% 50%;  // Start with the gradient at the initial position
    }
    100% {
      background-position: 100% 50%;  // End with the gradient shifted completely to the right
    }
  }


h1,h2,h3,h4,h5,h6{
    margin: 0;
    padding: 0;
}
a{
    color: inherit;
    text-decoration:none;
}
`

export default GlobalStyles;