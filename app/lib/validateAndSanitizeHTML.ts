export function validateAndSanitizeHTML(content: string) {
  // Basic HTML sanitization using regex and allow list
  const sanitizeHtml = (html: string) => {
    const allowedTags = [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ol",
      "ul",
      "li",
      "a",
      "img",
      "span",
    ];

    const allowedAttributes = [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "style", // Add style attribute to preserve color
      "class", // Add class attribute to preserve font classes
    ];

    // Remove any HTML tags not in the allow list
    const strippedHtml = html.replace(/<\/?([^>]+)>/gi, (match, tag) => {
      const cleanTag = tag.split(" ")[0].toLowerCase();
      return allowedTags.includes(cleanTag) ? match : "";
    });

    // Remove attributes not in the allow list, but preserve color and font-related styles/classes
    const sanitizedHtml = strippedHtml.replace(/<([^>]+)>/gi, (match) => {
      return match.replace(/\s+(\w+)="([^"]*)"/gi, (fullAttr, attrName, attrValue) => {
        // If it's a style attribute, keep color and background-color styles
        if (attrName.trim() === "style") {
          const styleMatches = attrValue.match(/(color|background-color):\s*rgb\([^)]+\)/gi);
          if (styleMatches) {
            return ` style="${styleMatches.join("; ")}"`;
          }
          return "";
        }

        // Preserve font-related classes (like ql-font-monospace)
        if (attrName.trim() === "class") {
          const fontClasses = attrValue.match(/ql-font-\w+/g);
          return fontClasses ? ` class="${fontClasses.join(" ")}"` : "";
        }

        return allowedAttributes.includes(attrName.trim()) ? fullAttr : "";
      });
    });

    return sanitizedHtml;
  };

  const cleanHtml = sanitizeHtml(content);

  // Basic link processing
  const processLinks = (html: string) => {
    return html.replace(/<a\s+href="([^"]+)">([^<]+)<\/a>/gi, (match, href, text) => {
      const sanitizedHref = href.startsWith("https://")
        ? href
        : "https://" + href.replace(/^(https?:\/\/)?(www\.)?/, "");

      return `<a href="${sanitizedHref}">${text}</a>`;
    });
  };

  // Return the sanitized HTML
  return processLinks(cleanHtml);
}
