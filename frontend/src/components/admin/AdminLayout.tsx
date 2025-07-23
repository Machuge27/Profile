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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed z-40 inset-y-0 left-0 bg-card border-r transition-all duration-300 md:static md:translate-x-0 md:w-64",
            sidebarOpen
              ? "w-64 translate-x-0"
              : "-translate-x-full w-0 overflow-hidden",
            "md:block"
          )}
          style={{ minWidth: sidebarOpen ? undefined : 0 }}
        >
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
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}