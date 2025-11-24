import React, {useEffect, useRef, useState} from 'react';
import {Button, Space, Tooltip} from 'antd';
import {PauseCircleOutlined, SoundOutlined, StopOutlined} from '@ant-design/icons';

interface TextToSpeechProps {
    text: string; // 要播放的文本
    onPlayStateChange?: (isPlaying: boolean) => void; // 播放状态变化回调
    className?: string; // 自定义类名
}

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
        if (text !== utteranceRef.current?.text) {
            synthRef.current?.cancel();
            setIsPlaying(false);
            setIsPaused(false);
            utteranceRef.current = null;
            onPlayStateChange?.(false);
        }
    }, [text, onPlayStateChange]);

    // 播放/暂停功能
    const togglePlay = () => {
        if (!text.trim()) return;

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

                const utterance = new SpeechSynthesisUtterance(text);
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
                    disabled={!text.trim()}
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