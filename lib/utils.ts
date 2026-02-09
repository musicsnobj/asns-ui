export function extractDateFromFilename(filename: string): string {
  const DATE_RE = /(\d{2}-\d{2}-\d{4})/;
  const match = filename.match(DATE_RE);

  if (!match) {
    throw new Error(`No MM-DD-YYYY date found in filename: ${filename}`);
  }

  const dateStr = match[1];
  const [month, day, year] = dateStr.split("-");

  // Create date object (months are 0-indexed in JS)
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Validate the date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date in filename: ${filename}`);
  }

  // Return ISO format (YYYY-MM-DD)
  return date.toISOString().split("T")[0];
}

export function dateToNumber(date: Date): string {
  const year = date.getFullYear();

  // getMonth() is zero-based, so add 1
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
