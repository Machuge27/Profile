import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTestimonials } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useTestimonials();

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
          <h1 className="text-3xl font-bold">Testimonials Management</h1>
          <p className="text-muted-foreground">
            Manage client testimonials and reviews.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid gap-6">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.reviewer_image || undefined} />
                    <AvatarFallback>
                      {testimonial.reviewer_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{testimonial.reviewer_name}</CardTitle>
                      {testimonial.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <span>{testimonial.reviewer_position}</span>
                        <span className="text-xs">•</span>
                        <span className="font-medium">{testimonial.reviewer_company}</span>
                        {testimonial.reviewer_linkedin && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={testimonial.reviewer_linkedin} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardDescription>
                  </div>
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
              <blockquote className="text-lg italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-4 text-sm text-muted-foreground">
                Order: {testimonial.order}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}