export interface TruncateStartOptions {
  length: number;
}

export function truncateStart(content: string, options: TruncateStartOptions = { length: 30 }): string {
  if (!content) {
    return content;
  }

  if (content.length > options.length) {
    return '...' + content.slice(-options.length);
  }

  return content;
}
