export function getPageRange(currentPage: number, totalPages: number): (number | string)[] {
  const MAX_VISIBLE_PAGES = 5;
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

  if (end === totalPages) {
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  }

  const range: (number | string)[] = [];

  if (start > 1) {
    range.push(1);
    if (start > 2) range.push("...");
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) range.push("...");
    range.push(totalPages);
  }

  return range;
}

// The total number of elements (including ellipses) is kept to MAX_VISIBLE_PAGES or less
