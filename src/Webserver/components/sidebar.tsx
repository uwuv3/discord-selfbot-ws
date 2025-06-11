"use client";

import * as React from "react";
import {
  Hash,
  Volume2,
  Settings,
  Mic,
  Headphones,
  Plus,
  Bell,
  Pin,
  Users,
  Search,
  Inbox,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  activity?: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    username: "ahmet_dev",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    activity: "Visual Studio Code",
  },
  {
    id: "2",
    name: "Zeynep Kaya",
    username: "zeynep_design",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "idle",
    activity: "Figma",
  },
  {
    id: "3",
    name: "Mehmet Özkan",
    username: "mehmet_pm",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "dnd",
    activity: "Toplantıda",
  },
  {
    id: "4",
    name: "Ayşe Demir",
    username: "ayse_qa",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    activity: "Spotify",
  },
  {
    id: "5",
    name: "Can Arslan",
    username: "can_backend",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
  },
  {
    id: "6",
    name: "Selin Yıldız",
    username: "selin_frontend",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    activity: "React geliştiriyor",
  },
];

const channels = [
  { name: "genel", type: "text", unread: 3 },
  { name: "duyurular", type: "text", unread: 0 },
  { name: "proje-tartışma", type: "text", unread: 12 },
  { name: "random", type: "text", unread: 0 },
  { name: "Genel Sohbet", type: "voice", users: 3 },
  { name: "Toplantı Odası", type: "voice", users: 0 },
];

export function DiscordSidebar() {
  const [selectedUser, setSelectedUser] = React.useState<User>(users[0]);
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "Çevrimiçi";
      case "idle":
        return "Boşta";
      case "dnd":
        return "Rahatsız Etmeyin";
      case "offline":
        return "Çevrimdışı";
    }
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-discord-bg">
          {/* Server List */}
          <div className="w-[72px] bg-discord-darker flex flex-col items-center py-3 gap-2">
            <div className="w-12 h-12 bg-discord-blurple rounded-2xl flex items-center justify-center text-white font-bold hover:rounded-xl transition-all duration-200 cursor-pointer">
              T
            </div>
            <div className="w-8 h-[2px] bg-discord-muted rounded-full"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-discord-dark rounded-full flex items-center justify-center text-white hover:rounded-xl hover:bg-discord-blurple transition-all duration-200 cursor-pointer"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <div className="w-12 h-12 bg-discord-dark rounded-full flex items-center justify-center text-discord-muted hover:rounded-xl hover:bg-discord-green hover:text-white transition-all duration-200 cursor-pointer">
              <Plus className="w-6 h-6" />
            </div>
          </div>

          <Sidebar
            side="left"
            className="w-60 bg-discord-dark border-r border-discord-darker"
          >
            <SidebarHeader className="p-4 border-b border-discord-darker">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold">Takım Sunucusu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-discord-muted hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
              <SidebarGroup>
                <SidebarGroupLabel className="text-discord-muted text-xs font-semibold uppercase tracking-wide px-2 py-1">
                  Metin Kanalları
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {channels
                      .filter((c) => c.type === "text")
                      .map((channel) => (
                        <SidebarMenuItem key={channel.name}>
                          <SidebarMenuButton className="text-discord-muted hover:text-white hover:bg-discord-darker rounded px-2 py-1">
                            <Hash className="w-4 h-4" />
                            <span>{channel.name}</span>
                            {channel.unread > 0 && (
                              <Badge className="ml-auto bg-discord-red text-white text-xs px-1.5 py-0.5 rounded-full">
                                {channel.unread}
                              </Badge>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-discord-muted text-xs font-semibold uppercase tracking-wide px-2 py-1">
                  Ses Kanalları
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {channels
                      .filter((c) => c.type === "voice")
                      .map((channel) => (
                        <SidebarMenuItem key={channel.name}>
                          <SidebarMenuButton className="text-discord-muted hover:text-white hover:bg-discord-darker rounded px-2 py-1">
                            <Volume2 className="w-4 h-4" />
                            <span>{channel.name}</span>
                            {channel.users && channel.users > 0 && (
                              <span className="ml-auto text-xs text-discord-muted">
                                {channel.users}
                              </span>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-2 bg-discord-darker">
              <div className="flex items-center gap-2 p-2 rounded bg-discord-dark">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-discord-blurple text-white">
                    {selectedUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {selectedUser.name}
                  </p>
                  <p className="text-discord-muted text-xs truncate">
                    #{selectedUser.username}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-discord-muted hover:text-white"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-discord-muted hover:text-white"
                  >
                    <Headphones className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-discord-muted hover:text-white"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Navbar */}
            <header className="h-12 bg-discord-dark border-b border-discord-darker flex items-center px-4 gap-4">
              <SidebarTrigger className="md:hidden text-discord-muted hover:text-white" />
              <Hash className="w-5 h-5 text-discord-muted" />
              <span className="text-white font-semibold">genel</span>
              <Separator
                orientation="vertical"
                className="h-6 bg-discord-darker"
              />
              <span className="text-discord-muted text-sm">
                Takım genel sohbet kanalı
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-discord-muted hover:text-white"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-discord-muted hover:text-white"
                >
                  <Pin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-discord-muted hover:text-white"
                >
                  <Users className="w-4 h-4" />
                </Button>
                <div className="relative">
                  <Input
                    placeholder="Ara"
                    className="w-36 h-6 bg-discord-darker border-none text-white placeholder-discord-muted text-sm"
                  />
                  <Search className="absolute right-2 top-1 w-3 h-3 text-discord-muted" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-discord-muted hover:text-white"
                >
                  <Inbox className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-discord-muted hover:text-white"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-discord-muted hover:text-white"
                  onClick={() => setIsDark(!isDark)}
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </header>

            <div className="flex-1 flex">
              {/* Chat Area */}
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Hash className="w-16 h-16 text-discord-muted mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                      #genel kanalına hoş geldin!
                    </h2>
                    <p className="text-discord-muted">
                      Bu, #genel kanalının başlangıcı.
                    </p>
                  </div>

                  {/* Sample Messages */}
                  <div className="space-y-4">
                    <div className="flex gap-3 hover:bg-discord-darker p-2 rounded">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback className="bg-discord-blurple text-white">
                          A
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">
                            Ahmet Yılmaz
                          </span>
                          <span className="text-discord-muted text-xs">
                            bugün 14:30
                          </span>
                        </div>
                        <p className="text-discord-light">
                          Merhaba ekip! Yeni proje nasıl gidiyor?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 hover:bg-discord-darker p-2 rounded">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback className="bg-discord-green text-white">
                          Z
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">
                            Zeynep Kaya
                          </span>
                          <span className="text-discord-muted text-xs">
                            bugün 14:32
                          </span>
                        </div>
                        <p className="text-discord-light">
                          Harika gidiyor! Tasarımlar neredeyse hazır 🎨
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User List */}
              <div className="w-60 bg-discord-dark border-l border-discord-darker p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-discord-muted text-xs font-semibold uppercase tracking-wide mb-2">
                      Çevrimiçi —{" "}
                      {users.filter((u) => u.status !== "offline").length}
                    </h3>
                    <div className="space-y-1">
                      {users
                        .filter((u) => u.status !== "offline")
                        .map((user) => (
                          <Card
                            key={user.id}
                            className={`bg-transparent border-none cursor-pointer hover:bg-discord-darker rounded p-2 transition-colors ${
                              selectedUser.id === user.id
                                ? "bg-discord-darker"
                                : ""
                            }`}
                            onClick={() => setSelectedUser(user)}
                          >
                            <CardContent className="p-0">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={user.avatar || "/placeholder.svg"}
                                    />
                                    <AvatarFallback className="bg-discord-blurple text-white text-sm">
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                                      user.status
                                    )} rounded-full border-2 border-discord-dark`}
                                  ></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">
                                    {user.name}
                                  </p>
                                  {user.activity && (
                                    <p className="text-discord-muted text-xs truncate">
                                      {user.activity}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {users.filter((u) => u.status === "offline").length > 0 && (
                    <div>
                      <h3 className="text-discord-muted text-xs font-semibold uppercase tracking-wide mb-2">
                        Çevrimdışı —{" "}
                        {users.filter((u) => u.status === "offline").length}
                      </h3>
                      <div className="space-y-1">
                        {users
                          .filter((u) => u.status === "offline")
                          .map((user) => (
                            <Card
                              key={user.id}
                              className={`bg-transparent border-none cursor-pointer hover:bg-discord-darker rounded p-2 transition-colors ${
                                selectedUser.id === user.id
                                  ? "bg-discord-darker"
                                  : ""
                              }`}
                              onClick={() => setSelectedUser(user)}
                            >
                              <CardContent className="p-0">
                                <div className="flex items-center gap-3 opacity-50">
                                  <div className="relative">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage
                                        src={user.avatar || "/placeholder.svg"}
                                      />
                                      <AvatarFallback className="bg-discord-muted text-white text-sm">
                                        {user.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div
                                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                                        user.status
                                      )} rounded-full border-2 border-discord-dark`}
                                    ></div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                      {user.name}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected User Info */}
                <div className="mt-6 p-4 bg-discord-darker rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={selectedUser.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-discord-blurple text-white">
                          {selectedUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                          selectedUser.status
                        )} rounded-full border-2 border-discord-darker`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {selectedUser.name}
                      </p>
                      <p className="text-discord-muted text-sm truncate">
                        #{selectedUser.username}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-discord-muted">Durum:</span>
                      <span className="text-white">
                        {getStatusText(selectedUser.status)}
                      </span>
                    </div>
                    {selectedUser.activity && (
                      <div className="flex justify-between text-sm">
                        <span className="text-discord-muted">Aktivite:</span>
                        <span className="text-white truncate ml-2">
                          {selectedUser.activity}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
