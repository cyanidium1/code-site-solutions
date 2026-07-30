import type { Metadata } from "next";

import {
  BlogPostPageView,
  buildBlogPostMetadata,
  generateBlogPostStaticParams,
} from "@/components/blog-post-page";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return generateBlogPostStaticParams("uk");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildBlogPostMetadata(slug, "uk");
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostPageView slug={slug} locale="uk" />;
}

export const revalidate = 300;
