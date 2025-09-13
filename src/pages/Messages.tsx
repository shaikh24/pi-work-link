import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Image,
  FileText,
  Clock,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  type: 'client' | 'freelancer';
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  attachments?: { name: string; type: string; url: string }[];
}

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const chats: Chat[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "",
      lastMessage: "Great! I'll start working on the React components tomorrow.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      type: 'freelancer',
    },
    {
      id: "2",
      name: "TechCorp Inc.",
      avatar: "",
      lastMessage: "When can you deliver the final mockups?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      type: 'client',
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      avatar: "",
      lastMessage: "I've uploaded the design files to the project folder.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      type: 'freelancer',
    },
    {
      id: "4",
      name: "StartupXYZ",
      avatar: "",
      lastMessage: "Looking forward to seeing the initial wireframes.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      type: 'client',
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      senderId: "other",
      text: "Hi! I'm interested in your React development gig. Can we discuss the project requirements?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: "2",
      senderId: "me",
      text: "Absolutely! I'd be happy to help. What kind of React application are you looking to build?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: "3",
      senderId: "other",
      text: "It's an e-commerce platform with user authentication, product catalog, and payment integration. We'll need it to be responsive and SEO-friendly.",
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: "4",
      senderId: "me",
      text: "That sounds like a great project! I have extensive experience with React, Next.js, and payment integrations. I can definitely help you build this. Would you like to schedule a call to discuss the details?",
      timestamp: new Date(Date.now() - 85 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: "5",
      senderId: "other",
      text: "Perfect! Let's schedule a call for tomorrow at 2 PM EST. I'll send over the detailed requirements document.",
      timestamp: new Date(Date.now() - 80 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: "6",
      senderId: "other",
      text: "Great! I'll start working on the React components tomorrow.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
      status: 'delivered',
    },
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Chat with your clients and freelancers
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 h-[700px]">
          {/* Chat List */}
          <Card className="lg:col-span-4 card-glow">
            <CardContent className="p-0">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Chat List */}
              <ScrollArea className="h-[600px]">
                <div className="space-y-1">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-secondary/50 ${
                        selectedChat === chat.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {chat.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-background" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate">{chat.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant={chat.type === 'client' ? 'default' : 'secondary'} className="text-xs">
                              {chat.type}
                            </Badge>
                            <span>{format(chat.timestamp, "HH:mm")}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-primary text-xs ml-2">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-8 card-glow">
            <CardContent className="p-0 flex flex-col h-full">
              {selectedChatData ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedChatData.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {selectedChatData.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {selectedChatData.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-success border-2 border-background" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedChatData.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedChatData.isOnline ? "Online" : "Last seen recently"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === "me" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.senderId === "me"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
                              message.senderId === "me" 
                                ? "text-primary-foreground/70" 
                                : "text-muted-foreground"
                            }`}>
                              <span>{format(message.timestamp, "HH:mm")}</span>
                              {message.senderId === "me" && (
                                <div className="flex">
                                  {message.status === "sent" && <Clock className="h-3 w-3" />}
                                  {message.status === "delivered" && <CheckCheck className="h-3 w-3" />}
                                  {message.status === "read" && <CheckCheck className="h-3 w-3 text-blue-400" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-end gap-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="resize-none pr-12"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="btn-hero"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a chat from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;