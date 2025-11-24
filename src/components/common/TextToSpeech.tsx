import React, {useEffect, useRef, useState} from 'react';
import {Button, Space, Tooltip} from 'antd';
import {PauseCircleOutlined, SoundOutlined, StopOutlined} from '@ant-design/icons';

interface TextToSpeechProps {
    text: string; // 要播放的文本
    onPlayStateChange?: (isPlaying: boolean) => void; // 播放状态变化回调
    className?: string; // 自定义类名
}

/**
 * 清理文本，移除HTML标签和特殊符号
 * @param text 原始文本
 * @returns 清理后的文本
 */
const cleanTextForSpeech = (text: string): string => {
    if (!text) return '';
    
    let cleanedText = text;
    
    // 1. 移除HTML标签
    cleanedText = cleanedText.replace(/<[^>]*>/g, '');
    
    // 2. 移除Markdown语法
    cleanedText = cleanedText
        // 移除标题标记
        .replace(/^#{1,6}\s+/gm, '')
        // 移除粗体和斜体标记
        .replace(/\*\*|__|\*|_/g, '')
        // 移除链接标记
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // 移除图片标记
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        // 移除列表标记
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        // 移除引用标记
        .replace(/^>\s+/gm, '')
        // 移除代码块标记
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1');
    
    // 3. 移除特殊符号
    cleanedText = cleanedText
        // 移除换行符和制表符，替换为空格
        .replace(/[\r\n\t]+/g, ' ')
        // 移除多余的空格
        .replace(/\s+/g, ' ')
        // 移除控制字符
        .replace(/[\x00-\x1F\x7F]/g, '')
        // 移除不必要的标点符号（保留基本标点）
        .replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。！？：；、,.!?;: ]/g, '')
        // 移除连续的标点符号
        .replace(/([，。！？：；、,.!?;:]){2,}/g, '$1');
    
    // 4. 清理首尾空格
    return cleanedText.trim();
};

/**
 * 语音播放组件
 * 接收文本作为参数，提供播放、暂停和停止功能
 */
const TextToSpeech: React.FC<TextToSpeechProps> = ({
                                                       text,
                                                       onPlayStateChange,
                                                       className
                                                   }) => {
    // 状态管理
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // 引用管理
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    
    // 清理后的文本
    const cleanedText = cleanTextForSpeech(text);

    // 初始化语音合成实例
    useEffect(() => {
        synthRef.current = window.speechSynthesis;

        // 清理函数
        return () => {
            if (utteranceRef.current) {
                synthRef.current?.cancel();
                utteranceRef.current = null;
            }
        };
    }, []);

    // 监听语音合成结束事件
    useEffect(() => {
        const handleSpeechEnd = () => {
            setIsPlaying(false);
            setIsPaused(false);
            utteranceRef.current = null;
            onPlayStateChange?.(false);
        };

        if (utteranceRef.current) {
            utteranceRef.current.onend = handleSpeechEnd;
        }

        return () => {
            if (utteranceRef.current) {
                utteranceRef.current.onend = null;
            }
        };
    }, [utteranceRef.current, onPlayStateChange]);

    // 当文本变化时，重置播放状态
    useEffect(() => {
        if (cleanedText !== utteranceRef.current?.text) {
            synthRef.current?.cancel();
            setIsPlaying(false);
            setIsPaused(false);
            utteranceRef.current = null;
            onPlayStateChange?.(false);
        }
    }, [cleanedText, onPlayStateChange]);

    // 播放/暂停功能
    const togglePlay = () => {
        if (!cleanedText) return;

        const synth = synthRef.current;
        if (!synth) return;

        if (isPlaying) {
            // 暂停播放
            synth.pause();
            setIsPlaying(false);
            setIsPaused(true);
            onPlayStateChange?.(false);
        } else {
            if (isPaused && utteranceRef.current) {
                // 继续播放
                synth.resume();
                setIsPlaying(true);
                setIsPaused(false);
                onPlayStateChange?.(true);
            } else {
                // 开始新的播放
                synth.cancel();

                const utterance = new SpeechSynthesisUtterance(cleanedText);
                utterance.lang = 'zh-CN'; // 设置中文语言
                utterance.rate = 1; // 语速
                utterance.pitch = 1; // 音调
                utterance.volume = 1; // 音量

                utteranceRef.current = utterance;
                synth.speak(utterance);

                setIsPlaying(true);
                setIsPaused(false);
                onPlayStateChange?.(true);
            }
        }
    };

    // 停止播放
    const stopPlay = () => {
        synthRef.current?.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        onPlayStateChange?.(false);
    };

    return (
        <Space size="small" className={className}>
            <Tooltip title={isPlaying ? '暂停' : isPaused ? '继续' : '播放'}>
                <Button
                    type="primary"
                    size="small"
                    icon={isPlaying ? <PauseCircleOutlined/> : <SoundOutlined/>}
                    onClick={togglePlay}
                    disabled={!cleanedText}
                >
                    {isPlaying ? '暂停' : isPaused ? '继续' : '播放'}
                </Button>
            </Tooltip>

            {(isPlaying || isPaused) && (
                <Tooltip title="停止">
                    <Button
                        size="small"
                        icon={<StopOutlined/>}
                        onClick={stopPlay}
                    >
                        停止
                    </Button>
                </Tooltip>
            )}
        </Space>
    );
};

export default TextToSpeech;