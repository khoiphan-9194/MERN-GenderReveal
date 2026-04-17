import React from "react";
import { VscGithubAlt } from "react-icons/vsc";
import { AiOutlineLinkedin } from "react-icons/ai";
import { MdPortrait } from "react-icons/md";

function Footer() {
  return (
    <footer>
      {/* LEFT SIDE (text) */}
      <div className="footer-left">
        <h2>Made by Khoi Phan ©</h2>
      </div>

      {/* RIGHT SIDE (icons) */}
      <div className="footer-right">
        <a
          href="https://github.com/khoiphan-9194"
          target="_blank"
          rel="noreferrer"
        >
          <VscGithubAlt className="icon" />
        </a>

        <a
          href="https://profile.indeed.com/p/jasonp-0hin1ao/"
          target="_blank"
          rel="noreferrer"
        >
          <AiOutlineLinkedin className="icon" />
        </a>

        <a
          href="https://kp-portfolio-2025.onrender.com/"
          target="_blank"
          rel="noreferrer"
        >
          <MdPortrait className="icon" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
