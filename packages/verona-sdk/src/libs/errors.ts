export class VeronaError extends Error {
  constructor(public message: string, public code?: string, public details?: unknown) {
    super(message);
    this.name = 'VeronaError';
  }
}
