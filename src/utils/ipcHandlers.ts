import { ipcMain, dialog } from 'electron';
import { getFileTree } from './fileUtils';

/**
 * 注册所有IPC处理程序
 */
export function registerIpcHandlers() {
  // 处理文件夹选择对话框请求
  ipcMain.handle('dialog:selectDirectory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: '选择文件夹',
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  // 处理获取文件树请求
  ipcMain.handle('fs:getFileTree', async (event, dirPath: string) => {
    try {
      return getFileTree(dirPath);
    } catch (error) {
      console.error('获取文件树失败:', error);
      throw error;
    }
  });
}