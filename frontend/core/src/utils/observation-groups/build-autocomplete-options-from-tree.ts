import { map } from 'lodash';

import { TreeNodeCount } from '.';

/**
 * Recursive function to find the right node given an array of keys.
 */
function findNodeInTree(node: TreeNodeCount, keys: string[]): TreeNodeCount {
  if (keys.length === 0) {
    return node;
  }

  const nextKey = keys.shift();

  if (!node.children[nextKey]) {
    return null;
  }

  return findNodeInTree(node.children[nextKey], keys);
}

/**
 * For a given TreeNodeCount, returns an array of Option that can be used for an Autocomplete component.
 *
 * Example:
 *
 * Let's consider the following tree:
 *
 * const root = {
 *   count: -1,
 *   children: {
 *     A: {
 *       count: 2,
 *       children: {
 *         A1: { count: 1, children: {} },
 *         A2: { count: 1, children: {} }
 *       }
 *     },
 *     B: {
 *       count: 2,
 *       children: {
 *         B1: { count: 1, children: {} },
 *         B2: { count: 1, children: {} }
 *       }
 *     }
 *   }
 * }
 *
 * - buildAutocompleteOptionsFromTree(root) returns root
 * - buildAutocompleteOptionsFromTree(root, ['C']) returns null
 * - buildAutocompleteOptionsFromTree(root, ['A']) returns root.children['A']
 * - buildAutocompleteOptionsFromTree(root, ['A', 'A1]) returns root.children['A'].children:['A1]
 *
 * @param tree A node in the TreeNodeCount, ideally the root.
 * @param keys A relative path from the node passed as a first argument.
 * @returns a TreeNodeCount node relative to the given tree and keys passed.
 */
export function buildAutocompleteOptionsFromTree(tree: TreeNodeCount, keys: string[] = []) {
  const node = findNodeInTree(tree, keys);

  if (!node) {
    return [];
  }

  return map(node.children, (node, path) => ({
    label: path,
    value: path,
    count: node.count,
    lastObservedAt: node.lastObservedAt,
  })).sort((a, b) => a.label.localeCompare(b.label));
}
