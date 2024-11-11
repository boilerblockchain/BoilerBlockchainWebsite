import React from "react";
import { Link } from "react-router-dom";
import BBLogo from "../assets/bb_transparent.png";

const Logo = () => {
  return (
    <Link to="/">
        <img width={50} height={50} src={BBLogo} alt="BB Logo" />
    </Link>
  );
};

export default Logo;
