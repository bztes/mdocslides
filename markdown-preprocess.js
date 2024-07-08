import MagicString from 'magic-string';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkSectionize from 'remark-sectionize';
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
    .use(rehypeTocData)
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
  text = vFile.toString().replace(/&#x26;#(123|125|96|92);/g, '&#$1;');

  parsedContent.scripts.push(`
	  <script context="module">
      export const metadata = ${JSON.stringify(vFile.data.frontmatter)};
	    export const toc = ${JSON.stringify(vFile.data.toc)};
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

function rehypeTocData() {
  return (tree, file) => {
    let id = '';
    let title = '';
    let content = '';

    file.data.toc = {};

    visit(tree, (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        if (id) {
          file.data.toc[id] = { title, content };
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
      file.data.toc[id] = { title, content };
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
          properties: { className: ['copy', 'icon'] },
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
