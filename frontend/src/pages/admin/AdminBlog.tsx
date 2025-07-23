import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminBlog() {
  const { data: blogPosts, isLoading } = useBlogPosts();

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
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      <div className="grid gap-6">
        {blogPosts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    {post.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {post.excerpt}
                  </CardDescription>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
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
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {post.content.length > 200 
                    ? `${post.content.substring(0, 200)}...`
                    : post.content
                  }
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Published: {format(new Date(post.published_at), "MMM dd, yyyy")}</span>
                  <span>Slug: /{post.slug}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}