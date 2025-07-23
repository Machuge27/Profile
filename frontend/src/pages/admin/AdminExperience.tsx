import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExperience } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminExperience() {
  const { data: experience, isLoading } = useExperience();

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
          <h1 className="text-3xl font-bold">Experience Management</h1>
          <p className="text-muted-foreground">
            Manage your work experience and professional history.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="grid gap-6">
        {experience?.map((exp) => (
          <Card key={exp.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle>{exp.position}</CardTitle>
                    {exp.is_current && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{exp.company_name}</span>
                      {exp.company_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={exp.company_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {exp.location}
                    </div>
                  </CardDescription>
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
                <p className="text-sm leading-relaxed">
                  {exp.responsibilities}
                </p>
                
                <div className="text-sm text-muted-foreground">
                  {format(new Date(exp.start_date), "MMM yyyy")} - {" "}
                  {exp.end_date 
                    ? format(new Date(exp.end_date), "MMM yyyy")
                    : "Present"
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}