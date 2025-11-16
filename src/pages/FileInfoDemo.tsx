import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App } from 'antd';
import { AppProvider } from '../contexts/AppContext';
import FileInfoTest from '../components/FileInfoTest';
import '../index.css';

/**
 * 文件信息工具窗口演示页面
 */
const FileInfoDemo: React.FC = () => {
    return (
        <ConfigProvider>
            <App>
                <AppProvider>
                    <FileInfoTest />
                </AppProvider>
            </App>
        </ConfigProvider>
    );
};

// 如果直接运行此文件，创建一个独立的演示
if (typeof window !== 'undefined' && window.location.pathname.includes('file-info-demo')) {
    const root = ReactDOM.createRoot(
        document.getElementById('root') || document.body
    );
    root.render(<FileInfoDemo />);
}

export default FileInfoDemo;