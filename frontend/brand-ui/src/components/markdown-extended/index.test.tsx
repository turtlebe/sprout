import { render } from '@testing-library/react';
import React from 'react';

import { MarkdownExtended } from '.';

describe('MarkdownExtended', () => {
  it('handles empty string', () => {
    const { container } = render(<MarkdownExtended>{''}</MarkdownExtended>);

    expect(container).toBeEmptyDOMElement();
  });

  it('handles null', () => {
    const { container } = render(<MarkdownExtended>{null}</MarkdownExtended>);

    expect(container).toBeEmptyDOMElement();
  });

  it('handles undefined', () => {
    const { container } = render(<MarkdownExtended>{undefined}</MarkdownExtended>);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders regular markdown', () => {
    const content = '# MyTitle';
    const { container } = render(<MarkdownExtended>{content}</MarkdownExtended>);

    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveTextContent('MyTitle');
  });

  it('renders links with target=_blank', () => {
    const content = '[link](https://farmos.plenty.tools)';
    const { container } = render(<MarkdownExtended>{content}</MarkdownExtended>);
    expect(container.querySelector('a')).toBeInTheDocument();
    expect(container.querySelector('a')).toHaveAttribute('href', 'https://farmos.plenty.tools');
    expect(container.querySelector('a')).toHaveAttribute('target', '_blank');
  });

  it('renders internal links (without target=_blank)', () => {
    const content = '<InternalLink href="https://farmos.plenty.tools">link</InternalLink>';
    const { container } = render(<MarkdownExtended>{content}</MarkdownExtended>);
    expect(container.querySelector('a')).toBeInTheDocument();
    expect(container.querySelector('a')).toHaveAttribute('href', 'https://farmos.plenty.tools');
    expect(container.querySelector('a')).not.toHaveAttribute('target');
  });
});
