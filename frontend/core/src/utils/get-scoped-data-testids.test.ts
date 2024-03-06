import { getScopedDataTestIds } from './get-scoped-data-testids';

const dataTestIds = {
  root: 'root',
  title: 'title',
  content: 'content',
};

describe('getScopedDataTestIds', () => {
  it('returns the dataTestIds object', () => {
    expect(getScopedDataTestIds(dataTestIds)).toEqual(dataTestIds);
  });

  it('returns the dataTestIds object with prefix', () => {
    expect(getScopedDataTestIds(dataTestIds, 'prefix-')).toEqual({
      root: 'prefix-',
      title: 'prefix-title',
      content: 'prefix-content',
    });
  });

  it('supports nesting getScopedDataTestIds', () => {
    const parentDataTestIds = {
      root: 'root',
      children: getScopedDataTestIds(dataTestIds),
    };

    expect(getScopedDataTestIds(parentDataTestIds)).toEqual({
      root: 'root',
      children: dataTestIds,
    });
  });

  it('supports nesting getScopedDataTestIds with prefix', () => {
    const parentDataTestIds = {
      root: 'root',
      children: getScopedDataTestIds(dataTestIds, 'subprefix-'),
    };

    expect(getScopedDataTestIds(parentDataTestIds)).toEqual({
      root: 'root',
      children: {
        root: 'subprefix-',
        title: 'subprefix-title',
        content: 'subprefix-content',
      },
    });
  });

  it('supports dataTestIds with functions', () => {
    const dataTestIdsWithFunctions = {
      root: 'root',
      title: 'title',
      getContent: (item: string) => `content-${item}`,
    };

    const dataTestIds = getScopedDataTestIds(dataTestIdsWithFunctions, 'prefix');

    expect(dataTestIds.root).toEqual('prefix');
    expect(dataTestIds.title).toEqual('prefix-title');
    expect(dataTestIds.getContent('test')).toEqual('prefix-content-test');
  });

  it('adds dash to prefix', () => {
    expect(getScopedDataTestIds(dataTestIds, 'prefix')).toEqual({
      root: 'prefix',
      title: 'prefix-title',
      content: 'prefix-content',
    });
  });

  it('adds root by default without prefix to prefix', () => {
    expect(getScopedDataTestIds({})).toEqual({
      root: 'root',
    });
  });

  it('supports nesting getScopedDataTestIds', () => {
    const dataTestIdsChild = {
      root: 'root',
      loader: 'loader',
    };
    const dataTestIds = getScopedDataTestIds({
      root: 'root',
      child: key => getScopedDataTestIds(dataTestIdsChild, key),
    });

    expect(dataTestIds).toEqual({
      root: 'root',
      child: expect.any(Function),
    });
    expect(dataTestIds.child('key1')).toEqual({ root: 'key1', loader: 'key1-loader' });
  });
});
