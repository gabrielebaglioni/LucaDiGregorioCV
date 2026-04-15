"use client";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

/**
 * Pagina dettaglio condivisa (Gallery + Index).
 * - Nessun footer
 * - 100svh + no scroll (blocca overflow)
 * - Stesso markup/classi così le posizioni restano identiche
 */
export default function SharedDetailPage({
  variant, // "gallery" | "index"
  bannerSrc,
  titleLabel,
  title,
  authorLabel,
  author,
  tagsLabel = "Tags",
  tags = [],
  dateLabel = "Date",
  date,
  descriptionLabel = "Description",
  bodyCopy = [],
}) {
  const containerRef = useRef(null);
  const descriptionRefs = useRef([]);

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.set(".article-meta .revealer p", { y: "100%" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", delay: 0.85 },
      });

      tl.to(".article-meta .revealer p", {
        y: "0%",
        duration: 0.75,
        stagger: 0.05,
      });

      tl.fromTo(
        ".article-banner-img",
        { y: 300, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=2"
      );

      descriptionRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const split = new SplitType(ref, { types: "lines", lineClass: "line" });

        split.lines.forEach((line) => {
          const content = line.innerHTML;
          line.innerHTML = `<span>${content}</span>`;
        });

        const paragraphId =
          variant === "gallery"
            ? `#article-paragraph-${index}`
            : `#product-paragraph-${index}`;

        gsap.set(`${paragraphId} .line span`, { y: "100%", display: "block" });

        tl.to(
          `${paragraphId} .line span`,
          { y: "0%", duration: 0.75, stagger: 0.05 },
          "-=1.5"
        );
      });
    },
    { scope: containerRef, dependencies: [variant] }
  );

  return (
    <div className="article-detail-page" ref={containerRef}>
      <div className="article-content">
        <div className="article-detail-col">
          <div className="article-banner-img">
            <img src={bannerSrc} alt={title} />
          </div>
        </div>

        <div className="article-detail-col article-meta">
          <div className="article-date">
            <div className="revealer">
              <p>{dateLabel}</p>
            </div>
            <div className="revealer">
              <p>{date}</p>
            </div>
          </div>

          <div className="article-title">
            <div className="revealer">
              <p>{titleLabel}</p>
            </div>
            <div className="revealer">
              <p>{title}</p>
            </div>
          </div>

          <div className="article-author">
            <div className="revealer">
              <p>{authorLabel}</p>
            </div>
            <div className="revealer">
              <p>By {author}</p>
            </div>
          </div>

          <div className="article-tags">
            <div className="revealer">
              <p>{tagsLabel}</p>
            </div>
            <div className="tags">
              {tags.map((tag, index) => (
                <div className="revealer" key={`${tag}-${index}`}>
                  <p>{tag}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="article-copy">
            <div className="revealer">
              <p>{descriptionLabel}</p>
            </div>
            {bodyCopy.map((copy, index) => (
              <div className="article-copy" key={index}>
                <p
                  id={
                    variant === "gallery"
                      ? `article-paragraph-${index}`
                      : `product-paragraph-${index}`
                  }
                  ref={(el) => (descriptionRefs.current[index] = el)}
                >
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

