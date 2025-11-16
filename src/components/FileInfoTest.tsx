import React from 'react';
import { Button, Space, Card } from 'antd';
import { toolWindowManager } from '../utils/toolWindowManager';
import { initializeSampleToolWindows } from '../components/windows/ToolWindowInitializer';
import { fileInfoToolWindow } from '../components/FileInfoToolWindow';

/**
 * 文件信息工具窗口测试组件
 */
const FileInfoTest: React.FC = () => {
    const handleInitialize = () => {
        console.log('初始化工具窗口...');
        initializeSampleToolWindows();
        console.log('工具窗口初始化完成');
    };

    const handleShowFileInfo = () => {
        console.log('显示文件信息工具窗口...');
        const fileInfoWindow = toolWindowManager.get('file-info');
        if (fileInfoWindow) {
            fileInfoWindow.show();
            console.log('文件信息工具窗口已显示');
        } else {
            console.error('未找到文件信息工具窗口');
        }
    };

    const handleHideFileInfo = () => {
        console.log('隐藏文件信息工具窗口...');
        const fileInfoWindow = toolWindowManager.get('file-info');
        if (fileInfoWindow) {
            fileInfoWindow.hide();
            console.log('文件信息工具窗口已隐藏');
        } else {
            console.error('未找到文件信息工具窗口');
        }
    };

    const handleToggleFileInfo = () => {
        console.log('切换文件信息工具窗口状态...');
        const fileInfoWindow = toolWindowManager.get('file-info');
        if (fileInfoWindow) {
            fileInfoWindow.toggle();
            console.log('文件信息工具窗口状态已切换:', fileInfoWindow.isVisible);
        } else {
            console.error('未找到文件信息工具窗口');
        }
    };

    const handleRegisterDirectly = () => {
        console.log('直接注册文件信息工具窗口...');
        toolWindowManager.register(fileInfoToolWindow);
        console.log('文件信息工具窗口已注册');
    };

    const handleListAllWindows = () => {
        const windows = toolWindowManager.getAll();
        console.log('所有工具窗口:', windows.map(w => ({
            id: w.id,
            name: w.name,
            isVisible: w.isVisible
        })));
    };

    return (
        <div style={{ padding: 20 }}>
            <Card title="文件信息工具窗口测试" style={{ marginBottom: 20 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                        type="primary" 
                        onClick={handleInitialize}
                        block
                    >
                        初始化所有工具窗口
                    </Button>
                    
                    <Button 
                        type="default" 
                        onClick={handleRegisterDirectly}
                        block
                    >
                        直接注册文件信息工具窗口
                    </Button>
                    
                    <Button 
                        type="default" 
                        onClick={handleShowFileInfo}
                        block
                    >
                        显示文件信息工具窗口
                    </Button>
                    
                    <Button 
                        type="default" 
                        onClick={handleHideFileInfo}
                        block
                    >
                        隐藏文件信息工具窗口
                    </Button>
                    
                    <Button 
                        type="default" 
                        onClick={handleToggleFileInfo}
                        block
                    >
                        切换文件信息工具窗口状态
                    </Button>
                    
                    <Button 
                        type="default" 
                        onClick={handleListAllWindows}
                        block
                    >
                        列出所有工具窗口
                    </Button>
                </Space>
            </Card>
            
            <Card title="使用说明">
                <p>
                    1. 点击"初始化所有工具窗口"来注册工具窗口到管理器<br/>
                    2. 点击"显示文件信息工具窗口"来显示文件信息面板<br/>
                    3. 在左侧文件树中选择文件或文件夹来查看详细信息<br/>
                    4. 使用快捷键 Ctrl+Shift+I 也可以切换工具窗口显示状态
                </p>
            </Card>
        </div>
    );
};

export default FileInfoTest;