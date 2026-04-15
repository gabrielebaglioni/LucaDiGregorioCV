"use client";

import "./Menu.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";

import {
  formatCityLabelFromTimeZone,
  formatLocalClockTime,
  getBrowserTimeZone,
} from "@/utils/localTime";

const BRAND_NAME = "Luca Di Gregorio";

const Menu = () => {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [localClock, setLocalClock] = useState("");
  const [localPlaceLabel, setLocalPlaceLabel] = useState("");

  const isHome = pathname === "/";
  const isGallery = pathname === "/gallery" || pathname?.startsWith("/gallery/");
  const primaryHref = isGallery ? "/index" : "/gallery";
  const primaryLabel = isGallery ? "Index" : "Gallery";

  useEffect(() => {
    const tz = getBrowserTimeZone();
    setLocalPlaceLabel(formatCityLabelFromTimeZone(tz));

    const updateTime = () => {
      setLocalClock(formatLocalClockTime(new Date()));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
    if (isAnimating || pathname === path) return;

    setIsAnimating(true);

    router.push(path, {
      onTransitionReady: slideInOut,
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const handleNavigate = (event, path) => {
    event.preventDefault();
    navigateTo(path);
  };

  return (
    <nav className="menu" aria-label="Primary navigation">
      <div className="nav-corner nav-corner-top-left">
        <div className="revealer">
          <a href="/" onClick={(event) => handleNavigate(event, "/")}>
            {BRAND_NAME}
          </a>
        </div>
      </div>

      <div className="nav-corner nav-corner-top-right">
        <div className="revealer">
          <a
            href={primaryHref}
            onClick={(event) => handleNavigate(event, primaryHref)}
          >
            {primaryLabel}
          </a>
        </div>
      </div>

      {isHome && (
        <div className="nav-corner nav-corner-bottom-left">
          <div className="revealer">
            <p>
              {localPlaceLabel ? `${localPlaceLabel} ` : ""}
              {localClock}
            </p>
          </div>
        </div>
      )}

      <div className="nav-corner nav-corner-bottom-right">
        <div className="revealer">
          <a href="/info" onClick={(event) => handleNavigate(event, "/info")}>
            Info
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
