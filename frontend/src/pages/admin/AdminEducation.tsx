import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEducation } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const degreeLabels = {
  bachelor: "Bachelor's Degree",
  master: "Master's Degree",
  phd: "PhD",
  diploma: "Diploma",
  certificate: "Certificate",
};

export default function AdminEducation() {
  const { data: education, isLoading } = useEducation();

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
          <h1 className="text-3xl font-bold">Education Management</h1>
          <p className="text-muted-foreground">
            Manage your educational background and qualifications.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="grid gap-6">
        {education?.map((edu) => (
          <Card key={edu.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle>{edu.institution}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {degreeLabels[edu.degree]}
                      </Badge>
                      <span className="font-medium">{edu.field_of_study}</span>
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
                {edu.grade && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Grade:</span>
                    <Badge variant="secondary">{edu.grade}</Badge>
                  </div>
                )}
                
                {edu.details && (
                  <p className="text-sm leading-relaxed">
                    {edu.details}
                  </p>
                )}
                
                <div className="text-sm text-muted-foreground">
                  {format(new Date(edu.start_date), "MMM yyyy")} - {" "}
                  {edu.end_date 
                    ? format(new Date(edu.end_date), "MMM yyyy")
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