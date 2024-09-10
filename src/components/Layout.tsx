import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { File, Upload, Settings, LogOut, Menu } from 'lucide-react';
import { GeistSans } from 'geist/font/sans';
import { cn } from "~/lib/utils"


type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const SidebarContent = () => (
    <nav className={cn("flex flex-col space-y-2", GeistSans.className)} >
      <Link href="/dashboard" passHref>
        <Button variant="ghost" className={`justify-start w-full ${router.pathname === '/dashboard' ? 'bg-gray-100' : ''}`}>
          <File className="mr-2 h-4 w-4" />
          Documents
        </Button>
      </Link>
      <Link href="/upload" passHref>
        <Button variant="ghost" className={`justify-start  w-full ${router.pathname === '/upload' ? 'bg-gray-100' : ''}`}>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </Link>
      <Link href="/account-settings" passHref>
        <Button variant="ghost" className={`justify-start w-full ${router.pathname === '/account-settings' ? 'bg-gray-100' : ''}`}>
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </Button>
      </Link>
      <Button variant="ghost" className="justify-start w-full text-red-500 hover:bg-red-600/10 hover:text-red-500" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex w-64 flex-col bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">ClarityCounsel</h1>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="container mx-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;