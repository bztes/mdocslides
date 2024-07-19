import MagicString from 'magic-string';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import { visit } from 'unist-util-visit';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import rehypeCodeTitles from 'rehype-code-titles';
import { JSDOM } from 'jsdom';

/**
 *
 * @returns @type {@svelte/compiler').PreprocessorGroup}
 */
export function svelteMarkdown() {
  return {
    name: 'svelte-markdown',
    markup: ({ content, filename }) => {
      if (filename?.endsWith('.md')) {
        return processMarkdown(content, filename);
      }
    },
  };
}

/**
 *
 * @param {string} content
 * @returns
 */
function toHtml(content) {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkParseFrontmatter)
    .use(remarkUnwrapImages)
    .use(remarkSectionize)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeCodeTitles)
    .use(rehypeCopyCode)
    .use(rehypeShiki, {
      theme: 'github-dark-default',
    })
    .use(rehypeRemoveStyle, ['pre'])
    .use(rehypeEscapeSvelte)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      properties: { class: 'icon icon-link' },
      content: {
        type: 'text',
        value: 'link',
      },
    })
    .use(rehypeSectionsData)
    .use(rehypeStringify, {
      allowDangerousHtml: true,
      allowDangerousCharacters: true,
    })
    .process(content);
}

/**
 *
 * @param {string} content
 * @param {string} filename
 * @returns
 */
export async function processMarkdown(content, filename) {
  const parsedContent = parseSvelte(content);

  // generate html and  undo escaping of &-character
  let text = parsedContent.text.join('');
  const vFile = await toHtml(text);
  text = vFile.toString();

  // Postprocess
  text = text.replace(/&#x26;#(123|125|96|92);/g, '&#$1;');
  text = text.replaceAll(
    /data-dispatchevent-on([a-z]+)="([a-z]+)"/g,
    'on$1={(e) => e.currentTarget.dispatchEvent(new Event("$2"))}',
  );

  parsedContent.scripts.push(`
	  <script context="module">
      export const metadata = ${JSON.stringify(vFile.data.frontmatter)};
	    export const sections = ${JSON.stringify(vFile.data.sections)};
    </script>
    `);

  const html = new MagicString(`
    ${parsedContent.scripts.join('\n')}
    ${text}
    ${parsedContent.styles.join('\n')}`);

  return {
    code: html.toString(),
    map: html.generateMap({ source: filename }),
  };
}

/**
 *
 * @param {string} content
 * @returns
 */
function parseSvelte(content) {
  const scripts = [];
  const styles = [];
  const text = [];

  const dom = new JSDOM(`<root>${content}</root>`, { contentType: 'text/xml' });
  Array.from(dom.window.document.firstChild.childNodes).map((n) => {
    if (n.nodeName === 'script') {
      scripts.push(n.outerHTML);
    } else if (n.nodeName === 'style') {
      styles.push(n.outerHTML);
    } else if (n.nodeName === '#text') {
      text.push(n.nodeValue);
    } else {
      text.push(n.outerHTML);
    }
  });

  return { scripts, styles, text };
}

function remarkSectionize() {
  function isHeading(node) {
    return node.type === 'heading';
  }

  function countChildren(children, startIndex) {
    for (let i = startIndex; i < children.length; i++) {
      if (isHeading(children[i])) {
        return i - startIndex;
      }
    }
    return children.length - startIndex;
  }

  return (tree) => {
    const children = tree.children ?? [];
    for (let index = 0; index < children.length; index++) {
      const node = children[index];
      if (!isHeading(node)) {
        continue;
      }

      const childCount = countChildren(children, index + 1);
      const section = {
        type: 'section',
        data: {
          hName: 'section',
        },
        children: [],
      };
      section.children = children.splice(index, childCount + 1, section);
    }
  };
}

function rehypeEscapeSvelte() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'code') {
        return;
      }

      visit(node, 'text', (textNode) => {
        textNode.value = textNode.value
          .replace(
            /[{}`]/g,
            (c) => ({ '{': '&#123;', '}': '&#125;', '`': '&#96;' })[c],
          )
          .replace(/\\([trn])/g, '&#92;$1');
      });
    });
  };
}

function rehypeSectionsData() {
  return (tree, file) => {
    let id = '';
    let title = '';
    let content = '';

    file.data.sections = {};

    visit(tree, (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        if (id) {
          file.data.sections[id] = { title, content };
        }
        id = node.properties.id;
        title = node.children
          .filter((child) => child.type === 'text')
          .map((child) => child.value)
          .join(' ');
        content = '';
      } else if (node.type === 'text') {
        content += ' ' + node.value;
      }
    });

    if (id) {
      file.data.sections[id] = { title, content };
    }
  };
}

export function rehypeCopyCode() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'div') return;
      if (node.properties.className[0] !== 'rehype-code-title') return;

      node.children = [
        {
          type: 'element',
          tagName: 'span',
          children: [{ type: 'text', value: node.children[0].value }],
        },
        {
          type: 'element',
          tagName: 'button',
          properties: {
            className: ['copy', 'icon'],
            'data-dispatchevent-onclick': 'copycode',
          },
          children: [{ type: 'text', value: 'content_copy' }],
        },
      ];
    });
  };
}

export function rehypeRemoveStyle(tagNames) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (!tagNames || tagNames.includes(node.tagName)) {
        node.properties.style = '';
      }
    });
  };
}
