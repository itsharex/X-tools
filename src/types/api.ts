import { FileNode } from './index';

/**
 * 暴露给渲染进程的Electron API接口
 */
export interface ElectronAPI {
  // 打开文件夹选择对话框
  selectDirectory: () => Promise<string | null>;
  // 获取文件树结构
  getFileTree: (path: string) => Promise<FileNode>;
}

// 扩展Window接口
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}