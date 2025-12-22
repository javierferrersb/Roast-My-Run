import React from "react";

export function parseMarkdown(text: string): React.ReactNode {
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let key = 0;

  const pattern = /\*{1,4}([^\*]+)\*{1,4}/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const asteriskCount = match[0].match(/^\*+/)![0].length;
    const content = match[1];

    // Determine formatting based on asterisk count
    if (asteriskCount === 4) {
      // ****text**** → bold italic
      parts.push(
        <strong key={key}>
          <em>{content}</em>
        </strong>,
      );
    } else if (asteriskCount === 3) {
      // ***text*** → bold italic
      parts.push(
        <strong key={key}>
          <em>{content}</em>
        </strong>,
      );
    } else if (asteriskCount === 2) {
      // **text** → bold
      parts.push(<strong key={key}>{content}</strong>);
    } else {
      // *text* → italic
      parts.push(<em key={key}>{content}</em>);
    }

    key++;
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
