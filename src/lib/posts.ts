import type { Component } from 'svelte';

export type Slug = string;

export interface PostMetadata {
  title: string;
  description: string;
}

export interface Post {
  slug: Slug;
  metadata: PostMetadata;
}

export interface PostTree {
  slug: string;
  children: PostTree[];
}

export interface PostSection {
  title: string;
  content: string;
}

export type PostSections = Record<string, PostSection>;

export interface MdFile {
  metadata: PostMetadata;
  sections: PostSections;
  default: Component;
}

export interface RawFile {
  default: string;
}

export const postsTree: PostTree[] = [];
export const postsMap: Record<Slug, Post> = {};
export const postComponents: Record<Slug, Component> = {};

export const mdFiles = globeImportToSlugMap<MdFile>(
  import.meta.glob('/src/posts/**/*.md', { eager: true }),
);

function globeImportToSlugMap<T>(globImport: Record<string, T>) {
  return Object.fromEntries(
    Object.entries(globImport).map(([k, v]) => [pathToSlug(k), v]),
  );
}

function pathToSlug(path: string) {
  return path.substring(11, path.length - 3).replace('/', '_');
}

function sortArticels(postsTree: PostTree[]) {
  postsTree.sort((a, b) => {
    if (a.children.length > 0 && b.children.length === 0) {
      return -1;
    }
    if (a.children.length === 0 && b.children.length > 0) {
      return 1;
    }
    const titleA = postsMap[a.slug].metadata.title;
    const titleB = postsMap[b.slug].metadata.title;
    return titleA.localeCompare(titleB);
  });
  postsTree.forEach((c) => sortArticels(c.children));
}

for (const [slug, mdFile] of Object.entries(mdFiles)) {
  let post: Post | undefined = undefined;
  let trees = postsTree;
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

    // create post if not exists
    post = postsMap[slug];
    if (!post) {
      post = {
        metadata: {
          title: slugArray[i],
          description: '',
        },
        slug,
      };
      postsMap[slug] = post;
    }
  }

  if (post && slugArray.at(-1) === 'index') {
    Object.assign(post.metadata, mdFile.metadata);
  } else {
    const childPost: Post = {
      metadata: mdFile.metadata,
      slug,
    };
    postsMap[slug] = childPost;
    post = childPost;
    trees.push({ slug, children: [] });
  }

  postComponents[post.slug] = mdFile.default;

  sortArticels(postsTree);
}
