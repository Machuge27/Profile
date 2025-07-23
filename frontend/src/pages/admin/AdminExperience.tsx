import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExperience } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

function ExperienceForm({ initial, onSave, onCancel, loading }: {
  initial?: any,
  onSave: (data: any) => void,
  onCancel: () => void,
  loading?: boolean
}) {
  const [form, setForm] = useState({
    company_name: initial?.company_name || "",
    position: initial?.position || "",
    responsibilities: initial?.responsibilities || "",
    start_date: initial?.start_date || "",
    end_date: initial?.end_date || "",
    is_current: initial?.is_current || false,
    company_url: initial?.company_url || "",
    location: initial?.location || "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSwitch(val: boolean) {
    setForm({ ...form, is_current: val });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name || !form.position || !form.responsibilities || !form.start_date) {
      setError("Company, position, responsibilities, and start date are required.");
      return;
    }
    setError(null);
    onSave(form);
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit" : "Add"} Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="company_name" placeholder="Company Name" value={form.company_name} onChange={handleChange} required />
          <Input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
          <Textarea name="responsibilities" placeholder="Responsibilities" value={form.responsibilities} onChange={handleChange} required />
          <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <Input name="company_url" placeholder="Company URL" value={form.company_url} onChange={handleChange} type="url" />
          <Input name="start_date" type="date" placeholder="Start Date" value={form.start_date} onChange={handleChange} required />
          <Input name="end_date" type="date" placeholder="End Date" value={form.end_date} onChange={handleChange} />
          <div className="flex items-center gap-2">
            <Switch checked={form.is_current} onCheckedChange={handleSwitch} />
            <span>Current</span>
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

export default function AdminExperience() {
  const { data: experience, isLoading, refetch } = useExperience();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editExp, setEditExp] = useState<any>(null);

  const handleAdd = () => {
    setEditExp(null);
    setShowModal(true);
  };
  const handleEdit = (exp) => {
    setEditExp(exp);
    setShowModal(true);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this experience?")) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.deleteExperience(id);
      refetch?.();
    } catch (e) {
      setError("Failed to delete experience");
    }
    setIsSaving(false);
  };
  const handleSave = async (data) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editExp) {
        await apiClient.updateExperience(editExp.id, data);
      } else {
        await apiClient.createExperience(data);
      }
      setShowModal(false);
      refetch?.();
    } catch (e) {
      setError("Failed to save experience");
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
          <h1 className="text-3xl font-bold">Experience Management</h1>
          <p className="text-muted-foreground">
            Manage your work experience and professional history.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {showModal && (
        <ExperienceForm
          initial={editExp}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          loading={isSaving}
        />
      )}
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(exp.id)} disabled={isSaving}>
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