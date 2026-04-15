"use client";
import "./home.css";
import { useRef, useState, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import { useTransitionRouter } from "next-view-transitions";
import assets from "@/assets.json";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.33, 1, 0.68, 1");
CustomEase.create("hop2", ".9, 0, .1, 1");

let isInitialLoad = true;
const productHeroImages = assets?.featured?.homeCarousel?.length
  ? assets.featured.homeCarousel
  : [];

export default function Home() {
  const router = useTransitionRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeProductImage, setActiveProductImage] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const container = useRef(null);
  const counterRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useEffect(() => {
    if (!isHeroVisible) return;
    if (productHeroImages.length === 0) return;

    const interval = setInterval(() => {
      setActiveProductImage((current) => (current + 1) % productHeroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHeroVisible]);

  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  const navigateTo = (path) => {
    if (isAnimating) return;

    setIsAnimating(true);

    router.push(path, {
      onTransitionReady: slideInOut,
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const startLoader = () => {
    const counterElement =
      document.querySelector(".count p") || counterRef.current;
    const totalDuration = 2000;
    const totalSteps = 11;
    const timePerStep = totalDuration / totalSteps;

    if (counterElement) {
      counterElement.textContent = "0";
    }

    let currentStep = 0;
    function updateCounter() {
      currentStep++;
      if (currentStep <= totalSteps) {
        const progress = currentStep / totalSteps;
        let value;

        if (currentStep === totalSteps) {
          value = 100;
        } else {
          const exactValue = progress * 100;
          const minValue = Math.max(Math.floor(exactValue - 5), 1);
          const maxValue = Math.min(Math.floor(exactValue + 5), 99);
          value =
            Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        }
        if (counterElement) {
          counterElement.textContent = value;
        }
        if (currentStep < totalSteps) {
          setTimeout(updateCounter, timePerStep);
        }
      }
    }

    setTimeout(updateCounter, timePerStep);
  };

  useEffect(() => {
    if (showPreloader) {
      startLoader();

      gsap.set(".home-page-content", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      const tl = gsap.timeline();

      tl.to(".count", {
        opacity: 0,
        delay: 2.5,
        duration: 0.25,
      });

      tl.to(".pre-loader", {
        scale: 0.5,
        ease: "hop2",
        duration: 1,
      });

      tl.to(".home-page-content", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.5,
        ease: "hop2",
        delay: -1,
      });

      tl.to(".loader", {
        height: "0",
        ease: "hop2",
        duration: 1,
        delay: -1,
      });

      tl.to(".loader-bg", {
        height: "0",
        ease: "hop2",
        duration: 1,
        delay: -0.5,
      });

      tl.to(".loader-2", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "hop2",
        duration: 1,
      });
    } else {
      gsap.set(".home-page-content", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });
    }
  }, [showPreloader]);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".home-hero-image",
        {
          autoAlpha: 0,
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          y: 70,
          scale: 1.035,
        },
        {
          autoAlpha: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          y: 0,
          scale: 1,
          ease: "hop",
          duration: 2.4,
          delay: showPreloader ? 4.9 : 1.10,
          onStart: () => setIsHeroVisible(true),
        }
      );
    },
    { scope: container, dependencies: [showPreloader] }
  );

  return (
    <div className="home-page" ref={container}>
      {showPreloader && (
        <>
          <div className="preloader-overlay">
            <div className="pre-loader">
              <div className="loader"></div>
              <div className="loader-bg"></div>
            </div>
            <div className="count">
              <p ref={counterRef}>0</p>
            </div>
            <div className="loader-2"></div>
          </div>

          <div className="preloader-bg-img">
            {assets?.featured?.homeHero && <img src={assets.featured.homeHero} alt="" />}
          </div>
        </>
      )}

      <div className="home-page-content">
        <div className="home-hero">
          <div
            className="home-hero-image"
            onClick={() => navigateTo(`/index/mirror-orb-mockup`)}
          >
            {productHeroImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt=""
                className={index === activeProductImage ? "active" : ""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
