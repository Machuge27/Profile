import { Code2, Palette, Zap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code that follows best practices.',
    },
    {
      icon: Palette,
      title: 'Design Focus',
      description: 'Creating beautiful interfaces with attention to user experience and accessibility.',
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimizing applications for speed, efficiency, and seamless user interactions.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working effectively in teams with strong communication and problem-solving skills.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate about creating digital solutions that make a difference
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Building digital experiences with passion and precision
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                With over 5 years of experience in software development, I specialize in 
                creating robust web applications and mobile solutions. My journey began 
                with a curiosity for how things work and evolved into a passion for 
                building products that users love.
              </p>
              <p>
                I believe in the power of clean code, thoughtful design, and continuous 
                learning. Whether it's implementing complex business logic or crafting 
                intuitive user interfaces, I approach every project with dedication 
                and attention to detail.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, 
                contributing to open source projects, or sharing knowledge with 
                the developer community.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-glow transition-all duration-300 border-border/40"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;