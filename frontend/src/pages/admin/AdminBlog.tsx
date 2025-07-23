import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

function BlogPostForm({ initial, onSave, onCancel, loading }: {
  initial?: any,
  onSave: (data: any) => void,
  onCancel: () => void,
  loading?: boolean
}) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    content: initial?.content || "",
    excerpt: initial?.excerpt || "",
    tags: initial?.tags?.join(", ") || "",
    status: initial?.status || "published",
    is_featured: initial?.is_featured || false,
    published_at: initial?.published_at ? initial.published_at.slice(0, 16) : "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSwitch(val: boolean) {
    setForm({ ...form, is_featured: val });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content || !form.status) {
      setError("Title, content, and status are required.");
      return;
    }
    if (form.excerpt.length > 500) {
      setError("Excerpt must be 500 characters or less.");
      return;
    }
    setError(null);
    onSave({
      ...form,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      published_at: form.published_at ? new Date(form.published_at).toISOString() : undefined,
    });
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit" : "Add"} Blog Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <Textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
          <Textarea name="excerpt" placeholder="Excerpt (max 500 chars)" value={form.excerpt} onChange={handleChange} maxLength={500} />
          <Input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_featured} onCheckedChange={handleSwitch} />
            <span>Featured</span>
          </div>
          <Input name="published_at" type="datetime-local" placeholder="Published At" value={form.published_at} onChange={handleChange} />
          {error && <div className="text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminBlog() {
  const { data: blogPosts, isLoading, refetch } = useBlogPosts();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);

  const handleAdd = () => {
    setEditPost(null);
    setShowModal(true);
  };
  const handleEdit = (post) => {
    setEditPost(post);
    setShowModal(true);
  };
  const handleDelete = async (slug: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.deleteBlogPost(slug);
      refetch?.();
    } catch (e) {
      setError("Failed to delete blog post");
    }
    setIsSaving(false);
  };
  const handleSave = async (data) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editPost) {
        await apiClient.updateBlogPost(editPost.slug, data);
      } else {
        await apiClient.createBlogPost(data);
      }
      setShowModal(false);
      refetch?.();
    } catch (e) {
      setError("Failed to save blog post");
    }
    setIsSaving(false);
  };

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
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {showModal && (
        <BlogPostForm
          initial={editPost}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          loading={isSaving}
        />
      )}
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(post.slug)} disabled={isSaving}>
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