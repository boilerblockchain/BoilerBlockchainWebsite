import React from "react";
import { Link } from "react-router-dom";
import BBLogo from "../assets/Boiler_BLockchain_Logo_SVG.png";

const Logo = () => {
  return (
    <Link to="/">
        <img width={100} height={100} src={BBLogo} alt="BB Logo" />
    </Link>
  );
};

export default Logo;
