// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from 'electron';
import { FileNode } from './types/index';

// 暴露文件系统相关功能给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 打开文件夹选择对话框
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  // 获取文件树结构
  getFileTree: (path: string) => ipcRenderer.invoke('fs:getFileTree', path) as Promise<FileNode>,
});

// 导入API类型定义
import './types/api';
