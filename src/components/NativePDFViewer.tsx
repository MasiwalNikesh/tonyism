'use client';

import { useState } from 'react';

interface NativePDFViewerProps {
  file: string;
}

export default function NativePDFViewer({ file }: NativePDFViewerProps) {
  const [viewMode, setViewMode] = useState<'embed' | 'iframe' | 'link'>('embed');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">Tony-ism Magazine</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">View Mode:</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'embed' | 'iframe' | 'link')}
              className="px-2 py-1 text-sm border rounded"
            >
              <option value="embed">Embedded</option>
              <option value="iframe">iFrame</option>
              <option value="link">Download/Open</option>
            </select>
          </div>
          
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Open in New Tab
          </a>
        </div>
      </div>

      <div className="flex-1">
        {viewMode === 'embed' && (
          <embed
            src={`${file}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            type="application/pdf"
            className="w-full h-full"
            style={{ minHeight: '600px' }}
          />
        )}
        
        {viewMode === 'iframe' && (
          <iframe
            src={`${file}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            className="w-full h-full border-0"
            style={{ minHeight: '600px' }}
            title="Tony-ism Magazine PDF"
          />
        )}
        
        {viewMode === 'link' && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="max-w-md">
              <h3 className="text-xl font-semibold mb-4">Large PDF File</h3>
              <p className="text-gray-600 mb-6">
                This PDF is 485MB in size. For the best viewing experience, 
                we recommend downloading it or opening it in a new tab.
              </p>
              
              <div className="space-y-3">
                <a
                  href={file}
                  download="Tony-ism Magazine.pdf"
                  className="block px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Download PDF (485MB)
                </a>
                
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Open in New Tab
                </a>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                The browser&apos;s native PDF viewer will handle large files more efficiently.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}