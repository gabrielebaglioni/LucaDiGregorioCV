import type { ArticleVm } from "@/articles";
import { generateSlug } from "./slug";

export function findGalleryArticleBySlug(
  articles: ArticleVm[],
  slug: string
): ArticleVm | undefined {
  return articles.find((article) => {
    if (article.slug) return article.slug === slug;
    return generateSlug(article.title) === slug;
  });
}

