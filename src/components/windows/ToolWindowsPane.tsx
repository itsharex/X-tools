import React, { useState, useEffect } from 'react';
import { Button, Flex, Tooltip } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { ToolWindow } from '../../types/toolWindow';
import { toolWindowManager } from '../../utils/toolWindowManager';
import { initializeSampleToolWindows, updatePropertiesWindow } from './ToolWindowInitializer';
import { useAppContext } from '../../contexts/AppContext';
import './ToolWindowsPane.css';

interface ToolWindowsPaneProps {
    /** 工具窗口管理器实例 */
    manager?: typeof toolWindowManager;
    /** 默认宽度 */
    defaultWidth?: number;
}

export const ToolWindowsPane: React.FC<ToolWindowsPaneProps> = ({
    manager = toolWindowManager,
    defaultWidth = 300
}) => {
    const { currentFile } = useAppContext();
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [availableWindows, setAvailableWindows] = useState<ToolWindow[]>([]);

    // 初始化工具窗口
    useEffect(() => {
        initializeSampleToolWindows(currentFile);
        
        const updateWindows = () => {
            const windows = manager.getAll();
            setAvailableWindows(windows);
            
            // 如果没有活跃窗口且有可用窗口，自动显示第一个窗口
            if (!activeWindowId && windows.length > 0) {
                const firstWindow = windows[0];
                manager.show(firstWindow.id);
                setActiveWindowId(firstWindow.id);
            }
            // 如果当前活跃窗口不在可用窗口中，切换到第一个可用窗口
            else if (activeWindowId && !windows.find(w => w.id === activeWindowId) && windows.length > 0) {
                const firstWindow = windows[0];
                manager.show(firstWindow.id);
                setActiveWindowId(firstWindow.id);
            }
        };

        updateWindows();
        
        // 定期检查工具窗口变化
        const interval = setInterval(updateWindows, 100);
        return () => clearInterval(interval);
    }, [manager, activeWindowId, currentFile]);

    // 当当前文件变化时，更新属性窗口
    useEffect(() => {
        updatePropertiesWindow(currentFile);
    }, [currentFile]);

    // 切换工具窗口显示
    const toggleWindow = (windowId: string) => {
        const window = manager.get(windowId);
        if (!window) return;

        // 总是显示选中的窗口，不隐藏任何窗口
        manager.show(windowId);
        setActiveWindowId(windowId);
    };

    // 获取当前活跃的工具窗口
    const activeWindow = activeWindowId ? manager.get(activeWindowId) : null;

    if (availableWindows.length === 0) {
        return (
            <div className="tool-windows-pane empty">
                <div className="empty-state">
                    <ToolOutlined style={{ fontSize: 24, color: '#ccc' }} />
                    <div style={{ color: '#999', marginTop: 8 }}>暂无工具窗口</div>
                </div>
            </div>
        );
    }

    return (
        <div className="tool-windows-pane">
            {/* 工具窗口显示区域 */}
            <div 
                className="tool-window-content"
                style={{ 
                    width: defaultWidth,
                    minWidth: 200
                }}
            >
                {activeWindow && (
                    <div className="tool-window-wrapper">
                        <div className="tool-window-header">
                            <div className="tool-window-title">
                                {activeWindow.icon && (
                                    <span className="tool-window-icon">{activeWindow.icon}</span>
                                )}
                                <span>{activeWindow.name}</span>
                            </div>
                        </div>
                        <div className="tool-window-body">
                            {activeWindow.view}
                        </div>
                    </div>
                )}
            </div>

            {/* 右侧图标工具栏 */}
            <div className="tool-window-toolbar">
                {availableWindows.map((window) => (
                    <Tooltip key={window.id} title={window.name} placement="left">
                        <Button
                            type="text"
                            size="small"
                            className={`toolbar-button ${activeWindowId === window.id ? 'active' : ''}`}
                            onClick={() => toggleWindow(window.id)}
                            icon={window.icon || <ToolOutlined />}
                        />
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};