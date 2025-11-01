import { initSocket, getSocket } from '@/lib/socket';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

export default function ChatWindow({ otherUserId }: { otherUserId: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  function scrollBottom() {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await api.get(`/messages?userId=${otherUserId}`);
        setMessages(res.data.messages || []);
        scrollBottom();
      } catch (e) {
        console.error(e);
      }
    }

    fetchMessages();
    const s = initSocket();
    s.on('message', (msg: any) => {
      if (
        (msg.senderId === otherUserId &&
          msg.receiverId === session?.user?.id) ||
        (msg.senderId === session?.user?.id && msg.receiverId === otherUserId)
      ) {
        setMessages(m => [...m, msg]);
      }
    });
    return () => {
      /* no cleanup to keep socket global */
    };
  }, [otherUserId, session?.user?.id]);

  async function send() {
    if (!text.trim()) return;
    try {
      const res = await api.post('/messages', {
        receiverId: otherUserId,
        content: text,
      });
      setMessages(m => [...m, res.data.message]);
      setText('');
      const s = getSocket();
      s?.emit('message', res.data.message);
      scrollBottom();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="border rounded p-3 mt-2">
      <div className="h-64 overflow-auto space-y-2">
        {messages.map(m => (
          <div
            key={m._id}
            className={`p-2 rounded ${
              m.senderId._id === session?.user?.id
                ? 'bg-slate-200 self-end'
                : 'bg-white'
            }`}
          >
            <div className="text-sm">{m.content}</div>
            <div className="text-xs text-gray-400">
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={ref} />
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={send} className="px-3 py-1 border rounded">
          Send
        </button>
      </div>
    </div>
  );
}
