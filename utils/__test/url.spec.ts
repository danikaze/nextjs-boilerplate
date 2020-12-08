import 'jest';
import { addUrlParam, addUrlParams } from '../url';

describe('addUrlParam', () => {
  it('should treat corner cases for parameters', () => {
    // empty param name
    expect(addUrlParam('url', '', 'b')).toBe('url');
    // empty string value
    expect(addUrlParam('url', 'a', '')).toBe('url?a=');
    // null value
    // tslint:disable-next-line:no-any
    expect(addUrlParam('url', 'a', null as any)).toBe('url');
    // undefined value
    // tslint:disable-next-line:no-any
    expect(addUrlParam('url', 'a', undefined as any)).toBe('url');
  });

  it('should add params to url without parameters', () => {
    expect(addUrlParam('', 'a', 'b')).toBe('?a=b');

    const result = addUrlParam('/url/base', 'param', 'value');
    const expected = '/url/base?param=value';
    expect(result).toBe(expected);
  });

  it('should add params to urls with parameters', () => {
    const result = addUrlParam('/url/base?foo=bar', 'param', 'value');
    const expected = '/url/base?foo=bar&param=value';
    expect(result).toBe(expected);
  });
});

describe('addUrlParams', () => {
  it('should add params to empty urls', () => {
    const result = addUrlParams('/url/base', { a: 'b', n: 123 });
    const expected = '/url/base?a=b&n=123';
    expect(result).toBe(expected);
  });

  it('should add params to urls with parameters', () => {
    const result = addUrlParams('/url/base?foo=bar', { a: 'b', n: 123 });
    const expected = '/url/base?foo=bar&a=b&n=123';
    expect(result).toBe(expected);
  });
});
