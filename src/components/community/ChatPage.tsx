import { useState } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { Input } from '../ui/input';

interface ChatPageProps {
  friend: {
    id: string;
    name: string;
    avatar: string;
    location: string;
  };
  onBack: () => void;
}

export function ChatPage({ friend, onBack }: ChatPageProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! Ready for the weekend ride?', sender: 'them', time: '10:30 AM' },
    { id: 2, text: 'Absolutely! What time works for you?', sender: 'me', time: '10:32 AM' },
    { id: 3, text: 'How about 9 AM? We can hit the Bay Trail.', sender: 'them', time: '10:35 AM' },
    { id: 4, text: "Perfect! I'll meet you at the usual spot 🚴", sender: 'me', time: '10:37 AM' },
    { id: 5, text: 'Sounds good! See you then!', sender: 'them', time: '10:38 AM' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-lg">
            {friend.avatar}
          </div>
          <div>
            <h2 className="text-sm">{friend.name}</h2>
            <p className="text-xs text-slate-500">{friend.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <Phone className="w-5 h-5 text-slate-600" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <Video className="w-5 h-5 text-slate-600" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${msg.sender === 'me' ? 'order-2' : ''}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl ${
                  msg.sender === 'me'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className={`text-xs text-slate-400 mt-1 px-2 ${msg.sender === 'me' ? 'text-right' : ''}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 p-4 bg-white">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            className="flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}