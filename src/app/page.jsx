"use client";
import "./home.css";
import { useRef, useState, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import assets from "@/assets.json";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.33, 1, 0.68, 1");
CustomEase.create("hop2", ".9, 0, .1, 1");

let isInitialLoad = true;

const rawCarousel = assets?.featured?.homeCarousel?.length
  ? assets.featured.homeCarousel
  : [];
/** Fallback so the hero is never empty (black screen). */
const productHeroImages =
  rawCarousel.length > 0 ? rawCarousel : ["/hero.gif"];

/**
 * Regola qui tempi e “dimensione” delle transizioni sulla home.
 *
 * ── SCHERMO BIANCO CHE SI RIMPICCIOLISCE ─────────────────────────────────────
 * 1) Scala fino a preLoaderScaleEnd (opacità resta 1).
 * 2) Poi opacità → 0 (forma già al minimo).
 * Timeline: [PRELOADER: schermo bianco → forma minima → fade]
 *   • preLoaderScaleEnd / preLoaderShrinkDuration
 *   • preLoaderFadeDuration (fade dopo aver raggiunto la scala minima)
 * ────────────────────────────────────────────────────────────────────────────
 */
const HOME = {
  /** Preloader GSAP */
  preloaderGifFadeDelay: 3,
  preloaderGifFadeDuration: 0.55,
  /** Restringimento fino alla forma minima (opacità ancora 1). */
  preLoaderScaleEnd: 0.0001,
  preLoaderShrinkDuration: 2.2,
  /** Fade a opacità 0 solo dopo che la scala è al minimo. */
  preLoaderFadeDuration: 0.45,
  contentRevealDuration: 3,
  loaderCollapseDuration: 2,
  loaderBgOverlap: -1.2,
  loader2Duration: 2,
  /** Hero: ingresso dopo il preloader (allineato al reveal del contenuto) */
  heroDelayWithPreloader: 5.5,
  heroDelayNoPreloader: 2.2,
  heroDurationWithPreloader: 3.2,
  heroDurationNoPreloader: 4.5,
  /** Se la timeline GSAP si blocca, forza fine preloader (ms) */
  preloaderSafetyMs: 35000,
  /** Slideshow immagini hero (ms) */
  heroCarouselIntervalMs: 8000,
};

export default function Home() {
  const [activeProductImage, setActiveProductImage] = useState(0);
  /** Incrementato ad ogni click sullo slider: rilancia l’interval e resetta il countdown. */
  const [heroCarouselResetKey, setHeroCarouselResetKey] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const container = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  /** Snapshot al primo render: decide delay hero senza re-run useGSAP quando il preloader finisce. */
  const hadPreloaderAtMount = useRef(showPreloader);

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useEffect(() => {
    productHeroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!isHeroVisible) return;
    if (productHeroImages.length === 0) return;

    const interval = setInterval(() => {
      setActiveProductImage((current) => (current + 1) % productHeroImages.length);
    }, HOME.heroCarouselIntervalMs);

    return () => clearInterval(interval);
  }, [isHeroVisible, heroCarouselResetKey]);

  useEffect(() => {
    if (!showPreloader) {
      const el = container.current?.querySelector(".home-page-content");
      if (el) {
        gsap.set(el, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        });
      }
      return;
    }

    const root = container.current;
    if (!root) return;

    gsap.set(root.querySelector(".home-page-content"), {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setShowPreloader(false);
        },
      });

      tl.to(".loader-gif", {
        opacity: 0,
        delay: HOME.preloaderGifFadeDelay,
        duration: HOME.preloaderGifFadeDuration,
      });

      /* [PRELOADER: schermo bianco → forma minima → fade] */
      gsap.set(".pre-loader", { opacity: 1, transformOrigin: "50% 50%" });

      tl.to(".pre-loader", {
        scale: HOME.preLoaderScaleEnd,
        ease: "hop2",
        duration: HOME.preLoaderShrinkDuration,
        transformOrigin: "50% 50%",
      });

      tl.to(".pre-loader", {
        opacity: 0,
        ease: "hop2",
        duration: HOME.preLoaderFadeDuration,
        transformOrigin: "50% 50%",
      });

      tl.to(".home-page-content", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: HOME.contentRevealDuration,
        ease: "hop2",
        delay: -1.2,
      });

      tl.to(".loader", {
        height: "0",
        ease: "hop2",
        duration: HOME.loaderCollapseDuration,
        delay: -1.2,
      });

      tl.to(".loader-bg", {
        height: "0",
        ease: "hop2",
        duration: HOME.loaderCollapseDuration,
        delay: HOME.loaderBgOverlap,
      });

      tl.to(".loader-2", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "hop2",
        duration: HOME.loader2Duration,
      });
    }, root);

    const safety = window.setTimeout(() => {
      setShowPreloader(false);
    }, HOME.preloaderSafetyMs);

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, [showPreloader]);

  useGSAP(
    () => {
      const withPreloader = hadPreloaderAtMount.current;
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
          duration: withPreloader
            ? HOME.heroDurationWithPreloader
            : HOME.heroDurationNoPreloader,
          delay: withPreloader
            ? HOME.heroDelayWithPreloader
            : HOME.heroDelayNoPreloader,
          onStart: () => setIsHeroVisible(true),
        }
      );
    },
    { scope: container, dependencies: [] }
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
            <div className="loader-gif">
              <img
                src="/loader.gif"
                alt=""
                decoding="async"
                fetchPriority="high"
              />
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
            onClick={() => {
              setActiveProductImage(
                (current) => (current + 1) % productHeroImages.length
              );
              setHeroCarouselResetKey((k) => k + 1);
            }}
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
