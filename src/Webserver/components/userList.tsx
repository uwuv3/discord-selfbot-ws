"use client";

import * as React from "react";
import {
  Play,
  Settings,
  Bell,
  HelpCircle,
  MoreHorizontal,
  Power,
  Gamepad2,
  Plus,
  TrendingUp,
  Activity,
  Users,
  Menu,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  activity?: string;
  role: string;
  lastSeen?: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    username: "ahmet_dev",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    activity: "Visual Studio Code",
    role: "Frontend Developer",
  },
  {
    id: "2",
    name: "Zeynep Kaya",
    username: "zeynep_design",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "idle",
    activity: "Figma",
    role: "UI/UX Designer",
  },
  {
    id: "3",
    name: "Mehmet Özkan",
    username: "mehmet_pm",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "dnd",
    activity: "Toplantıda",
    role: "Project Manager",
  },
  {
    id: "4",
    name: "Ayşe Demir",
    username: "ayse_qa",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    activity: "Testing",
    role: "QA Engineer",
  },
  {
    id: "5",
    name: "Can Arslan",
    username: "can_backend",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    role: "Backend Developer",
    lastSeen: "2 saat önce",
  },
  {
    id: "6",
    name: "Selin Yıldız",
    username: "selin_frontend",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    activity: "React geliştiriyor",
    role: "Frontend Developer",
  },
  {
    id: "7",
    name: "Emre Kılıç",
    username: "emre_devops",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "idle",
    activity: "Docker",
    role: "DevOps Engineer",
  },
  {
    id: "8",
    name: "Fatma Şahin",
    username: "fatma_data",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    activity: "Python",
    role: "Data Scientist",
  },
];

// Simple Chart Component
function SimpleChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (value / max) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-16 relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#gradient-${color})`}
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    </div>
  );
}

// Mobile Sidebar Component
function MobileSidebar({
  selectedUser,
  setSelectedUser,
  getStatusColor,
}: {
  selectedUser: User;
  setSelectedUser: (user: User) => void;
  getStatusColor: (status: User["status"]) => string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-discord-darker"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-discord-dark border-discord-darker p-0"
      >
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="p-4 border-b border-discord-darker bg-discord-darker">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Kullanıcılar</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected User Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
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
                <h3 className="text-white text-sm font-semibold truncate">
                  {selectedUser.name}
                </h3>
                <p className="text-discord-muted text-xs truncate">
                  {selectedUser.role}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile User List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                    selectedUser.id === user.id
                      ? "bg-discord-blurple"
                      : "hover:bg-discord-darker"
                  }`}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsOpen(false);
                  }}
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
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
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-white text-sm font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-discord-muted text-xs truncate">
                      {user.role}
                    </p>
                  </div>
                </button>
              ))}

              {/* Mobile Add User Button */}
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-discord-darker transition-all duration-200">
                <div className="w-8 h-8 bg-discord-green rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <p className="text-discord-green text-sm font-medium">
                  Kullanıcı Ekle
                </p>
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UserSidebar() {
  const [selectedUser, setSelectedUser] = React.useState<User>(users[0]);

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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full z-10">
        <Sidebar className="bg-discord-dark border-r border-discord-darker h-full w-64">
          {/* Desktop Header */}
          <div className="p-3 border-b border-discord-darker bg-discord-darker">
            <div className="space-y-3">
              {/* Selected User Info */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="w-9 h-9">
                    <AvatarImage
                      src={selectedUser.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-discord-blurple text-white text-sm">
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                      selectedUser.status
                    )} rounded-full border-2 border-discord-darker`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white text-sm font-semibold truncate">
                    {selectedUser.name}
                  </h2>
                  <div className="flex items-center gap-1">
                    <p className="text-discord-muted text-xs truncate">
                      {selectedUser.role}
                    </p>
                    {selectedUser.activity && (
                      <>
                        <span className="text-discord-muted text-xs">•</span>
                        <p className="text-discord-light text-xs truncate">
                          {selectedUser.activity}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button className="bg-discord-green hover:bg-discord-green/80 text-white px-3 py-1 text-xs h-7">
                  <Play className="w-3 h-3 mr-1" />
                  Başlat
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-discord-muted hover:text-white h-7 w-7 p-0"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-discord-darker border-discord-muted text-white">
                    <DropdownMenuItem className="hover:bg-discord-dark">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Oyun Başlat
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-discord-dark">
                      <Power className="w-4 h-4 mr-2" />
                      Uzaktan Bağlan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-discord-muted" />
                    <DropdownMenuItem className="hover:bg-discord-dark">
                      <Settings className="w-4 h-4 mr-2" />
                      Ayarlar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-1 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-discord-muted hover:text-white h-7 w-7 p-0"
                  >
                    <Bell className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-discord-muted hover:text-white h-7 w-7 p-0"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-discord-muted hover:text-white h-7 w-7 p-0"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {users.map((user) => (
                    <SidebarMenuItem key={user.id}>
                      <SidebarMenuButton
                        className={`h-10 p-2 hover:bg-discord-darker rounded-lg transition-all duration-200 flex items-center ${
                          selectedUser.id === user.id
                            ? "bg-discord-blurple hover:bg-discord-blurple"
                            : ""
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-7 h-7">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-discord-blurple text-white text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusColor(
                              user.status
                            )} rounded-full border border-discord-dark`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0 ml-2">
                          <p className="text-white text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-discord-muted text-xs truncate">
                            {user.role}
                          </p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {/* Add User Button */}
                  <SidebarMenuItem>
                    <SidebarMenuButton className="h-10 p-2 hover:bg-discord-darker rounded-lg transition-all duration-200 flex items-center">
                      <div className="w-7 h-7 bg-discord-green rounded-full flex items-center justify-center hover:bg-discord-green/80 transition-colors">
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 ml-2">
                        <p className="text-discord-green text-sm font-medium">
                          Kullanıcı Ekle
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-discord-dark border-b border-discord-darker">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <MobileSidebar
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              getStatusColor={getStatusColor}
            />
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={selectedUser.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-discord-blurple text-white text-sm">
                    {selectedUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                    selectedUser.status
                  )} rounded-full border-2 border-discord-dark`}
                ></div>
              </div>
              <div>
                <h2 className="text-white text-sm font-semibold">
                  {selectedUser.name}
                </h2>
                <p className="text-discord-muted text-xs">
                  {selectedUser.role}
                </p>
              </div>
            </div>
          </div>
          <Button className="bg-discord-green hover:bg-discord-green/80 text-white px-3 py-1 text-sm h-8">
            <Play className="w-3 h-3 mr-1" />
            Başlat
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-20 md:pt-0">
        <div className="p-4 md:p-8 bg-discord-bg min-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* User Details Card */}
            <div className="bg-discord-dark rounded-lg p-4 md:p-6 mb-6 border border-discord-darker">
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                <div className="relative">
                  <Avatar className="w-16 h-16 md:w-20 md:h-20">
                    <AvatarImage
                      src={selectedUser.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-discord-blurple text-white text-xl md:text-2xl">
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-2 -right-2 w-5 h-5 md:w-6 md:h-6 ${getStatusColor(
                      selectedUser.status
                    )} rounded-full border-3 md:border-4 border-discord-dark`}
                  ></div>
                </div>
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {selectedUser.name}
                  </h1>
                  <p className="text-discord-light text-base md:text-lg mb-1">
                    @{selectedUser.username}
                  </p>
                  <p className="text-discord-muted mb-4">{selectedUser.role}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-discord-muted">Durum:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={`w-3 h-3 ${getStatusColor(
                            selectedUser.status
                          )} rounded-full`}
                        ></div>
                        <span className="text-white">
                          {selectedUser.status === "online" && "Çevrimiçi"}
                          {selectedUser.status === "idle" && "Boşta"}
                          {selectedUser.status === "dnd" && "Rahatsız Etmeyin"}
                          {selectedUser.status === "offline" && "Çevrimdışı"}
                        </span>
                      </div>
                    </div>
                    {selectedUser.activity && (
                      <div>
                        <span className="text-discord-muted">Aktivite:</span>
                        <p className="text-white mt-1">
                          {selectedUser.activity}
                        </p>
                      </div>
                    )}
                    {selectedUser.lastSeen && (
                      <div>
                        <span className="text-discord-muted">Son görülme:</span>
                        <p className="text-white mt-1">
                          {selectedUser.lastSeen}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards with Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-discord-dark rounded-lg p-4 md:p-6 border border-discord-darker">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base">
                      Aktif Kullanıcılar
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-discord-green">
                      {users.filter((u) => u.status === "online").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-discord-green rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <SimpleChart data={[3, 5, 4, 6, 5, 7, 6]} color="#57F287" />
                <p className="text-discord-muted text-xs mt-2">+12% bu hafta</p>
              </div>

              <div className="bg-discord-dark rounded-lg p-4 md:p-6 border border-discord-darker">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base">
                      Performans
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-discord-blurple">
                      94%
                    </p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-discord-blurple rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <SimpleChart
                  data={[85, 88, 92, 89, 94, 91, 94]}
                  color="#5865F2"
                />
                <p className="text-discord-muted text-xs mt-2">
                  +5% geçen aydan
                </p>
              </div>

              <div className="bg-discord-dark rounded-lg p-4 md:p-6 border border-discord-darker">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base">
                      Aktivite
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-discord-yellow">
                      156
                    </p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-discord-yellow rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <SimpleChart
                  data={[120, 135, 145, 140, 156, 150, 156]}
                  color="#FEE75C"
                />
                <p className="text-discord-muted text-xs mt-2">+23% bu hafta</p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-discord-dark rounded-lg p-4 md:p-6 border border-discord-darker hover:border-discord-blurple transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-discord-green rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    Hızlı Başlat
                  </h3>
                </div>
                <p className="text-discord-muted text-sm">
                  Kullanıcı ile hızlı bir şekilde bağlantı kur
                </p>
              </div>

              <div className="bg-discord-dark rounded-lg p-4 md:p-6 border border-discord-darker hover:border-discord-blurple transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-discord-blurple rounded-lg flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    Oyun Oturumu
                  </h3>
                </div>
                <p className="text-discord-muted text-sm">
                  Birlikte oyun oynamak için davet gönder
                </p>
              </div>

              <div className="bg-discord-dark rounded-lg p-4 md:p-6 border border-discord-darker hover:border-discord-blurple transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-discord-red rounded-lg flex items-center justify-center">
                    <Power className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    Uzaktan Erişim
                  </h3>
                </div>
                <p className="text-discord-muted text-sm">
                  Kullanıcının bilgisayarına uzaktan bağlan
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-discord-dark rounded-lg p-4 md:p-6 mt-6 border border-discord-darker">
              <h3 className="text-white font-semibold mb-4 text-sm md:text-base">
                Son Aktiviteler
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-discord-darker rounded-lg">
                  <div className="w-2 h-2 bg-discord-green rounded-full"></div>
                  <span className="text-discord-light text-sm">
                    Çevrimiçi oldu
                  </span>
                  <span className="text-discord-muted text-xs ml-auto">
                    5 dakika önce
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-discord-darker rounded-lg">
                  <div className="w-2 h-2 bg-discord-blurple rounded-full"></div>
                  <span className="text-discord-light text-sm">
                    Profil güncellendi
                  </span>
                  <span className="text-discord-muted text-xs ml-auto">
                    2 saat önce
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-discord-darker rounded-lg">
                  <div className="w-2 h-2 bg-discord-yellow rounded-full"></div>
                  <span className="text-discord-light text-sm">
                    Yeni proje eklendi
                  </span>
                  <span className="text-discord-muted text-xs ml-auto">
                    1 gün önce
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function DiscordLauncher() {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className={isDark ? "dark" : ""}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-discord-bg">
          <UserSidebar />
        </div>
      </SidebarProvider>
    </div>
  );
}
