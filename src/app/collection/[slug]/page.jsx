"use client";
import "./product-detail.css";
import { useParams } from "next/navigation";

import { findProductBySlug } from "@/utils";
import products from "@/products";
import SharedDetailPage from "@/components/SharedDetailPage/SharedDetailPage";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = findProductBySlug(products, slug);

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product not found</h1>
      </div>
    );
  }

  const productCopy = [
    product.description.bodyCopy1,
    product.description.bodyCopy2,
  ];

  return (
    <SharedDetailPage
      variant="index"
      bannerSrc={product.productImages[0]}
      titleLabel="Title"
      title={product.name}
      authorLabel="Materials"
      author={product.designer}
      tags={[]}
      date={product.date}
      bodyCopy={productCopy}
    />
  );
};

export default ProductDetail;
