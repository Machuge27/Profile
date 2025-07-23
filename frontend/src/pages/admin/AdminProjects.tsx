import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminProjects() {
  const { data: projects, isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and showcase your work.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-6">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle>{project.title}</CardTitle>
                    {project.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    {format(new Date(project.start_date), "MMM yyyy")} - {" "}
                    {project.end_date 
                      ? format(new Date(project.end_date), "MMM yyyy")
                      : "Present"
                    }
                  </span>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.live_demo_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}