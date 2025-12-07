import React, { useRef, useEffect } from 'react';
import { toFileUrl } from '../../utils/fileType';

interface PdfViewerProps {
  path: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ path }) => {
  const pdfFileUrl = toFileUrl(path);
  // 构造 iframe 的 src 属性，指向 pdfjs viewer.html 并传递 file 参数
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfFileUrl)}`;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 处理来自 iframe 的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 验证消息来源是否为 pdfjs viewer
      if (event.origin === window.location.origin && event.data && event.data.type === 'PDF_TEXT_SELECTED') {
        // 发送自定义事件到主窗口
        window.dispatchEvent(new CustomEvent('pdf-text-selected', { detail: event.data.text }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 当 iframe 加载完成后，注入脚本以监听 PDF 文本选择
  const handleIframeLoad = () => {
    if (iframeRef.current?.contentDocument) {
      const script = iframeRef.current.contentDocument.createElement('script');
      script.textContent = `
        // 监听文本选择事件（鼠标选择）
        document.addEventListener('mouseup', () => {
          const pdfViewer = document.querySelector('#viewer');
          if (pdfViewer) {
            const selectedText = window.getSelection()?.toString() || '';
            // 无论是否选中文本，都发送消息给父窗口
            window.parent.postMessage({ type: 'PDF_TEXT_SELECTED', text: selectedText }, '*');
          }
        });

        // 监听键盘选择事件（如Shift+箭头键选择）
        document.addEventListener('keyup', () => {
          const pdfViewer = document.querySelector('#viewer');
          if (pdfViewer) {
            const selectedText = window.getSelection()?.toString() || '';
            // 无论是否选中文本，都发送消息给父窗口
            window.parent.postMessage({ type: 'PDF_TEXT_SELECTED', text: selectedText }, '*');
          }
        });
      `;

      iframeRef.current.contentDocument.head.appendChild(script);
    }
  };
  
  return (
    <div style={{width: '100%', height: '100%', background: '#fff', borderRadius: 8, overflow: 'hidden'}}>
      <iframe 
        ref={iframeRef}
        src={viewerUrl} 
        style={{width: '100%', height: '100%', border: 'none'}} 
        title="PDF Viewer"
        onLoad={handleIframeLoad}
      />
    </div>
  );
};
