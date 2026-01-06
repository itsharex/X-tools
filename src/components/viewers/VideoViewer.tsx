import React, { useEffect, useRef, useState } from 'react';
import { toFileUrl } from '../../utils/fileCommonUtil';
import { findSubtitleFiles, loadAndParseSubtitle, SubtitleItem, getCurrentSubtitle } from '../../utils/subtitleUtil';
import { useAppContext } from "../../contexts/AppContext";

interface VideoViewerProps {
    path: string;
}

// 获取视频播放进度的存储键
const getVideoProgressKey = (path: string): string => {
    return `video_progress_${path}`;
};

// 保存播放进度
const saveVideoProgress = (path: string, currentTime: number): void => {
    try {
        // console.log('Saving video progress:', path, currentTime); 大概每秒保存三四次
        localStorage.setItem(getVideoProgressKey(path), currentTime.toString());
    } catch (error) {
        console.warn('Failed to save video progress:', error);
    }
};

// 获取播放进度
const getVideoProgress = (path: string): number => {
    try {
        const saved = localStorage.getItem(getVideoProgressKey(path));
        return saved ? parseFloat(saved) : 0;
    } catch (error) {
        console.warn('Failed to get video progress:', error);
        return 0;
    }
};

export const VideoViewer: React.FC<VideoViewerProps> = ({ path }) => {
    const { autoPlay } = useAppContext()
    const videoRef = useRef<HTMLVideoElement | null>(null);
    
    // 字幕相关状态
    const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
    const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleItem | null>(null);
    const [subtitleFiles, setSubtitleFiles] = useState<string[]>([]);
    const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(0);
    const subtitlesRef = useRef<HTMLDivElement | null>(null);

    // 保存播放进度
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video && video.duration) {
            // 只在播放时保存进度，避免在拖拽时频繁保存
            if (!video.paused && !video.seeking) {
                saveVideoProgress(path, video.currentTime);
            }
            
            // 更新当前字幕
            const subtitle = getCurrentSubtitle(subtitles, video.currentTime);
            setCurrentSubtitle(subtitle);
        }
    };

    // 恢复播放进度
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const savedProgress = getVideoProgress(path);
            if (savedProgress > 0) {
                // 设置一个小的延迟确保视频已经准备好
                const timer = setTimeout(() => {
                    if (video.duration && savedProgress < video.duration - 2) {
                        video.currentTime = savedProgress;
                        console.log(`Restored video progress: ${savedProgress}s`);
                    }
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [path]);
    
    // 查找字幕文件
    useEffect(() => {
        const searchSubtitles = async () => {
            const files = await findSubtitleFiles(path);
            setSubtitleFiles(files);
            setSelectedSubtitleIndex(0);
        };
        
        searchSubtitles();
    }, [path]);
    
    // 加载选中的字幕文件
    useEffect(() => {
        const loadSubtitle = async () => {
            if (subtitleFiles.length > 0 && selectedSubtitleIndex < subtitleFiles.length) {
                const subtitlePath = subtitleFiles[selectedSubtitleIndex];
                const parsedSubtitles = await loadAndParseSubtitle(subtitlePath);
                setSubtitles(parsedSubtitles);
                setCurrentSubtitle(null);
            } else {
                setSubtitles([]);
                setCurrentSubtitle(null);
            }
        };
        
        loadSubtitle();
    }, [subtitleFiles, selectedSubtitleIndex]);
    
    // 当当前字幕变化时，滚动到对应的字幕项
    useEffect(() => {
        if (currentSubtitle && subtitlesRef.current) {
            const subtitleElements = subtitlesRef.current.querySelectorAll('.subtitle-item');
            const currentElement = subtitleElements[currentSubtitle.index - 1];
            if (currentElement) {
                currentElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }, [currentSubtitle]);

    return (
        <div style={{ 
            position: 'relative', 
            display: 'flex', 
            height: '100%',
            overflow: 'hidden'
        }}>
            {/* 视频播放区域 */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                position: 'relative',
                background: '#000'
            }}>
                <video
                    width="100%"
                    height="100%"
                    ref={videoRef}
                    src={toFileUrl(path)}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    controls
                    playsInline
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    autoPlay={autoPlay}
                />
                
                {/* 当前字幕显示 */}
                {currentSubtitle && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '18px',
                        maxWidth: '80%',
                        textAlign: 'center',
                        zIndex: 10
                    }}>
                        {currentSubtitle.text.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* 字幕列表区域 */}
            {subtitles.length > 0 && (
                <div style={{
                    width: '300px',
                    backgroundColor: '#f5f5f5',
                    overflowY: 'auto',
                    padding: '10px',
                    borderLeft: '1px solid #e0e0e0'
                }}>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        paddingBottom: '5px',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        字幕列表
                        {subtitleFiles.length > 1 && (
                            <select
                                value={selectedSubtitleIndex}
                                onChange={(e) => setSelectedSubtitleIndex(Number(e.target.value))}
                                style={{
                                    marginLeft: '10px',
                                    padding: '4px',
                                    fontSize: '14px'
                                }}
                            >
                                {subtitleFiles.map((file, index) => (
                                    <option key={index} value={index}>
                                        字幕 {index + 1}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div ref={subtitlesRef}>
                        {subtitles.map((subtitle) => (
                            <div
                                key={subtitle.index}
                                className="subtitle-item"
                                style={{
                                    padding: '8px',
                                    marginBottom: '4px',
                                    borderRadius: '4px',
                                    backgroundColor: subtitle === currentSubtitle ? '#e6f7ff' : '#fff',
                                    borderLeft: subtitle === currentSubtitle ? '4px solid #1890ff' : '4px solid transparent',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    transition: 'all 0.3s'
                                }}
                                onClick={() => {
                                    const video = videoRef.current;
                                    if (video) {
                                        video.currentTime = subtitle.startTime;
                                    }
                                }}
                            >
                                <div style={{
                                    fontSize: '12px',
                                    color: '#888',
                                    marginBottom: '4px'
                                }}>
                                    {subtitle.index}
                                </div>
                                <div style={{
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {subtitle.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};