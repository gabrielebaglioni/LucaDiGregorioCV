"use client";
import "./Footer.css";

import Link from "next/link";

const Footer = () => {
  

  return (
    <div className="footer">
      <div className="footer-col">
        <p>
            Made by&nbsp;
            <Link href="">Frank</Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
