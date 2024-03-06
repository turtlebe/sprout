import React from 'react';
import { CustomNodeElementProps } from 'react-d3-tree/lib/types/common';
import { wordWrap as vocaWordWrap } from 'voca';

const dataTestIds = {};

export { dataTestIds as dataTestIdsCustomNode };

const textLayout = {
  title: {
    textAnchor: 'start',
    y: 40,
  },
  attributes: {
    x: 0,
    y: 40,
  },
  attribute: {
    x: 0,
    dy: '1.2em',
  },
};

function wordWrap(text = '', length = 50) {
  return vocaWordWrap(text, { width: length, cut: true }).split('\n');
}

export const CustomNode: React.FC<CustomNodeElementProps> = ({ toggleNode, nodeDatum, onNodeClick }) => {
  const status = nodeDatum.attributes['status'];

  let fill = 'black';
  if (status === 'SUCCESS') {
    fill = 'blue';
  } else if (status === 'FAILURE') {
    fill = 'red';
  } else if (status === 'RUNNING') {
    fill = 'green';
  } else if (status === 'CANCELED') {
    fill = 'orange';
  }

  const titleWrap = wordWrap(nodeDatum.name);

  return (
    <>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          fill="black"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      {nodeDatum.__rd3t.collapsed && nodeDatum.children.length !== 0 && (
        <line x1="0" x2="50" y1="0" y2="0" stroke="black" markerEnd="url(#arrow)" />
      )}
      <circle fill={fill} r={20} onClick={toggleNode}></circle>
      <g className="rd3t-label">
        <text className="rd3t-label__title" {...textLayout.title} onClick={onNodeClick}>
          {titleWrap.map((text, index) => (
            <tspan key={index} x="0" dy={index === 0 ? '0rem' : '1rem'}>
              {text}
            </tspan>
          ))}
        </text>
        <text className="rd3t-label__attributes" {...textLayout.attributes}>
          {nodeDatum.attributes &&
            Object.entries(nodeDatum.attributes).map(([, labelValue], i) => {
              const labelValueWrap = wordWrap(labelValue.toString());

              return labelValueWrap.map((text, index) => (
                <tspan
                  key={`${text}-${i}${index}`}
                  {...textLayout.attribute}
                  dy={index === 0 && i === 0 ? `${titleWrap.length + i + 0.2}rem` : '1.2rem'}
                >
                  {text}
                </tspan>
              ));
            })}
        </text>
      </g>
    </>
  );
};
