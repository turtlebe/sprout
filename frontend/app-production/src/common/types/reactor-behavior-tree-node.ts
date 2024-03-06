export interface ReactorBehaviorTreeNode {
  name: string;
  description?: string;
  status?: {
    description: string;
    status: string;
  };
  childNodes: ReactorBehaviorTreeNode[];
}
