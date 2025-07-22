import { Heart, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">John Doe</h3>
            <p className="text-muted-foreground text-sm">
              Full-Stack Developer passionate about creating digital solutions 
              that make a difference.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Web Development</li>
              <li>Mobile Apps</li>
              <li>API Development</li>
              <li>UI/UX Design</li>
              <li>Consulting</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to my newsletter for the latest updates on projects and blog posts.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© {currentYear} John Doe. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>and lots of coffee.</span>
            </div>

            {/* Back to Top */}
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="hover:bg-primary/10"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;