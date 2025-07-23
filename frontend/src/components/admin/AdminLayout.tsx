import { useState } from "react";
import { Outlet, NavLink, useLocation, Navigate } from "react-router-dom";
import { 
  User, 
  FolderOpen, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  FileText, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { title: "Profile", url: "/admin/profile", icon: User },
  { title: "Projects", url: "/admin/projects", icon: FolderOpen },
  { title: "Experience", url: "/admin/experience", icon: Briefcase },
  { title: "Education", url: "/admin/education", icon: GraduationCap },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Blog Posts", url: "/admin/blog", icon: FileText },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('access_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "border-r bg-card transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}>
          <nav className="p-4 space-y-2">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}