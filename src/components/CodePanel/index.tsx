'use client';

import { useMobileLayout } from '@/hooks/useMobileLayout';
import { buildCode } from '@/services/codeService';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../ui/resizable';
import { Preview } from './Preview';
import { SkeletonPanel } from './SkeletonPanel';

const elementId = 'code-panel';
const initialValue =
  '// Write your code here\n// then press Ctrl+S/Cmd+S to execute it';

const DynamicEditor = dynamic(
  () =>
    import('@/components/CodePanel/Editor').then((module) => module.default),
  {
    ssr: false,
    loading: () => (
      <SkeletonPanel className='rounded-t-[20px] rounded-b-none @md:rounded-r-none @md:rounded-l-[20px]' />
    )
  }
);

export const CodePanel = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [_document, setDocument] = useState<Document | null>(null);

  const targetElement = _document?.getElementById(elementId);
  const isMobileLayout = useMobileLayout(targetElement || null);

  const handleCodeExecution = useCallback(
    async (newCode?: string) => {
      buildCode(newCode ?? code).then(({ output, error }) => {
        setOutput(output);

        setError(error);
      });
    },
    [code]
  );

  useEffect(() => {
    setDocument(document);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const actionTimer = 5000;

    const actionTimeout = setTimeout(() => {
      handleCodeExecution();
    }, actionTimer);

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
            <DynamicEditor
              initialValue={initialValue}
              onChange={setCode}
              onExecute={handleCodeExecution}
            />
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
