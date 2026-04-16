"use client";
import "./index-page.css";
import { useRef, useState } from "react";

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

  const allYears = Array.from(
    new Set(Object.values(yearByRowIndex).filter((y) => y != null))
  );

  // 2025 parte chiuso: per vedere le opere serve “esplodere” l’apice.
  const [collapsedByYear, setCollapsedByYear] = useState(() => {
    const initial = {};
    allYears.forEach((y) => {
      initial[y] = false;
    });
    initial[2025] = true;
    return initial;
  });

  const toggleYear = (year) => {
    setCollapsedByYear((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const yearSectionStarts = Object.entries(yearByRowIndex)
    .map(([k, v]) => ({ rowIndex: Number(k), year: v }))
    .sort((a, b) => a.rowIndex - b.rowIndex);

  const yearSections = yearSectionStarts.map((start, i) => {
    const endRow =
      i + 1 < yearSectionStarts.length
        ? yearSectionStarts[i + 1].rowIndex
        : productLayout.length;
    return {
      year: start.year,
      rowIndices: Array.from(
        { length: endRow - start.rowIndex },
        (_, j) => start.rowIndex + j
      ),
    };
  });

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
      const yearRows = gsap.utils.toArray(".year-row");
      const productRows = gsap.utils.toArray(
        ".year-section-group:not(.is-collapsed) .year-section-shell .row"
      );
      const rows = [...yearRows, ...productRows];

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
        {yearSections.map((section) => {
          const collapsed = collapsedByYear[section.year];

          return (
            <div
              className={`year-section-group ${collapsed ? "is-collapsed" : ""}`}
              key={`section-${section.year}`}
            >
              <div className="row year-row">
                <div className="year-label">
                  <span className="year-text">{section.year}</span>
                  <button
                    type="button"
                    className={`year-toggle ${collapsed ? "collapsed" : ""}`}
                    aria-expanded={!collapsed}
                    aria-label={
                      collapsed
                        ? `Apri ${section.year}`
                        : `Chiudi ${section.year}`
                    }
                    onClick={() => toggleYear(section.year)}
                  >
                    <span className="year-toggle-chevron" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              <div className="year-divider-line" aria-hidden="true" />

              <div
                className="year-section-shell"
                aria-hidden={collapsed}
                {...(collapsed ? { inert: "" } : {})}
              >
                <div className="year-section-inner">
                  {section.rowIndices.map((rowIndex) => {
                    const row = productLayout[rowIndex];
                    return (
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
                                  navigateTo(
                                    `/index/${generateSlug(product.name)}`
                                  )
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
                                    <p className="product-card-name">
                                      {product.name}
                                    </p>
                                    <p className="product-card-price">
                                      ${product.price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default Page;
