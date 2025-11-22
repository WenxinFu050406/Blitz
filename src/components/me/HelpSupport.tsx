import { ArrowLeft, MessageCircle, Mail, Phone, Book, Video, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface HelpSupportProps {
  onBack: () => void;
}

export function HelpSupport({ onBack }: HelpSupportProps) {
  const faqs = [
    { question: 'How do I connect my BESV bike?', category: 'Setup' },
    { question: 'How to track my rides?', category: 'Features' },
    { question: 'What do energy points do?', category: 'Rewards' },
    { question: 'How to redeem batteries?', category: 'Rewards' },
    { question: 'Can I export my ride data?', category: 'Data' },
  ];

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333] bg-black">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <h2 className="text-base text-white">Help & Support</h2>
          <p className="text-xs opacity-90 mt-0.5 text-gray-400">We're here to help</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-black">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer border border-[#333] bg-[#1a1a1a]">
            <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6 text-[#00ff88]" />
            </div>
            <p className="text-sm text-white">Live Chat</p>
            <p className="text-xs text-gray-500 mt-1">Available 9AM-6PM</p>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer border border-[#333] bg-[#1a1a1a]">
            <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-6 text-[#00ff88]" />
            </div>
            <p className="text-sm text-white">Email Us</p>
            <p className="text-xs text-gray-500 mt-1">24h response</p>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="p-4 border border-[#333] bg-[#1a1a1a]">
          <h3 className="text-sm mb-3 text-white">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#00ff88]" />
              <div>
                <p className="text-sm text-gray-300">+1 (888) BESV-HELP</p>
                <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM PST</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#00ff88]" />
              <div>
                <p className="text-sm text-gray-300">support@besvblitz.com</p>
                <p className="text-xs text-gray-500">24/7 email support</p>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQs */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Frequently Asked Questions</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            {faqs.map((faq, index) => (
              <button
                key={index}
                className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors text-left"
              >
                <div className="flex-1">
                  <p className="text-sm text-white">{faq.question}</p>
                  <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 ml-2" />
              </button>
            ))}
          </Card>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Resources</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <button className="p-4 flex items-center gap-3 w-full hover:bg-[#2a2a2a] transition-colors">
              <Book className="w-5 h-5 text-[#00ff88]" />
              <div className="flex-1 text-left">
                <p className="text-sm text-white">User Guide</p>
                <p className="text-xs text-gray-500 mt-0.5">Complete manual</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="p-4 flex items-center gap-3 w-full hover:bg-[#2a2a2a] transition-colors">
              <Video className="w-5 h-5 text-[#00ff88]" />
              <div className="flex-1 text-left">
                <p className="text-sm text-white">Video Tutorials</p>
                <p className="text-xs text-gray-500 mt-0.5">Learn by watching</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </Card>
        </div>

        {/* Send Feedback */}
        <Card className="p-4 bg-[#1a1a1a] border border-[#00ff88]">
          <h3 className="text-sm mb-2 text-white">Have feedback?</h3>
          <p className="text-xs text-gray-400 mb-3">
            We'd love to hear your thoughts on how we can improve Blitz!
          </p>
          <Button className="w-full bg-[#00ff88] hover:bg-[#00cc66] text-black">
            Send Feedback
          </Button>
        </Card>
      </div>
    </div>
  );
}
