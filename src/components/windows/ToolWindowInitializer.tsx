import React from 'react';
import { ToolWindow } from '../../types/toolWindow';
import { toolWindowManager } from '../../utils/toolWindowManager';
import { 
    FileHistoryWindow, 
    SearchWindow, 
    PropertiesWindow 
} from './SampleToolWindows';
import { 
    HistoryOutlined, 
    SearchOutlined, 
    InfoCircleOutlined 
} from '@ant-design/icons';

/**
 * 初始化并注册示例工具窗口
 */
export const initializeSampleToolWindows = (selectedFile?: any) => {
    // 文件历史工具窗口
    const fileHistoryWindow = new ToolWindow({
        id: 'file-history',
        name: '文件历史',
        description: '显示最近访问的文件和文件夹',
        isVisible: false,
        view: <FileHistoryWindow />,
        icon: <HistoryOutlined />,
        shortcut: 'Ctrl+H',
        defaultWidth: 300
    });

    // 搜索工具窗口
    const searchWindow = new ToolWindow({
        id: 'search',
        name: '搜索',
        description: '搜索文件和内容',
        isVisible: false,
        view: <SearchWindow />,
        icon: <SearchOutlined />,
        shortcut: 'Ctrl+F',
        defaultWidth: 280
    });

    // 属性工具窗口
    const propertiesWindow = new ToolWindow({
        id: 'properties',
        name: '属性',
        description: '显示选中文件或文件夹的详细属性',
        isVisible: false,
        view: <PropertiesWindow selectedFile={selectedFile} />,
        icon: <InfoCircleOutlined />,
        shortcut: 'Alt+Enter',
        defaultWidth: 320
    });

    // 注册所有工具窗口
    toolWindowManager.register(fileHistoryWindow);
    toolWindowManager.register(searchWindow);
    toolWindowManager.register(propertiesWindow);

    return {
        fileHistoryWindow,
        searchWindow,
        propertiesWindow
    };
};

/**
 * 更新属性工具窗口的选中文件
 */
export const updatePropertiesWindow = (selectedFile?: any) => {
    const propertiesWindow = toolWindowManager.get('properties');
    if (propertiesWindow) {
        propertiesWindow.view = <PropertiesWindow selectedFile={selectedFile} />;
    }
};