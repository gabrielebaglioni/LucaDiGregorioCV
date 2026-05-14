import type { ProductVm } from "@/products";
import { generateSlug } from "./slug";

export function findIndexProductBySlug(
  products: ProductVm[],
  slug: string
): ProductVm | undefined {
  return products.find((product) => generateSlug(product.name) === slug);
}

