import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

function ProjectForm({ initial, onSave, onCancel, loading }: {
  initial?: any,
  onSave: (data: any) => void,
  onCancel: () => void,
  loading?: boolean
}) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    tech_stack: initial?.tech_stack?.join(", ") || "",
    start_date: initial?.start_date || "",
    end_date: initial?.end_date || "",
    github_url: initial?.github_url || "",
    live_demo_url: initial?.live_demo_url || "",
    tags: initial?.tags?.join(", ") || "",
    is_featured: initial?.is_featured || false,
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSwitch(val: boolean) {
    setForm({ ...form, is_featured: val });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.tech_stack || !form.start_date) {
      setError("Title, description, tech stack, and start date are required.");
      return;
    }
    setError(null);
    onSave({
      ...form,
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit" : "Add"} Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <Input name="tech_stack" placeholder="Tech Stack (comma separated)" value={form.tech_stack} onChange={handleChange} required />
          <Input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
          <Input name="start_date" type="date" placeholder="Start Date" value={form.start_date} onChange={handleChange} required />
          <Input name="end_date" type="date" placeholder="End Date" value={form.end_date} onChange={handleChange} />
          <Input name="github_url" placeholder="GitHub URL" value={form.github_url} onChange={handleChange} type="url" />
          <Input name="live_demo_url" placeholder="Live Demo URL" value={form.live_demo_url} onChange={handleChange} type="url" />
          <div className="flex items-center gap-2">
            <Switch checked={form.is_featured} onCheckedChange={handleSwitch} />
            <span>Featured</span>
          </div>
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

export default function AdminProjects() {
  const { data: projects, isLoading, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);

  // Delete confirmation
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  // Handlers
  const handleAdd = () => {
    setEditProject(null);
    setShowModal(true);
  };
  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };
  const handleDelete = async (slug: string) => {
    if (!window.confirm("Delete this project?")) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.deleteProject(slug);
      refetch?.();
    } catch (e) {
      setError("Failed to delete project");
    }
    setIsSaving(false);
  };
  const handleSave = async (data) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editProject) {
        await apiClient.updateProject(editProject.slug, data);
      } else {
        await apiClient.createProject(data);
      }
      setShowModal(false);
      refetch?.();
    } catch (e) {
      setError("Failed to save project");
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
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and showcase your work.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {showModal && (
        <ProjectForm
          initial={editProject}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          loading={isSaving}
        />
      )}
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(project.slug)} disabled={isSaving}>
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