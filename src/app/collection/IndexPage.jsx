"use client";
import "./index-page.css";
import { Fragment, useRef, useState } from "react";

import { generateSlug } from "@/utils";
import products from "@/products";
import Footer from "@/components/Footer/Footer";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { useTransitionRouter } from "next-view-transitions";

const Page = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useTransitionRouter();
  const containerRef = useRef(null);

  const lenis = useLenis(({ scroll }) => {});

  const productDistribution = [
    [1, 0, 0, 1],
    [0, 1, 0, 0],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 0, 0],
    [0, 0, 1, 1],
    [1, 0, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ];

  const getProductLayout = () => {
    let productIndex = 0;
    const layout = [];

    for (let rowIndex = 0; productIndex < products.length; rowIndex++) {
      const rowLayout = [[], [], [], []];
      const rowDistribution =
        productDistribution[rowIndex % productDistribution.length];

      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const productCount = rowDistribution[colIndex];

        for (let i = 0; i < productCount; i++) {
          if (productIndex < products.length) {
            rowLayout[colIndex].push(products[productIndex]);
            productIndex++;
          }
        }
      }

      layout.push(rowLayout);
    }

    return layout;
  };

  const productLayout = getProductLayout();
  const getProductYear = (product) => {
    const y =
      product?.year ?? Number(String(product?.date ?? "").slice(0, 4));
    return Number.isFinite(y) ? y : null;
  };
  const yearByRowIndex = (() => {
    const result = {};
    let lastYear = null;

    for (let rowIndex = 0; rowIndex < productLayout.length; rowIndex++) {
      const row = productLayout[rowIndex];
      const firstProductInRow =
        row?.[0]?.[0] ?? row?.[1]?.[0] ?? row?.[2]?.[0] ?? row?.[3]?.[0] ?? null;
      const year = getProductYear(firstProductInRow);

      if (year != null && year !== lastYear) {
        result[rowIndex] = year;
        lastYear = year;
      }
    }

    return result;
  })();

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

  useGSAP(
    () => {
      const rows = gsap.utils.toArray(".row");

      gsap.fromTo(
        rows,
        {
          y: 300,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.85,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div className="index-page" ref={containerRef}>
      <div className="p-25"></div>
      <div className="products">
        {productLayout.map((row, rowIndex) => (
          <Fragment key={`group-${rowIndex}`}>
            {yearByRowIndex[rowIndex] != null && (
              <div className="row year-row" key={`year-${rowIndex}`}>
                <div className="year-label">{yearByRowIndex[rowIndex]}</div>
              </div>
            )}

            <div className="row" key={`row-${rowIndex}`}>
              {row.map((column, colIndex) => (
                <div
                  className={`column ${
                    column.length === 0 ? "empty-column" : ""
                  }`}
                  key={`col-${rowIndex}-${colIndex}`}
                >
                  {column.map((product) => (
                    <div
                      key={product.id}
                      className="product-link"
                      onClick={() =>
                        navigateTo(`/index/${generateSlug(product.name)}`)
                      }
                    >
                      <div className="product-card">
                        <div className="product-card-image">
                          <img
                            src={product.previewImg}
                            alt={product.name}
                            className="product-card-img"
                          />
                        </div>
                        <div className="product-info">
                          <p className="product-card-name">{product.name}</p>
                          <p className="product-card-price">${product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
      <div className="p-50"></div>
      <Footer />
    </div>
  );
};

export default Page;
