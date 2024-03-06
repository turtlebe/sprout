import * as d3 from 'd3';

import { drawCommentIcon } from '.';

const x = 0;
const y = 15;
describe('drawCommentIcon', () => {
  let node, el;

  beforeEach(() => {
    node = document.createElement('svg');
    el = d3.select(node);
  });

  it('draws a comment icon', () => {
    expect(drawCommentIcon({ el, x, y }));

    expect(node.innerHTML).toContain(
      '<g data-testid="comment-icon"><image href="comment-icon.svg" width="24" height="24" x="0" y="15"></image></g>'
    );
  });

  it('draws a comment icon with transform', () => {
    expect(drawCommentIcon({ el, x, y, transform: 'translate(10, 10)' }));

    expect(node.innerHTML).toContain(
      '<g transform="translate(10, 10)" data-testid="comment-icon"><image href="comment-icon.svg" width="24" height="24" x="0" y="15"></image></g>'
    );
  });
});
