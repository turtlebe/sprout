import { flatMap } from 'lodash';
import { RouteComponentProps, RouteProps } from 'react-router-dom';

interface SideNavTreeNodeArgs {
  name: string;
  isLoading?: boolean;
  parent?: SideNavTreeNode;
  href?: string;
  route?: RouteProps;
  redirect?: boolean;
}

export class SideNavTreeNode {
  public name: string;
  public isLoading: boolean;
  public parent: SideNavTreeNode;
  public children: SideNavTreeNode[];
  public href: string;
  public redirect: boolean;
  public route: SideNavTreeNodeArgs['route'];
  public readonly id: string;

  public constructor(args: SideNavTreeNodeArgs) {
    this.name = args.name;
    this.isLoading = args.isLoading;
    this.parent = args.parent;
    this.href = args.href;
    this.route = args.route;
    this.redirect = args.redirect;
    this.children = [];
    this.id = args.parent ? this.generateId(this) : 'root';
  }

  public addNode(args: SideNavTreeNodeArgs): SideNavTreeNode {
    const child = new SideNavTreeNode({ ...args, parent: this });
    this.children.push(child);

    return child;
  }

  public isLeaf(): boolean {
    return this.children.length === 0;
  }

  public isRoot(): boolean {
    return this.parent === undefined;
  }

  /**
   * This method returns the path to a leaf tree node that best matches the given "match.url".
   * The result of this function is used to show the selected tree node. The leaf tree
   * node will show as selected when a given "match.url" is the subpath of the leaf tree node.
   *
   * For example, if tree has leaf nodes: '/quality/report', '/quality', and '/quality/report/details'.
   * if the given match.url is '/quality/report/test1' then the returned path will be: 'quality/report'
   * if the given match.url is '/quality/report/test1/test2 then the returned path will be: 'quality/report'
   * if the given match.url is '/quality/report/details/test1 then the returned path will be: 'quality/report/details'
   * if the given match.url is '/quality then the returned path will be: '/quality'
   */
  public getTreePath(match: RouteComponentProps['match']): SideNavTreeNode[] {
    // find all matching leaf nodes.
    const childrenMatching = flatMap(this.children, child => (child.isLeaf() ? child : child.children)).filter(leaf =>
      match.url.startsWith(leaf.href)
    );

    // for all matching children, find the one that is the deepest match (ie, longest).
    // for example, it is possible one leaf node is '/quality/report' and another '/quality/report/details'.
    // if the given match.url is /quality/report/details/xyz, then both will match but we pick the deepest match.
    let childMatching = childrenMatching.reduce(
      (prev, curr) => (!prev || curr.href.length > prev.href.length ? curr : prev),
      null
    );

    // This function makes sense to be called only the root node.
    // If no child matched, defaults the path to the root.
    // This will sets the Breadcrumbs properly to just "Quality".
    if (!childMatching) {
      return [this];
    }

    const path: SideNavTreeNode[] = [];

    while (!childMatching.isRoot()) {
      path.unshift(childMatching);
      childMatching = childMatching.parent;
    }

    //  add the root
    path.unshift(childMatching);

    return path;
  }

  private generateId(node: SideNavTreeNode): string {
    const path: string[] = [];

    while (!node.isRoot()) {
      path.unshift(node.name);
      node = node.parent;
    }

    //  add the root
    path.unshift('root');

    return path.join('/');
  }
}
