import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExperience } from '@/hooks/useApi';

const Experience = () => {
  const { data: experiences = [], isLoading } = useExperience();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Professional Experience</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            My journey through the tech industry and the impact I've made
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded animate-pulse w-48" />
                        <div className="h-5 bg-muted rounded animate-pulse w-32" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-32" />
                        <div className="h-4 bg-muted rounded animate-pulse w-24" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
              <Card key={exp.id} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{exp.position}</h3>
                        {exp.is_current && (
                          <Badge variant="default" className="bg-primary/10 text-primary">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg text-primary font-medium">{exp.company_name}</p>
                        {exp.company_url && (
                          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <a href={exp.company_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:items-end gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.start_date)} - {' '}
                          {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {exp.responsibilities}
                  </p>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;