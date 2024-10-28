const AVERAGE_WORDS_PER_MINUTE = 183;

// Calculate the reading time of a given text in minutes
export function getReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / AVERAGE_WORDS_PER_MINUTE);
  return minutes;
}
