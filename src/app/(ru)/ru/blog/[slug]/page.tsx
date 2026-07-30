import type { Metadata } from "next";

import {
  BlogPostPageView,
  buildBlogPostMetadata,
  generateBlogPostStaticParams,
} from "@/components/blog-post-page";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return generateBlogPostStaticParams("ru");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildBlogPostMetadata(slug, "ru");
}

export default async function RuBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostPageView slug={slug} locale="ru" />;
}

export const revalidate = 300;
