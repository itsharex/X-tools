import React, {useState, useEffect} from 'react';
import {Typography, Spin, Empty, Space, Button} from 'antd';
import {FileTextOutlined, ReloadOutlined} from '@ant-design/icons';
import {Center} from "../common/Center";

interface TextViewerProps {
    filePath: string;
    fileName: string;
}

export const TextViewer: React.FC<TextViewerProps> = ({filePath, fileName}) => {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    const loadTextFile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (window.electronAPI) {
                const fileContent = await window.electronAPI.readFile(filePath);
                setContent(fileContent);
            } else {
                // 浏览器环境下的模拟
                const response = await fetch(filePath);
                if (response.ok) {
                    const fileContent = await response.text();
                    setContent(fileContent);
                } else {
                    throw new Error(`无法加载文件: ${response.statusText}`);
                }
            }
        } catch (err) {
            console.error('加载文本文件失败:', err);
            setError(err instanceof Error ? err.message : '加载文件失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTextFile();
    }, [filePath]);

    if (loading) {
        return (
            <Center>
                <Spin size="large"/>
                <div style={{marginTop: 16}}>正在加载文本文件...</div>
            </Center>
        );
    }

    if (error) {
        return (
            <Center>
                <Empty
                    description={error}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button 
                        type="primary" 
                        icon={<ReloadOutlined />}
                        onClick={loadTextFile}
                    >
                        重新加载
                    </Button>
                </Empty>
            </Center>
        );
    }

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{
                padding: '8px 16px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fafafa'
            }}>
                <Space>
                    <FileTextOutlined />
                    <Typography.Title level={5} style={{margin: 0}}>{fileName}</Typography.Title>
                </Space>
            </div>
            
            <div style={{flex: 1, overflow: 'auto', padding: '16px'}}>
                <pre style={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.5'
                }}>
                    {content}
                </pre>
            </div>
        </div>
    );
};