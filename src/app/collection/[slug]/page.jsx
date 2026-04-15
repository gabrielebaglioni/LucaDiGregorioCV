"use client";
import "./product-detail.css";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";

import { findProductBySlug } from "@/utils";
import products from "@/products";
import Footer from "@/components/Footer/Footer";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLenis } from "lenis/react";
import { useTransitionRouter } from "next-view-transitions";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = findProductBySlug(products, slug);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useTransitionRouter();

  const containerRef = useRef(null);
  const descriptionRefs = useRef([]);

  const lenis = useLenis(({ scroll }) => {});

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

  useGSAP(() => {
    if (!containerRef.current || !product) return;

    gsap.set(".article-meta .revealer p", {
      y: "100%",
    });

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        delay: 0.85,
      },
    });

    tl.to(".article-meta .revealer p", {
      y: "0%",
      duration: 0.75,
      stagger: 0.05,
    });

    tl.fromTo(
      ".article-banner-img",
      {
        y: 300,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=2"
    );

    descriptionRefs.current.forEach((ref, index) => {
      if (ref) {
        const splitDescription = new SplitType(ref, {
          types: "lines",
          lineClass: "line",
        });

        splitDescription.lines.forEach((line) => {
          const content = line.innerHTML;
          line.innerHTML = `<span>${content}</span>`;
        });

        gsap.set(`#product-paragraph-${index} .line span`, {
          y: "100%",
          display: "block",
        });

        tl.to(
          `#product-paragraph-${index} .line span`,
          {
            y: "0%",
            duration: 0.75,
            stagger: 0.05,
          },
          "-=1.5"
        );
      }
    });
  }, [product, containerRef]);

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product not found</h1>
        <div className="back-link" onClick={() => navigateTo("/index")}>
          Back to Index
        </div>
      </div>
    );
  }

  const productCopy = [
    product.description.bodyCopy1,
    product.description.bodyCopy2,
  ];

  return (
    <div className="article-detail-page product-detail-page" ref={containerRef}>
      <div className="article-content">
        <div className="article-detail-col">
          <div className="article-banner-img">
            <img
              src={product.productImages[0]}
              alt={product.name}
            />
          </div>
        </div>
        <div className="article-detail-col article-meta">
          <div className="article-date">
            <div className="revealer">
              <p>Date</p>
            </div>
            <div className="revealer">
              <p>{product.date}</p>
            </div>
          </div>
          <div className="article-title">
            <div className="revealer">
              <p>Product Name</p>
            </div>
            <div className="revealer">
              <p>{product.name}</p>
            </div>
          </div>
          <div className="article-author">
            <div className="revealer">
              <p>Designer</p>
            </div>
            <div className="revealer">
              <p>By {product.designer}</p>
            </div>
          </div>
          <div className="article-tags">
            <div className="revealer">
              <p>Tags</p>
            </div>
            <div className="tags">
              {[product.category, product.fileType, product.compatibility].map(
                (tag, index) => (
                  <div className="revealer" key={index}>
                    <p>{tag}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="article-copy">
            <div className="revealer">
              <p>Description</p>
            </div>
            {productCopy.map((copy, index) => (
              <div className="article-copy" key={index}>
                <p
                  id={`product-paragraph-${index}`}
                  ref={(el) => (descriptionRefs.current[index] = el)}
                >
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
