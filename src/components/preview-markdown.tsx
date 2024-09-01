import React from 'react';
import dompurify from 'dompurify';
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.css';

interface PreviewProps {
  markdown: string;
}

const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );

  const parsed = dompurify.sanitize(marked.parse(markdown) as string);
  return (
    <div dangerouslySetInnerHTML={{ __html: parsed }} />
  );
};

export { Preview };