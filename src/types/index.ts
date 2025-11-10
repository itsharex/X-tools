// 文件树节点类型
export interface FileNode {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

// Tree组件数据类型
export interface TreeNodeData {
    title: string;
    key: string;
    icon?: string;
    children?: TreeNodeData[];
}