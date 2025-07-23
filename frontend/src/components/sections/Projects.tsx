import { useState } from 'react';
import { Github, ExternalLink, Calendar, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useProjects } from '@/hooks/useApi';

const Projects = () => {
  const { data: projects = [], isLoading } = useProjects({ featured: true });
  // Fallback mock data
  const mockProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      slug: 'e-commerce-platform',
      description: 'A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.',
      tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      start_date: '2023-01-15',
      end_date: '2023-06-30',
      github_url: 'https://github.com/johndoe/ecommerce',
      live_demo_url: 'https://demo.ecommerce.com',
      playstore_url: null,
      tags: ['web', 'fullstack', 'ecommerce'],
      is_featured: true,
      images: [
        {
          id: 1,
          image: '/placeholder.svg',
          caption: 'Homepage screenshot',
          order: 0,
        },
      ],
    },
    {
      id: 2,
      title: 'Task Management App',
      slug: 'task-management-app',
      description: 'A mobile-first task management application with team collaboration features and real-time updates.',
      tech_stack: ['React Native', 'Firebase', 'Redux'],
      start_date: '2023-07-01',
      end_date: null,
      github_url: 'https://github.com/johndoe/taskapp',
      live_demo_url: 'https://taskapp.demo.com',
      playstore_url: 'https://play.google.com/store/apps/details?id=com.taskapp',
      tags: ['mobile', 'productivity'],
      is_featured: true,
      images: [],
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      slug: 'weather-dashboard',
      description: 'A responsive weather dashboard with location-based forecasts and interactive charts.',
      tech_stack: ['Vue.js', 'Chart.js', 'OpenWeather API'],
      start_date: '2023-03-01',
      end_date: '2023-04-15',
      github_url: 'https://github.com/johndoe/weather',
      live_demo_url: 'https://weather.demo.com',
      playstore_url: null,
      tags: ['web', 'api'],
      is_featured: false,
      images: [],
    },
  ];

  const [filter, setFilter] = useState('all');

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'featured') return project.is_featured;
    return project.tags.includes(filter);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of my recent work and the technologies I've used
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-glow transition-all duration-500 overflow-hidden">
              <CardHeader className="p-0">
                {/* Project Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {project.images.length > 0 ? (
                    <img
                      src={project.images[0].image}
                      alt={project.images[0].caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-4xl font-bold text-primary/40">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    {project.github_url && (
                      <Button size="icon" variant="glass" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {project.live_demo_url && (
                      <Button size="icon" variant="glass" asChild>
                        <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {project.playstore_url && (
                      <Button size="icon" variant="glass" asChild>
                        <a href={project.playstore_url} target="_blank" rel="noopener noreferrer">
                          <Smartphone className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {project.is_featured && (
                    <Badge className="absolute top-3 left-3 bg-primary">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {formatDate(project.start_date)}
                      {project.end_date && ` - ${formatDate(project.end_date)}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Projects
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;