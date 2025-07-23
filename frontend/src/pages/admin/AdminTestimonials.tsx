import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTestimonials } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

function TestimonialForm({ initial, onSave, onCancel, loading }: {
  initial?: any,
  onSave: (data: any) => void,
  onCancel: () => void,
  loading?: boolean
}) {
  const [form, setForm] = useState({
    reviewer_name: initial?.reviewer_name || "",
    reviewer_position: initial?.reviewer_position || "",
    reviewer_company: initial?.reviewer_company || "",
    reviewer_linkedin: initial?.reviewer_linkedin || "",
    quote: initial?.quote || "",
    is_featured: initial?.is_featured || false,
    order: initial?.order || 1,
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
    if (!form.reviewer_name || !form.reviewer_position || !form.quote) {
      setError("Name, position, and quote are required.");
      return;
    }
    setError(null);
    onSave(form);
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit" : "Add"} Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            name="reviewer_name"
            placeholder="Reviewer Name"
            value={form.reviewer_name}
            onChange={handleChange}
            required
          />
          <Input
            name="reviewer_position"
            placeholder="Reviewer Position"
            value={form.reviewer_position}
            onChange={handleChange}
            required
          />
          <Input
            name="reviewer_company"
            placeholder="Reviewer Company"
            value={form.reviewer_company}
            onChange={handleChange}
          />
          <Input
            name="reviewer_linkedin"
            placeholder="Reviewer LinkedIn URL"
            value={form.reviewer_linkedin}
            onChange={handleChange}
            type="url"
          />
          <Textarea
            name="quote"
            placeholder="Testimonial Quote"
            value={form.quote}
            onChange={handleChange}
            required
          />
          <div className="flex items-center gap-2">
            <Switch checked={form.is_featured} onCheckedChange={handleSwitch} />
            <span>Featured</span>
          </div>
          <Input
            name="order"
            placeholder="Order"
            type="number"
            value={form.order}
            onChange={handleChange}
            min={1}
          />
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

export default function AdminTestimonials() {
  const { data: testimonials, isLoading, refetch } = useTestimonials();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<any>(null);

  const handleAdd = () => {
    setEditTestimonial(null);
    setShowModal(true);
  };
  const handleEdit = (testimonial) => {
    setEditTestimonial(testimonial);
    setShowModal(true);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.deleteTestimonial(id);
      refetch?.();
    } catch (e) {
      setError("Failed to delete testimonial");
    }
    setIsSaving(false);
  };
  const handleSave = async (data) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editTestimonial) {
        await apiClient.updateTestimonial(editTestimonial.id, data);
      } else {
        await apiClient.createTestimonial(data);
      }
      setShowModal(false);
      refetch?.();
    } catch (e) {
      setError("Failed to save testimonial");
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
          <h1 className="text-3xl font-bold">Testimonials Management</h1>
          <p className="text-muted-foreground">
            Manage client testimonials and reviews.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {showModal && (
        <TestimonialForm
          initial={editTestimonial}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          loading={isSaving}
        />
      )}
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial.id)} disabled={isSaving}>
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