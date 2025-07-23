import { useState, useEffect } from 'react';
import { Menu, X, Code, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];


  // Get profile from localStorage
  let profile: any = null;
  try {
    const stored = localStorage.getItem('profile');
    if (stored) profile = JSON.parse(stored);
  } catch {}

  const socialLinks = [
    profile?.github_url && profile.github_url.trim() ? { href: profile.github_url, icon: Github, label: 'GitHub' } : null,
    profile?.linkedin_url && profile.linkedin_url.trim() ? { href: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' } : null,
    profile?.twitter_url && profile.twitter_url.trim() ? { href: profile.twitter_url, icon: Mail, label: 'Twitter' } : null,
    profile?.website_url && profile.website_url.trim() ? { href: profile.website_url, icon: Mail, label: 'Website' } : null,
  ].filter(Boolean);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/20 shadow-elegant'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-hero-gradient rounded-md flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Portfolio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-px h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
              </a>
            ))}
          </div>

          {/* Social Links & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Social Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-2">
              {socialLinks.length === 0 && (
                <span className="text-xs text-muted-foreground">No social links</span>
              )}
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-accent"
                >
                  <a href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer">
                    <link.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Social Links */}
              <div className="flex items-center space-x-2 px-3 pt-4">
                {socialLinks.length === 0 && (
                  <span className="text-xs text-muted-foreground">No social links</span>
                )}
                {socialLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-accent"
                  >
                    <a href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer">
                      <link.icon className="w-4 h-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;