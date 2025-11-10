import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// 配置文件路径
const CONFIG_DIR = path.join(os.homedir(), '.x-tools');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// 配置类型定义
export interface Config {
  recentFolders: {
    path: string;
    name: string;
    timestamp: number;
  }[];
  lastOpenedFolder?: {
    path: string;
    name: string;
    timestamp: number;
  };
}

// 默认配置
const DEFAULT_CONFIG: Config = {
  recentFolders: []
};

/**
 * 确保配置目录存在
 */
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * 读取配置文件
 * @returns 配置对象
 */
export function readConfig(): Config {
  ensureConfigDir();
  
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      const config = JSON.parse(data) as Config;
      
      // 如果没有lastOpenedFolder但有recentFolders，自动使用第一个recentFolder作为lastOpenedFolder
      if (!config.lastOpenedFolder && config.recentFolders && config.recentFolders.length > 0) {
        console.log('自动将第一个最近文件夹设为lastOpenedFolder');
        config.lastOpenedFolder = {...config.recentFolders[0]};
        // 立即保存更新后的配置
        writeConfig(config);
      }
      
      return config;
    }
  } catch (error) {
    console.error('读取配置文件失败:', error);
  }
  
  // 如果读取失败或文件不存在，返回默认配置
  return DEFAULT_CONFIG;
}

/**
 * 写入配置文件
 * @param config 配置对象
 */
export function writeConfig(config: Config): void {
  ensureConfigDir();
  
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('写入配置文件失败:', error);
  }
}

/**
 * 添加最近使用的文件夹
 * @param folderPath 文件夹路径
 */
export function addRecentFolder(folderPath: string): void {
  const config = readConfig();
  const folderName = path.basename(folderPath);
  const timestamp = Date.now();
  
  // 移除已存在的相同路径
  config.recentFolders = config.recentFolders.filter(folder => folder.path !== folderPath);
  
  // 添加到最前面
  config.recentFolders.unshift({
    path: folderPath,
    name: folderName,
    timestamp
  });
  
  // 更新上次打开的文件夹
    config.lastOpenedFolder = {
      path: folderPath,
      name: folderName,
      timestamp
    };
    
    console.log('更新lastOpenedFolder:', config.lastOpenedFolder);
    
    // 限制数量，只保留最近的10个
    if (config.recentFolders.length > 10) {
      config.recentFolders = config.recentFolders.slice(0, 10);
    }
    
    writeConfig(config);
    console.log('配置已保存到:', CONFIG_FILE);
}

/**
 * 获取最近使用的文件夹列表
 * @returns 文件夹列表
 */
export function getRecentFolders(): Config['recentFolders'] {
  return readConfig().recentFolders;
}

/**
 * 获取上次打开的文件夹
 * @returns 上次打开的文件夹信息，如果不存在则返回undefined
 */
export function getLastOpenedFolder(): Config['lastOpenedFolder'] {
  return readConfig().lastOpenedFolder;
}

/**
 * 更新指定文件夹的时间戳为当前时间
 * @param folderPath 文件夹路径
 */
export function updateFolderTimestamp(folderPath: string): void {
  const config = readConfig();
  const timestamp = Date.now();
  
  // 找到并更新recentFolders中的对应文件夹
  const folderIndex = config.recentFolders.findIndex(folder => folder.path === folderPath);
  
  if (folderIndex !== -1) {
    // 更新文件夹信息（保持名称不变，只更新时间戳）
    const updatedFolder = {
      ...config.recentFolders[folderIndex],
      timestamp
    };
    
    // 从原位置移除
    config.recentFolders.splice(folderIndex, 1);
    
    // 添加到最前面（最近使用）
    config.recentFolders.unshift(updatedFolder);
    
    // 同时更新lastOpenedFolder
    config.lastOpenedFolder = updatedFolder;
    
    console.log('更新文件夹时间戳:', updatedFolder);
    
    // 保存更新后的配置
    writeConfig(config);
  }
}

/**
 * 从最近文件夹列表中删除指定文件夹
 * @param folderPath 文件夹路径
 */
export function removeRecentFolder(folderPath: string): void {
  const config = readConfig();
  
  // 从recentFolders中移除指定路径的文件夹
  config.recentFolders = config.recentFolders.filter(folder => folder.path !== folderPath);
  
  // 如果lastOpenedFolder是被删除的文件夹，需要清除它
  if (config.lastOpenedFolder && config.lastOpenedFolder.path === folderPath) {
    config.lastOpenedFolder = undefined;
    // 如果还有其他最近文件夹，将第一个设为lastOpenedFolder
    if (config.recentFolders.length > 0) {
      config.lastOpenedFolder = { ...config.recentFolders[0] };
    }
  }
  
  console.log('删除文件夹:', folderPath);
  console.log('剩余最近文件夹数量:', config.recentFolders.length);
  
  // 保存更新后的配置
  writeConfig(config);
}