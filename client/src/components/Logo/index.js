import React from "react";
import LogoIncepa from "../../assets/logo-incepa.png";
import "../Logo/styles.css";


function Logo() {

  return (
    <div className="logo-background">
    <img className="logo-room" src={LogoIncepa}/>
    </div>
  
  );
}


export default Logo;
