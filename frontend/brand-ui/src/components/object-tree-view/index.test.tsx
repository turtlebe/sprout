import { render } from '@testing-library/react';
import { Settings } from 'luxon';
import React from 'react';

import { dataTestIdsObjectTreeView as dataTestIds, ObjectTreeView } from '.';

function renderObjectTreeView(object: any, formatValue?: boolean) {
  const { queryByTestId, debug } = render(<ObjectTreeView object={object} formatValue={formatValue} />);
  const root = queryByTestId(dataTestIds.root);
  expect(root).toBeInTheDocument();
  return { root, debug };
}

function expandTreeItem(element) {
  const childContent = element.getElementsByClassName('MuiTreeItem-content')[0] as HTMLDivElement;
  childContent.click(); // to expand
}

describe('ObjectTreeView', () => {
  describe('default usage', () => {
    it('renders nothing if object is empty', () => {
      const { queryByTestId } = render(<ObjectTreeView object={{}} />);
      expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    });

    it('renders value types: string, number, boolean', () => {
      const { root } = renderObjectTreeView({ x: 'hello-world', y: 10, z: true });
      expect(root.childElementCount).toBe(3);
      expect(root.children[0]).toHaveTextContent('x: hello-world');
      expect(root.children[1]).toHaveTextContent('y: 10');
      expect(root.children[2]).toHaveTextContent('z: true');
    });

    it('renders "undefined" and "null" items', () => {
      const { root } = renderObjectTreeView({ x: undefined, y: null });
      expect(root.childElementCount).toBe(2);
      expect(root.children[0]).toHaveTextContent('x: undefined');
      expect(root.children[1]).toHaveTextContent('y: null');
    });

    it('renders array', () => {
      const { root } = renderObjectTreeView({ x: [1, 2] });
      expect(root.childElementCount).toBe(1);

      const child = root.children[0];
      expect(child).toHaveTextContent('x (Array)');

      expandTreeItem(child);

      const arrayElements = child
        .getElementsByClassName('MuiTreeItem-group')[0]
        .getElementsByClassName('MuiTreeItem-content');
      expect(arrayElements[0]).toHaveTextContent('Index 0: 1');
      expect(arrayElements[1]).toHaveTextContent('Index 1: 2');
    });

    it('renders empty array', () => {
      const { root } = renderObjectTreeView({ x: [] });
      expect(root.childElementCount).toBe(1);
      expect(root.children[0]).toHaveTextContent('x (Array): empty');
    });

    it('renders empty object', () => {
      const { root } = renderObjectTreeView({ x: {} });
      expect(root.childElementCount).toBe(1);
      expect(root.children[0]).toHaveTextContent('x: empty object');
    });

    it('renders object with nested object', () => {
      const { root } = renderObjectTreeView({ x: { a: 1, b: 2 } });
      expect(root.childElementCount).toBe(1);

      const child = root.children[0];
      expect(child).toHaveTextContent('x');

      expandTreeItem(child);

      const objectElements = child
        .getElementsByClassName('MuiTreeItem-group')[0]
        .getElementsByClassName('MuiTreeItem-content');
      expect(objectElements[0]).toHaveTextContent('a: 1');
      expect(objectElements[1]).toHaveTextContent('b: 2');
    });
  });

  describe('with formatValue option', () => {
    beforeAll(() => {
      Settings.defaultZone = 'America/Los_Angeles';
    });

    afterAll(() => {
      Settings.defaultZone = 'system';
    });

    it('renders value types: string, number, boolean, date strings', () => {
      const { root } = renderObjectTreeView(
        { x: 'hello-world', y: 10, z: true, d: '2022-09-08T20:35:25.430837Z' },
        true
      );
      expect(root.childElementCount).toBe(4);
      expect(root.children[0]).toHaveTextContent('X: hello-world');
      expect(root.children[1]).toHaveTextContent('Y: 10');
      expect(root.children[2]).toHaveTextContent('Z: true');
      expect(root.children[3]).toHaveTextContent('D: 09/08/2022 01:35 PM');
    });

    it('renders "undefined" and "null" items', () => {
      const { root } = renderObjectTreeView({ x: undefined, y: null }, true);
      expect(root.childElementCount).toBe(2);
      expect(root.children[0]).toHaveTextContent('X: undefined');
      expect(root.children[1]).toHaveTextContent('Y: null');
    });

    it('renders array', () => {
      const { root } = renderObjectTreeView({ x: [1, 2] }, true);
      expect(root.childElementCount).toBe(1);

      const child = root.children[0];
      expect(child).toHaveTextContent('X (Array)');

      expandTreeItem(child);

      const arrayElements = child
        .getElementsByClassName('MuiTreeItem-group')[0]
        .getElementsByClassName('MuiTreeItem-content');
      expect(arrayElements[0]).toHaveTextContent('Index 0: 1');
      expect(arrayElements[1]).toHaveTextContent('Index 1: 2');
    });

    it('renders empty array', () => {
      const { root } = renderObjectTreeView({ x: [] }, true);
      expect(root.childElementCount).toBe(1);
      expect(root.children[0]).toHaveTextContent('X (Array): empty');
    });

    it('renders empty object', () => {
      const { root } = renderObjectTreeView({ x: {} }, true);
      expect(root.childElementCount).toBe(1);
      expect(root.children[0]).toHaveTextContent('X: empty object');
    });

    it('renders object with nested object', () => {
      const { root } = renderObjectTreeView({ x: { a: 1, b: 2 } }, true);
      expect(root.childElementCount).toBe(1);

      const child = root.children[0];
      expect(child).toHaveTextContent('X');

      expandTreeItem(child);

      const objectElements = child
        .getElementsByClassName('MuiTreeItem-group')[0]
        .getElementsByClassName('MuiTreeItem-content');
      expect(objectElements[0]).toHaveTextContent('A: 1');
      expect(objectElements[1]).toHaveTextContent('B: 2');
    });
  });
});
