export type MethodTypes = 'tell' | 'trigger' | 'request';

export interface FarmDefMethod {
  description: string;
  kind: 'method';
  name: string;
  parentEntityPath?: string;
  parentPath: string;
  path: string;
  properties?: {};
  ref?: string;
  protoMessageDescriptor?: any;
  protocol?: any;
  protoMessageFullName?: string;
  requestProtoMessageFullName?: string;
  responseProtoMessageFullName?: string;
  type: MethodTypes;
}
