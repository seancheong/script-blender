'use client';

import { useMobileLayout } from '@/hooks/useMobileLayout';
import { buildCode } from '@/services/codeService';
import { useCallback, useEffect, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../ui/resizable';
import { CodeEditor } from './Editor';
import { Preview } from './Preview';
import { SkeletonPanel } from './SkeletonPanel';

const elementId = 'code-panel';
const initialValue = '// Write your code here';

export const CodePanel = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [_document, setDocument] = useState<Document | null>(null);

  const targetElement = _document?.getElementById(elementId);
  const isMobileLayout = useMobileLayout(targetElement || null);

  const handleCodeExecution = useCallback(async () => {
    buildCode(code).then(({ output, error }) => {
      setOutput(output);

      setError(error);
    });
  }, [code]);

  useEffect(() => {
    setDocument(document);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const actionTimeout = setTimeout(() => {
      handleCodeExecution();
    }, 1000);

    return () => {
      clearTimeout(actionTimeout);
    };
  }, [code, handleCodeExecution]);

  return (
    <div id={elementId} className='@container h-full'>
      {loading ? (
        <SkeletonPanel />
      ) : (
        <ResizablePanelGroup
          direction={isMobileLayout ? 'vertical' : 'horizontal'}
        >
          <ResizablePanel>
            <CodeEditor initialValue={initialValue} onChange={setCode} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            <Preview code={output} error={error} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};
