"use client";
import "./info.css";
import { useRef, useEffect } from "react";

import Footer from "@/components/Footer/Footer";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLenis } from "lenis/react";

const InfoPage = () => {
  const containerRef = useRef(null);
  const descriptionRef = useRef(null);

  const lenis = useLenis(({ scroll }) => {});

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(".info-wrapper .revealer p", {
      y: "100%",
    });

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        delay: 0.85,
      },
    });

    tl.to(".info-col:nth-child(1) .revealer p", {
      y: "0%",
      duration: 0.75,
      stagger: 0.1,
    });

    tl.to(
      ".info-col:nth-child(2) .revealer p",
      {
        y: "0%",
        duration: 0.75,
        stagger: 0.1,
      },
      "0"
    );

    if (descriptionRef.current) {
      const descriptionParagraphs =
        descriptionRef.current.querySelectorAll("p");

      descriptionParagraphs.forEach((paragraph) => {
        const splitDescription = new SplitType(paragraph, {
          types: "lines",
          lineClass: "line",
        });

        splitDescription.lines.forEach((line) => {
          const content = line.innerHTML;
          line.innerHTML = `<span>${content}</span>`;
        });
      });

      gsap.set("#info-description p .line span", {
        y: "100%",
        display: "block",
      });

      tl.to(
        "#info-description p .line span",
        {
          y: "0%",
          duration: 0.75,
          stagger: 0.05,
        },
        "-=2.5"
      );
    }
  }, [containerRef, descriptionRef]);

  return (
    <div className="info-page" ref={containerRef}>
      <div className="info-wrapper">
        <div className="info-col">
          <div className="info-item">
            <div className="info-title">
              <div className="revealer">
                <p>Info</p>
              </div>
            </div>
            <div
              className="info-copy"
              id="info-description"
              ref={descriptionRef}
            >
              <p>
                This site gathers selected works by Luca Di Gregorio—paintings,
                objects, and projects presented with clarity so each piece can be
                read on its terms. Browse the gallery for an overview of the body
                of work, and open individual entries for materials, dimensions, and
                context where available.
              </p>
              <p>
                The practice is grounded in attentive making and restrained
                presentation. Works are grouped and documented to support collectors,
                curators, and collaborators who engage with them in person and online.
              </p>
            </div>
          </div>
        </div>
        <div className="info-col">
          <div className="info-item">
            <div className="info-title">
              <div className="revealer">
                <p>What You Get</p>
              </div>
            </div>
            <div className="info-copy">
              <div className="revealer">
                <p>Gallery &amp; archive views</p>
              </div>
              <div className="revealer">
                <p>Detailed work sheets</p>
              </div>
              <div className="revealer">
                <p>Materials &amp; dimensions</p>
              </div>
              <div className="revealer">
                <p>Updated as new works join the studio</p>
              </div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-title">
              <div className="revealer">
                <p>Contact</p>
              </div>
            </div>
            <div className="info-copy">
              <div className="revealer">
                <p>Collaborations &amp; commissions</p>
              </div>
              <div className="revealer">
                <p>Please reach out through your usual channels with the studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InfoPage;
