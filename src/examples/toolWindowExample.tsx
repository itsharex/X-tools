import React from 'react';
import { ToolWindow } from '../types/toolWindow';
import {FileSearchOutlined, SearchOutlined} from "@ant-design/icons";

// 图标组件
const FolderIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
    </svg>
);

const InfoIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
);

const SearchIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
);

// 示例React组件
const FileExplorerPanel: React.FC = () => {
    return (
        <div className="file-explorer-panel">
            <h3>文件浏览器</h3>
            <p>这里显示文件树结构</p>
        </div>
    );
};

const PropertiesPanel: React.FC = () => {
    return (
        <div className="properties-panel">
            <h3>属性面板</h3>
            <p>这里显示选中项的属性</p>
        </div>
    );
};

const SearchPanel: React.FC = () => {
    return (
        <div className="search-panel">
            <h3>搜索面板</h3>
            <p>这里显示搜索功能</p>
        </div>
    );
};

/**
 * 创建预定义的工具窗口
 */
export const createToolWindows = (): ToolWindow[] => {
    return [
        new ToolWindow({
            id: 'file-explorer',
            name: '文件浏览器',
            description: '浏览和管理文件系统',
            isVisible: true,
            view: <FileExplorerPanel />,
            icon: <FolderIcon />,
            shortcut: 'Ctrl+Shift+E',
            defaultWidth: 300,
            defaultHeight: 400
        }),
        new ToolWindow({
            id: 'properties',
            name: '属性',
            description: '显示选中文件或文件夹的属性',
            isVisible: false,
            view: <PropertiesPanel />,
            icon: <InfoIcon />,
            shortcut: 'Ctrl+Shift+P',
            defaultWidth: 250,
            defaultHeight: 300
        }),
        new ToolWindow({
            id: 'search',
            name: '搜索',
            description: '搜索文件和内容',
            isVisible: false,
            view: <SearchPanel />,
            icon: <SearchOutlined />,
            shortcut: 'Ctrl+Shift+F',
            defaultWidth: 350,
            defaultHeight: 200
        })
    ];
};

/**
 * 使用示例
 */
export const exampleUsage = () => {
    // 创建工具窗口
    const toolWindows = createToolWindows();
    
    // 获取文件浏览器窗口
    const fileExplorer = toolWindows.find(w => w.id === 'file-explorer');
    
    if (fileExplorer) {
        console.log(`工具窗口名称: ${fileExplorer.name}`);
        console.log(`工具窗口描述: ${fileExplorer.description}`);
        console.log(`是否可见: ${fileExplorer.isVisible}`);
        
        // 切换可见性
        fileExplorer.toggle();
        console.log(`切换后是否可见: ${fileExplorer.isVisible}`);
        
        // 显示窗口
        fileExplorer.show();
        console.log(`显示后是否可见: ${fileExplorer.isVisible}`);
    }
    
    return toolWindows;
};