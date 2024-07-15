import FlexSearch from 'flexsearch';
import type { PostTocs } from '../routes/api/posts/toc/+server';

export interface SearchIndexEntry {
  slug: string;
  id: string;
  title: string;
  content: string;
}

export type SearchIndexEntries = Record<string, SearchIndexEntry>;

export interface SearchResult {
  slug: string;
  id: string;
  title: string;
  excerpts: string[];
}

export type SearchResults = SearchResult[];

let flexIndex: FlexSearch.Index;
let searchItems: SearchIndexEntries;

export function createPostsIndex(postTocs: PostTocs) {
  flexIndex = new FlexSearch.Index({ tokenize: 'forward' });

  searchItems = {};
  for (const [slug, postToc] of Object.entries(postTocs)) {
    for (const [id, props] of Object.entries(postToc)) {
      const searchIndexEntryId = `${slug}#${id}`;
      const searchIndexEntry: SearchIndexEntry = {
        slug,
        id,
        title: props.title,
        content: props.content,
      };
      searchItems[searchIndexEntryId] = searchIndexEntry;
      flexIndex.add(searchIndexEntryId, `${props.title} ${props.content}`);
    }
  }
}

export function searchPostsIndex(searchTerm: string): SearchResults {
  const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const slugs = flexIndex.search(match);
  return slugs.map((s) => {
    const searchItem = searchItems[s];

    return {
      slug: searchItem.slug,
      id: searchItem.id,
      title: addMarker(searchItem.title, match),
      excerpts: trimMatch(searchItem.content, match).map((s) =>
        addMarker(s, match),
      ),
    };
  });
}

function addMarker(text: string, match: string) {
  const regex = new RegExp(match, 'gi');
  return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
}

function trimMatch(text: string, searchTerm: string) {
  const regex = new RegExp(searchTerm, 'gi');
  const indexes = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    indexes.push(match.index);
  }

  const excerpts: string[] = [];
  let end = 0;
  for (const index of indexes) {
    const start = Math.max(end - searchTerm.length, index - 20);
    if (index < start) {
      continue;
    }

    end = start + 100;
    const excerpt = text.substring(start, end).trim();
    excerpts.push(excerpt);
  }

  return excerpts;
}
