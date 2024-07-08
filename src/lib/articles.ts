import type { Component } from 'svelte';

export type Slug = string;

export interface ArticleMetadata {
  title: string;
  description: string;
}

export interface Article {
  slug: Slug;
  metadata: ArticleMetadata;
}

export interface ArticleTree {
  slug: string;
  children: ArticleTree[];
}

export interface ArticleTocEntry {
  title: string;
  content: string;
}

export type ArticleToc = Record<string, ArticleTocEntry>;

export interface MdFile {
  metadata: ArticleMetadata;
  toc: ArticleToc;
  default: Component;
}

export interface RawFile {
  default: string;
}

export const articlesTrees: ArticleTree[] = [];
export const articlesMap: Record<Slug, Article> = {};
export const articlesComponent: Record<Slug, Component> = {};

export const mdFiles = globeImportToSlugMap<MdFile>(
  import.meta.glob('/src/articles/**/*.md', { eager: true }),
);

function globeImportToSlugMap<T>(globImport: Record<string, T>) {
  return Object.fromEntries(
    Object.entries(globImport).map(([k, v]) => [pathToSlug(k), v]),
  );
}

function pathToSlug(path: string) {
  return path.substring(14, path.length - 3).replace('/', '_');
}

function sortArticels(articlesTrees: ArticleTree[]) {
  articlesTrees.sort((a, b) => {
    if (a.children.length > 0 && b.children.length === 0) {
      return -1;
    }
    if (a.children.length === 0 && b.children.length > 0) {
      return 1;
    }
    const titleA = articlesMap[a.slug].metadata.title;
    const titleB = articlesMap[b.slug].metadata.title;
    return titleA.localeCompare(titleB);
  });
  articlesTrees.forEach((c) => sortArticels(c.children));
}

for (const [slug, mdFile] of Object.entries(mdFiles)) {
  let article: Article | undefined = undefined;
  let trees = articlesTrees;
  const slugArray = slug.split('_');
  for (let i = 0; i < slugArray.length - 1; i++) {
    const slug = slugArray.slice(0, i + 1).join('_');

    // update tree
    let tree = trees.find((t) => t.slug === slug);
    if (!tree) {
      tree = { slug, children: [] };
      trees.push(tree);
    }
    trees = tree.children;

    // create article if not exists
    article = articlesMap[slug];
    if (!article) {
      article = {
        metadata: {
          title: slugArray[i],
          description: '',
        },
        slug,
      };
      articlesMap[slug] = article;
    }
  }

  if (article && slugArray.at(-1) === 'index') {
    Object.assign(article.metadata, mdFile.metadata);
  } else {
    const childArticle: Article = {
      metadata: mdFile.metadata,
      slug,
    };
    articlesMap[slug] = childArticle;
    article = childArticle;
    trees.push({ slug, children: [] });
  }

  articlesComponent[article.slug] = mdFile.default;

  sortArticels(articlesTrees);
}
