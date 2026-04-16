"use client";
import "./gallery-detail.css";
import { useParams } from "next/navigation";

import articles from "@/articles";
import { findArticleBySlug } from "@/utils";
import SharedDetailPage from "@/components/SharedDetailPage/SharedDetailPage";

const ArticleDetail = () => {
  const { slug } = useParams();
  const article = findArticleBySlug(articles, slug);

  if (!article) {
    return (
      <div className="article-not-found">
        <h1>Article not found</h1>
      </div>
    );
  }

  return (
    <SharedDetailPage
      variant="gallery"
      bannerSrc={article.detailImg || article.bannerImg}
      titleLabel="Title"
      title={article.title}
      authorLabel="Materials"
      author={article.materials}
      tags={[]}
      date={article.date}
      bodyCopy={article.bodyCopy?.slice(0, 1) ?? []}
    />
  );
};

export default ArticleDetail;
