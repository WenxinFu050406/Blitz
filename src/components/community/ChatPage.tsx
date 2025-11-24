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
  
  // Initialize with random messages
  const [messages, setMessages] = useState(() => {
      const scenarios = [
        [
          { text: 'Hey! Ready for the weekend ride?', sender: 'them' },
          { text: 'Absolutely! What time works for you?', sender: 'me' },
          { text: 'How about 9 AM? We can hit the Bay Trail.', sender: 'them' },
          { text: "Perfect! I'll meet you at the usual spot 🚴", sender: 'me' },
          { text: 'Sounds good! See you then!', sender: 'them' },
        ],
        [
           { text: 'Did you see the new monthly challenge?', sender: 'them' },
           { text: 'Yeah, 500km is a lot! Are you joining?', sender: 'me' },
           { text: 'Thinking about it. Need a team member?', sender: 'them' },
           { text: 'Count me in!', sender: 'me' },
        ],
        [
            { text: 'Nice ride today! Your pace was incredible.', sender: 'me' },
            { text: 'Thanks! My legs are killing me though.', sender: 'them' },
            { text: 'Haha, rest up! Same time next week?', sender: 'me' },
            { text: 'You bet!', sender: 'them' },
        ],
        [
             { text: 'Are you going to the city event?', sender: 'them' },
             { text: 'The one on Sunday? Yes.', sender: 'me' },
             { text: 'Cool, let\'s ride together.', sender: 'them' },
        ]
      ];
      
      // Pick a scenario based on friend ID or random if not stable
      // Using random here as requested "each time... random"
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      return scenario.map((msg, i) => ({
        id: i + 1,
        text: msg.text,
        sender: msg.sender,
        time: new Date(Date.now() - (scenario.length - i) * 60000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
  });

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
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333] bg-black">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-[#2a2a2a] rounded-full flex items-center justify-center text-lg overflow-hidden">
            {friend.avatar?.startsWith('http') || friend.avatar?.startsWith('/') ? (
              <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
            ) : (
              friend.avatar || '👤'
            )}
          </div>
          <div>
            <h2 className="text-sm text-white">{friend.name}</h2>
            <p className="text-xs text-gray-400">{friend.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors">
            <Phone className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors">
            <Video className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-black">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${msg.sender === 'me' ? 'order-2' : ''}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl ${
                  msg.sender === 'me'
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-[#1a1a1a] text-gray-200'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className={`text-xs text-gray-500 mt-1 px-2 ${msg.sender === 'me' ? 'text-right' : ''}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[#333] p-4 bg-black">
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
            className="flex-1 bg-[#1a1a1a] border-[#333] text-white"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 bg-[#00ff88] text-black rounded-full hover:bg-[#00cc66] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}