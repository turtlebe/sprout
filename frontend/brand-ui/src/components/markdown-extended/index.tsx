import Markdown from 'markdown-to-jsx';
import React from 'react';

const Link = ({ children, ...props }) => {
  return (
    <a title={props.title} href={props.href} className={props.className} target={props.target}>
      {children}
    </a>
  );
};
const OPTIONS = {
  overrides: {
    a: { component: props => <Link {...props} target="_blank" /> },
    InternalLink: { component: props => <Link {...props} /> },
  },
};

export const MarkdownExtended: React.FC<{ children: string }> = props => {
  const { children } = props;

  if (!children) {
    return <></>;
  }

  return (
    <Markdown options={OPTIONS} {...props}>
      {children}
    </Markdown>
  );
};
