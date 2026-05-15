import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  MessageCircle,
  Wallet,
  Settings,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  Briefcase,
  PlusCircle,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import SearchWithCategories from "@/components/search/SearchWithCategories";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const displayName = (user?.user_metadata?.display_name as string) || user?.email?.split("@")[0] || "Guest";
  const userEmail = user?.email || "";
  const piBalance = 0;
  const unreadMessages = 0;

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "See you soon!" });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="font-bold text-white">π</span>
          </div>
          <span className="hidden font-bold text-foreground sm:inline-block">
            WorkChain <span className="text-gradient">Pi</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="mx-6 flex-1 max-w-md">
          <SearchWithCategories 
            onSearch={(query, category) => {
              console.log("Search:", query, "Category:", category);
              // Navigate to browse page with search params
            }}
            placeholder="Search gigs, freelancers..."
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant={isActive("/browse") ? "default" : "ghost"}
            className="text-sm"
            asChild
          >
            <Link to="/browse">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Gigs
            </Link>
          </Button>

          <Button
            variant={isActive("/hire-work") ? "default" : "ghost"}
            className="text-sm"
            asChild
          >
            <Link to="/hire-work">
              <Briefcase className="mr-2 h-4 w-4" />
              Hire Work
            </Link>
          </Button>

          <Button
            variant={isActive("/post-job") ? "default" : "ghost"}
            className="text-sm"
            asChild
          >
            <Link to="/post-job">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a Job
            </Link>
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/messages">
              <MessageCircle className="h-4 w-4" />
              {unreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary">
                  {unreadMessages}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Wallet */}
          <Button variant="ghost" className="text-sm px-3" asChild>
            <Link to="/wallet">
              <Wallet className="mr-2 h-4 w-4" />
              <span className="font-mono text-accent">{piBalance.toFixed(2)} π</span>
            </Link>
          </Button>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={displayName} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/browse">
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Gigs
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/hire-work">
                <Briefcase className="mr-2 h-4 w-4" />
                Hire Work
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/post-job">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post a Job
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard">
                <Briefcase className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/wallet">
                <Wallet className="mr-2 h-4 w-4" />
                Wallet ({piBalance.toFixed(2)} π)
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};