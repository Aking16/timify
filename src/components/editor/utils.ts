import TurndownService from "turndown";
import { marked } from "marked";

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
});

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

export function markdownToHtml(md: string): string {
  if (!md) return "<p></p>";
  try {
    return marked(md, { async: false });
  } catch {
    return "<p></p>";
  }
}
