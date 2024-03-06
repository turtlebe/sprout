import CommentIcon from '@plentyag/brand-ui/src/assets/svg/comment-icon.svg';

export interface DrawCommentIcon {
  el: d3.Selection<any, any, any, any>;
  x: number;
  y: number;
  transform?: string;
}

export const drawCommentIcon = ({ el, x, y, transform }: DrawCommentIcon): void => {
  el.append('g')
    .attr('transform', transform)
    .attr('data-testid', 'comment-icon')
    .append('svg:image')
    .attr('xlink:href', CommentIcon)
    .attr('width', '24')
    .attr('height', '24')
    .attr('x', x)
    .attr('y', y);
};
