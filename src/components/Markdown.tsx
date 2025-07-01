// 导入必要的依赖库
import React from 'react';
import ReactMarkdown from 'react-markdown'; // 用于解析和渲染 Markdown 内容
import remarkGfm from 'remark-gfm'; // 支持 GitHub Flavored Markdown (GFM)
import rehypeRaw from 'rehype-raw'; // 允许在 Markdown 中直接插入 HTML
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // 代码高亮库
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // 代码高亮样式
import Mermaid from './Mermaid'; // 自定义 Mermaid 图表组件

// 定义组件的 props 接口
interface MarkdownProps {
  content: string; // Markdown 格式的文本内容
}

// 定义 Markdown 组件
const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  // 定义 Markdown 渲染时的自定义组件映射
  const MarkdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
    // 段落标签 p 的自定义样式
    p({ children, ...props }: { children?: React.ReactNode }) {
      return <p className="mb-3 text-sm leading-relaxed dark:text-white" {...props}>{children}</p>;
    },
    // 标题 h1 的自定义样式
    h1({ children, ...props }: { children?: React.ReactNode }) {
      return <h1 className="text-xl font-bold mt-6 mb-3 dark:text-white" {...props}>{children}</h1>;
    },
    // 标题 h2 的自定义样式，支持 ReAct 特殊标题样式
    h2({ children, ...props }: { children?: React.ReactNode }) {
      if (children && typeof children === 'string') {
        const text = children.toString();
        if (text.includes('Thought') || text.includes('Action') || text.includes('Observation') || text.includes('Answer')) {
          return (
            <h2
              className={`text-base font-bold mt-5 mb-3 p-2 rounded ${
                text.includes('Thought') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                text.includes('Action') ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                text.includes('Observation') ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' :
                text.includes('Answer') ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                'dark:text-white'
              }`}
              {...props}
            >
              {children}
            </h2>
          );
        }
      }
      return <h2 className="text-lg font-bold mt-5 mb-3 dark:text-white" {...props}>{children}</h2>;
    },
    // 标题 h3 的自定义样式
    h3({ children, ...props }: { children?: React.ReactNode }) {
      return <h3 className="text-base font-semibold mt-4 mb-2 dark:text-white" {...props}>{children}</h3>;
    },
    // 标题 h4 的自定义样式
    h4({ children, ...props }: { children?: React.ReactNode }) {
      return <h4 className="text-sm font-semibold mt-3 mb-2 dark:text-white" {...props}>{children}</h4>;
    },
    // 无序列表 ul 的自定义样式
    ul({ children, ...props }: { children?: React.ReactNode }) {
      return <ul className="list-disc pl-6 mb-4 text-sm dark:text-white space-y-2" {...props}>{children}</ul>;
    },
    // 有序列表 ol 的自定义样式
    ol({ children, ...props }: { children?: React.ReactNode }) {
      return <ol className="list-decimal pl-6 mb-4 text-sm dark:text-white space-y-2" {...props}>{children}</ol>;
    },
    // 列表项 li 的自定义样式
    li({ children, ...props }: { children?: React.ReactNode }) {
      return <li className="mb-2 text-sm leading-relaxed dark:text-white" {...props}>{children}</li>;
    },
    // 链接 a 的自定义样式
    a({ children, href, ...props }: { children?: React.ReactNode; href?: string }) {
      return (
        <a
          href={href}
          className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    // 引用 blockquote 的自定义样式
    blockquote({ children, ...props }: { children?: React.ReactNode }) {
      return (
        <blockquote
          className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1 text-gray-700 dark:text-gray-300 italic my-4 text-sm"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    // 表格 table 的自定义样式
    table({ children, ...props }: { children?: React.ReactNode }) {
      return (
        <div className="overflow-x-auto my-6 rounded-md">
          <table className="min-w-full text-sm border-collapse" {...props}>
            {children}
          </table>
        </div>
      );
    },
    // 表头 thead 的自定义样式
    thead({ children, ...props }: { children?: React.ReactNode }) {
      return <thead className="bg-gray-100 dark:bg-gray-800" {...props}>{children}</thead>;
    },
    // 表体 tbody 的自定义样式
    tbody({ children, ...props }: { children?: React.ReactNode }) {
      return <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props}>{children}</tbody>;
    },
    // 表格行 tr 的自定义样式
    tr({ children, ...props }: { children?: React.ReactNode }) {
      return <tr className="hover:bg-gray-50 dark:hover:bg-gray-900" {...props}>{children}</tr>;
    },
    // 表头单元格 th 的自定义样式
    th({ children, ...props }: { children?: React.ReactNode }) {
      return (
        <th
          className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"
          {...props}
        >
          {children}
        </th>
      );
    },
    // 表格单元格 td 的自定义样式
    td({ children, ...props }: { children?: React.ReactNode }) {
      return <td className="px-4 py-3 border-t border-gray-200 dark:border-gray-700" {...props}>{children}</td>;
    },
    // 代码块 code 的自定义样式，支持 Mermaid 图表和普通代码块
    code(props: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
      [key: string]: any; // 使用 any 是因为 ReactMarkdown 组件需要此属性
    }) {
      const { inline, className, children, ...otherProps } = props;
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = children ? String(children).replace(/\n$/, '') : '';

      // 处理 Mermaid 图表
      if (!inline && match && match[1] === 'mermaid') {
        return (
          <div className="my-8 bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden shadow-sm">
            <Mermaid
              chart={codeContent}
              className="w-full max-w-full"
              zoomingEnabled={true}
            />
          </div>
        );
      }

      // 处理普通代码块
      if (!inline && match) {
        return (
          <div className="my-6 rounded-md overflow-hidden text-sm shadow-sm">
            <div className="bg-gray-800 text-gray-200 px-5 py-2 text-sm flex justify-between items-center">
              <span>{match[1]}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeContent);
                }}
                className="text-gray-400 hover:text-white"
                title="Copy code"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <SyntaxHighlighter
              language={match[1]}
              style={tomorrow}
              className="!text-sm"
              customStyle={{ margin: 0, borderRadius: '0 0 0.375rem 0.375rem', padding: '1rem' }}
              showLineNumbers={true}
              wrapLines={true}
              wrapLongLines={true}
              {...otherProps}
            >
              {codeContent}
            </SyntaxHighlighter>
          </div>
        );
      }

      // 处理内联代码
      return (
        <code
          className={`${className} font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-pink-500 dark:text-pink-400 text-sm`}
          {...otherProps}
        >
          {children}
        </code>
      );
    },
  };

  // 返回渲染的 Markdown 内容
  return (
    <div className="prose prose-base dark:prose-invert max-w-none px-2 py-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // 启用 GFM 插件
        rehypePlugins={[rehypeRaw]} // 启用 raw HTML 插件
        components={MarkdownComponents} // 自定义组件映射
      >
        {content} {/* 渲染传入的 Markdown 内容 */}
      </ReactMarkdown>
    </div>
  );
};

// 导出组件
export default Markdown;

// 总结：
// 该组件是一个高度可定制的 Markdown 渲染器，支持多种 Markdown 元素的样式化处理，
// 包括段落、标题、列表、链接、引用、表格以及代码块。特别地，它支持 Mermaid 图表的渲染，
// 并为代码块提供了复制到剪贴板的功能。整体设计注重用户体验和视觉美观性。