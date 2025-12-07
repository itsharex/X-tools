import React from 'react';
import { toFileUrl } from '../../utils/fileType';

interface PdfViewerProps {
  path: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ path }) => {
  const pdfFileUrl = toFileUrl(path);
  // 构造 iframe 的 src 属性，指向 pdfjs viewer.html 并传递 file 参数
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfFileUrl)}`;
  
  return (
    <div style={{width: '100%', height: '100%', background: '#fff', borderRadius: 8, overflow: 'hidden'}}>
      <iframe 
        src={viewerUrl} 
        style={{width: '100%', height: '100%', border: 'none'}} 
        title="PDF Viewer"
      />
    </div>
  );
};
