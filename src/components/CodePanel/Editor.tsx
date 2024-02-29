import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { KeyCode, KeyMod, editor } from 'monaco-editor';
import Highlighter from 'monaco-jsx-highlighter';
import prettier from 'prettier';
import babel from 'prettier/plugins/babel';
import esTree from 'prettier/plugins/estree';
import { useRef } from 'react';

import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import './jsx-highlighter.css';

interface Props {
  initialValue: string;
  onChange(value: string): void;
  onExecute(value: string): void;
}

const CodeEditor = ({ initialValue, onChange, onExecute }: Props) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleFormatClick = async () => {
    if (editorRef.current) {
      const unformatted = editorRef.current.getModel()?.getValue() || '';

      const formatted = await prettier.format(unformatted, {
        parser: 'babel',
        plugins: [babel, esTree],
        useTabs: false,
        semi: true,
        singleQuote: true,
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
      editor,
    );
    highlighter.highLightOnDidChangeModelContent();

    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
      onExecute(editor.getModel()?.getValue() || '');
    });
  };

  return (
    <div className="editor group relative h-full pt-4 bg-[#1e1e1e] border-2 border-neutral-400 rounded-t-[20px] @md:rounded-r-none @md:rounded-l-[20px]">
      <Button
        variant="secondary"
        className="absolute z-20 top-4 right-4 opacity-0 h-8 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handleFormatClick}
      >
        Format
      </Button>

      <Select>
        <SelectTrigger className="w-28 ml-4 mb-4 h-8">
          <SelectValue placeholder="Javascript" />
        </SelectTrigger>

        <SelectContent className="h-8">
          <SelectItem value="javascript" className="py-0">
            Javascript
          </SelectItem>
        </SelectContent>
      </Select>

      <MonacoEditor
        value={initialValue}
        onMount={handleEditorOnMount}
        onChange={(value) => onChange(value || '')}
        height={'90%'}
        theme="vs-dark"
        language="javascript"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
