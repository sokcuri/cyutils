export default class Base64 {
  static UrlSafeEncode(s: Buffer): string {
    return Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  static UrlSafeDecode(s: string): Buffer {
    return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') || '', 'base64');
  }
}
