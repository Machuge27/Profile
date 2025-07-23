import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEducation } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const degreeLabels = {
  bachelor: "Bachelor's Degree",
  master: "Master's Degree",
  phd: "PhD",
  diploma: "Diploma",
  certificate: "Certificate",
};

const degreeOptions = [
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
];

function EducationForm({ initial, onSave, onCancel, loading }: {
  initial?: any,
  onSave: (data: any) => void,
  onCancel: () => void,
  loading?: boolean
}) {
  const [form, setForm] = useState({
    institution: initial?.institution || "",
    degree: initial?.degree || "bachelor",
    field_of_study: initial?.field_of_study || "",
    start_date: initial?.start_date || "",
    end_date: initial?.end_date || "",
    grade: initial?.grade || "",
    details: initial?.details || "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.institution || !form.degree || !form.field_of_study || !form.start_date) {
      setError("Institution, degree, field of study, and start date are required.");
      return;
    }
    setError(null);
    onSave(form);
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit" : "Add"} Education</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="institution" placeholder="Institution" value={form.institution} onChange={handleChange} required />
          <select name="degree" value={form.degree} onChange={handleChange} className="w-full border rounded px-2 py-1">
            {degreeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Input name="field_of_study" placeholder="Field of Study" value={form.field_of_study} onChange={handleChange} required />
          <Input name="grade" placeholder="Grade" value={form.grade} onChange={handleChange} />
          <Textarea name="details" placeholder="Details" value={form.details} onChange={handleChange} />
          <Input name="start_date" type="date" placeholder="Start Date" value={form.start_date} onChange={handleChange} required />
          <Input name="end_date" type="date" placeholder="End Date" value={form.end_date} onChange={handleChange} />
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

export default function AdminEducation() {
  const { data: education, isLoading, refetch } = useEducation();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editEdu, setEditEdu] = useState<any>(null);

  const handleAdd = () => {
    setEditEdu(null);
    setShowModal(true);
  };
  const handleEdit = (edu) => {
    setEditEdu(edu);
    setShowModal(true);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this education?")) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.deleteEducation(id);
      refetch?.();
    } catch (e) {
      setError("Failed to delete education");
    }
    setIsSaving(false);
  };
  const handleSave = async (data) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editEdu) {
        await apiClient.updateEducation(editEdu.id, data);
      } else {
        await apiClient.createEducation(data);
      }
      setShowModal(false);
      refetch?.();
    } catch (e) {
      setError("Failed to save education");
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
          <h1 className="text-3xl font-bold">Education Management</h1>
          <p className="text-muted-foreground">
            Manage your educational background and qualifications.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {showModal && (
        <EducationForm
          initial={editEdu}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          loading={isSaving}
        />
      )}
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(edu.id)} disabled={isSaving}>
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