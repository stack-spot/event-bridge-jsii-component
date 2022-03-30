import * as index from '../lib/index';

describe('Index', () => {
  test('export EventBridge class', () => {
    const classes = Object.keys(index);
    expect(classes).toContain('EventBridge');
  });
});
