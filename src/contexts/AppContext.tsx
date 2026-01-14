import React, {createContext, ReactNode, useContext, useRef, useState, useEffect} from 'react';
import {fileHistoryManager, FileHistoryRecord} from '../utils/uiUtils';
import {detectFileType} from "../utils/fileCommonUtil";
import {Config, updateFolderPath} from "../utils/config";

export interface AppContextType {
    /** 当前选中的文件夹路径 */
    currentFolder: string | null;
    /** 当前选中的文件路径 */
    currentFile: string | null;
    /** 设置当前文件夹 */
    setCurrentFolder: (folder: string | null) => void;
    /** 设置当前文件 */
    setCurrentFile: (file: string | null) => void;
    /** 文件访问历史记录 */
    fileHistory: FileHistoryRecord[];
    /** 添加文件访问记录 */
    addFileAccess: (filePath: string) => void;
    /** 获取当前文件夹的最后访问文件 */
    getLastAccessedFile: () => FileHistoryRecord | null;
    /** 清除当前文件夹的历史记录 */
    clearFolderHistory: () => void;

    autoPlay: boolean;

    /** 标题栏是否可见 */
    titleBarVisible: boolean;
    /** 设置标题栏可见性 */
    setTitleBarVisible: (visible: boolean) => void;

    /** 搜索面板是否打开 */
    searchPanelOpen: boolean;
    /** 设置搜索面板开关 */
    setSearchPanelOpen: (open: boolean) => void;

    /** 应用配置 */
    config: Config | null;
    /** 设置应用配置 */
    setConfig: (config: Config | null) => void;

    /** 左侧面板是否可见 */
    leftPanelVisible: boolean;
    /** 设置左侧面板可见性 */
    setLeftPanelVisible: (visible: boolean) => void;

    /** 右侧面板是否可见 */
    rightPanelVisible: boolean;
    /** 设置右侧面板可见性 */
    setRightPanelVisible: (visible: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [fileHistory, setFileHistory] = useState<FileHistoryRecord[]>([]);
    const [titleBarVisible, setTitleBarVisible] = useState<boolean>(true);
    const [searchPanelOpen, setSearchPanelOpen] = useState<boolean>(false);
    const [config, setConfig] = useState<Config | null>(null);
    const [leftPanelVisible, setLeftPanelVisible] = useState<boolean>(() => {
        const saved = localStorage.getItem('leftPanelVisible');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [rightPanelVisible, setRightPanelVisible] = useState<boolean>(() => {
        const saved = localStorage.getItem('rightPanelVisible');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const autoPlay = useRef(true); // 是否自动播放，当打开上次打开的视频时，不自动播放

    // 保存左侧面板可见性到localStorage
    useEffect(() => {
        localStorage.setItem('leftPanelVisible', JSON.stringify(leftPanelVisible));
    }, [leftPanelVisible]);

    // 保存右侧面板可见性到localStorage
    useEffect(() => {
        localStorage.setItem('rightPanelVisible', JSON.stringify(rightPanelVisible));
    }, [rightPanelVisible]);

    // 设置当前文件夹并加载历史记录
    const handleSetCurrentFolder = (folder: string | null) => {
        console.log('setCurrentFolder', folder);
        if(!folder) return;

        setCurrentFolder(folder);
        window.electronAPI.saveConfig(updateFolderPath(config, folder));
        window.electronAPI.setCurrentWindowFolder(folder);
        
        // 切换文件夹时清空当前文件
        setCurrentFile(null);
        if (folder) {
            // 加载当前文件夹的历史记录
            const history = fileHistoryManager.getFolderHistory(folder);
            setFileHistory(history);

            // 检查是否有最后访问的文件，如果有则自动打开
            const lastFile = fileHistoryManager.getLastAccessedFile(folder);
            if (lastFile) {
                // 从路径中提取文件名来检测文件类型
                const fileName = lastFile.filePath.split(/[\\/]/).pop() || '';
                // 如果上次打开的是视频，不自动播放，避免突兀。
                if (detectFileType(fileName) == "video" || detectFileType(fileName) == "audio") autoPlay.current = false;

                setCurrentFile(lastFile.filePath);
            }
        } else {
            setFileHistory([]);
        }
    };

    // 设置当前文件并添加到历史记录
    const handleSetCurrentFile = (file: string | null) => {
        // 这里已经不是上次打开的视频了，自动复位。
        if (!autoPlay.current) autoPlay.current = true;

        setCurrentFile(file);

        if (file && currentFolder) {
            // 添加文件访问记录
            fileHistoryManager.addFileAccess(file);
            // 更新本地状态
            const updatedHistory = fileHistoryManager.getFolderHistory(currentFolder);
            setFileHistory(updatedHistory);
        }
    };

    // 添加文件访问记录
    const addFileAccess = (filePath: string) => {
        if (currentFolder) {
            fileHistoryManager.addFileAccess(filePath);
            const updatedHistory = fileHistoryManager.getFolderHistory(currentFolder);
            setFileHistory(updatedHistory);
        }
    };

    // 获取当前文件夹的最后访问文件
    const getLastAccessedFile = (): FileHistoryRecord | null => {
        return currentFolder ? fileHistoryManager.getLastAccessedFile(currentFolder) : null;
    };

    // 清除当前文件夹的历史记录
    const clearFolderHistory = () => {
        if (currentFolder) {
            fileHistoryManager.clearFolderHistory(currentFolder);
            setFileHistory([]);
        }
    };

    const value: AppContextType = {
        currentFolder,
        currentFile,
        setCurrentFolder: handleSetCurrentFolder,
        setCurrentFile: handleSetCurrentFile,
        fileHistory,
        addFileAccess,
        getLastAccessedFile,
        clearFolderHistory,
        autoPlay: autoPlay.current,
        titleBarVisible,
        setTitleBarVisible,
        searchPanelOpen,
        setSearchPanelOpen,
        config,
        setConfig,
        leftPanelVisible,
        setLeftPanelVisible,
        rightPanelVisible,
        setRightPanelVisible,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};