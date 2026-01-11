export function addHttpsPrefix(url: string): string {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

// "你好", "abc" -> true | "123" -> false
export function hasText(...strings: string[]): boolean {
  const textRegex = /\p{L}/u;
  return strings.some((str) => textRegex.test(str));
}
