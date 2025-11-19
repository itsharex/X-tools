import React from 'react';
import { detectFileType, getExtension, toFileUrl } from '../../utils/fileType';
import { ImageViewer } from './ImageViewer';
import { VideoViewer } from './VideoViewer';
import { PdfViewer } from './PdfViewer';
import { MarkdownViewer } from './MarkdownViewer';

interface FilePreviewProps {
  filePath: string;
  fileName: string;
}

export const FileViewer: React.FC<FilePreviewProps> = ({ filePath, fileName }) => {
  const type = detectFileType(fileName);
  const ext = getExtension(fileName);

  if (type === 'image') {
    return <div style={{height: '100%'}}><ImageViewer path={filePath} /></div>;
  }

  if (type === 'video') {
    return <div style={{height: '100%'}}><VideoViewer path={filePath} /></div>;
  }

  if (type === 'pdf') {
    return <PdfViewer path={filePath} />;
  }

  // Markdown 文件使用专门的 MarkdownViewer
  if (ext === 'md' || ext === 'markdown') {
    return <MarkdownViewer filePath={filePath} fileName={fileName} />;
  }

  // text 或其它：用 iframe 直接打开本地文件（最简单直接）
  return (
    <iframe
      src={toFileUrl(filePath)}
      title={fileName}
      style={{width: '100%', height: '100%', border: 'none', background: '#fff', borderRadius: 8}}
    />
  );
};
