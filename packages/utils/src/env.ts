export class Env {
  static isDev(): boolean {
    return process.env['NODE_ENV']?.toLowerCase()?.startsWith('dev') || false;
  }

  static isProd(): boolean {
    return process.env['NODE_ENV']?.toLowerCase()?.startsWith('prod') || false;
  }
}
