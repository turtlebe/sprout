export enum CommentableType {
  loadedTable = 'LOADED_TABLE',
  loadedTower = 'LOADED_TOWER',
  deviceId = 'DEVICE_ID',
}

export enum ContextType {
  table = 'TABLE',
  tower = 'TOWER',
  deviceLocationPath = 'DEVICE_LOCATION_PATH',
}

export interface Commentable {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  type: CommentableType;
}

export interface Comment {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  commentableId: string;
  commentableType: CommentableType;
  contextId: string;
  contextType: ContextType;
  content: string;
}
