import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import Highlighter from 'monaco-jsx-highlighter';
import prettier from 'prettier';
import babel from 'prettier/plugins/babel';
import esTree from 'prettier/plugins/estree';
import { useRef } from 'react';
import './jsx-highlighter.css';
import { Button } from './ui/button';

interface Props {
  initialValue: string;
  onChange(value: string): void;
}

export const CodeEditor = ({ initialValue, onChange }: Props) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleFormatClick = async () => {
    if (editorRef.current) {
      const unformatted = editorRef.current.getModel()?.getValue() || '';

      const formatted = await prettier.format(unformatted, {
        parser: 'babel',
        plugins: [babel, esTree],
        useTabs: false,
        semi: true,
        singleQuote: true
      });

      editorRef.current.setValue(formatted.replace(/\n$/, ''));
    }
  };

  const handleEditorOnMount: OnMount = (editor) => {
    editorRef.current = editor;

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      parse,
      traverse,
      editor
    );
    highlighter.highLightOnDidChangeModelContent();
  };

  return (
    <div className='code-editor group relative h-full'>
      <Button
        variant='secondary'
        className='absolute z-20 top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        onClick={handleFormatClick}
      >
        Format
      </Button>

      <MonacoEditor
        height={500}
        value={initialValue}
        onMount={handleEditorOnMount}
        onChange={(value) => onChange(value || '')}
        theme='vs-dark'
        language='javascript'
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          tabSize: 2
        }}
      />
    </div>
  );
};
