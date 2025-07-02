import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPost } from '../services/blogApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { listenChat, sendChat } from '../services/chatApi';
import { useAuth } from '../contexts/AuthContext';
import AnimatedButton from '../components/AnimatedButton';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const MDComponents = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={match[1]}
        PreTag='div'
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code
        className='rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800'
        {...props}
      >
        {children}
      </code>
    );
  },
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetchPost(id).then(setPost).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const unsub = listenChat(id, setMessages);
    return unsub;
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!msgInput.trim() || !id) return;
    await sendChat(id, {
      sender: user?.name ?? 'Anonymous',
      body: msgInput.trim(),
    });
    setMsgInput('');
  };

  if (!post) return <LoadingSpinner />;

  return (
    <div className='mx-auto max-w-3xl space-y-8 p-6'>
      <h1 className='text-3xl font-bold'>{post.title}</h1>
      {post.coverUrl && (
        <img src={post.coverUrl} alt='cover' className='rounded-xl' />
      )}

      <ReactMarkdown
        className='prose lg:prose-lg dark:prose-invert'
        remarkPlugins={[remarkGfm]}
        components={MDComponents}
      >
        {post.content}
      </ReactMarkdown>

      <section className='rounded-xl border p-4 dark:border-zinc-700'>
        <h2 className='mb-4 text-lg font-semibold'>Live Chat</h2>

        <div className='h-64 overflow-y-auto space-y-3 rounded border p-3 bg-zinc-100 dark:bg-zinc-800'>
          {messages.map((m, i) => {
            const mine = m.sender === (user?.name ?? 'Anonymous');
            return (
              <div
                key={i}
                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow ${
                    mine
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                  }`}
                >
                  <div className='font-semibold text-xs opacity-75 mb-1'>
                    {mine ? 'You' : m.sender}
                  </div>
                  <div className='break-words whitespace-pre-wrap'>
                    {m.body}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <div className='mt-3 flex gap-2'>
          <input
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className='flex-1 rounded border p-2'
            placeholder='Message'
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <AnimatedButton onClick={sendMessage}>Send</AnimatedButton>
        </div>
      </section>
    </div>
  );
}
