import fs from 'node:fs';
import path from 'node:path';
import { FileNode } from '../types';

/**
 * 递归获取文件树结构
 * @param dirPath 目录路径
 * @returns 文件树节点
 */
export function getFileTree(dirPath: string): FileNode {
  const stats = fs.statSync(dirPath);
  const name = path.basename(dirPath);
  const node: FileNode = {
    id: dirPath,
    name,
    path: dirPath,
    isDirectory: stats.isDirectory(),
  };

  if (stats.isDirectory()) {
    try {
      const files = fs.readdirSync(dirPath);
      node.children = files
        .map(file => {
          const filePath = path.join(dirPath, file);
          try {
            return getFileTree(filePath);
          } catch (error) {
            // 忽略无法访问的文件或目录
            return null;
          }
        })
        .filter((item): item is FileNode => item !== null)
        .sort((a, b) => {
          // 目录排在文件前面
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          // 然后按名称排序
          return a.name.localeCompare(b.name);
        });
    } catch (error) {
      // 如果无法读取目录，设置children为空数组
      node.children = [];
    }
  }

  return node;
}