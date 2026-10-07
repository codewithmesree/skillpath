import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; // For editing
}

export const CreateCourseModal = ({ isOpen, onClose, onSuccess, initialData }: CreateCourseModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    instructor: '',
    thumbnail: '',
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category: initialData.category || '',
        instructor: initialData.instructor || '',
        thumbnail: initialData.thumbnail || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        instructor: '',
        thumbnail: '',
      });
    }
  }, [initialData, isOpen]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image must be smaller than 4MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData ? `/api/courses/${initialData._id}` : '/api/courses';
      const method = initialData ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          instructor: '',
          thumbnail: '',
        });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save course');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Course" : "Create New Course"}>
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Course Title"
            placeholder="e.g. Master React in 30 Days"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <div className="space-y-1.5">
            <Input 
              label="Category"
              placeholder="e.g. Art, Design, Development"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Art", "Design", "Development", "Business", "AI & Tech"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: preset }))}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border border-deep-indigo transition-all ${
                    formData.category.toLowerCase() === preset.toLowerCase()
                      ? "bg-primary text-white shadow-brutal-sm"
                      : "bg-white text-deep-indigo hover:bg-secondary/40"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-widest text-deep-indigo/60">Description</label>
          <textarea 
            className="w-full border-2 border-deep-indigo p-4 font-body focus:outline-none focus:shadow-brutal transition-all min-h-[100px]"
            placeholder="What will students learn?"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Price (INR)"
            type="number"
            placeholder="999"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          <Input 
            label="Instructor Name"
            placeholder="e.g. Jane Doe"
            value={formData.instructor}
            onChange={(e) => setFormData({...formData, instructor: e.target.value})}
            required
          />
        </div>

        {/* Thumbnail (Optional) */}
        <div className="border-2 border-deep-indigo/20 p-4 rounded bg-bg-offwhite/50 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold uppercase tracking-widest text-deep-indigo">
              Course Thumbnail (Optional)
            </label>
            <span className="text-[10px] font-bold uppercase text-deep-indigo/60 bg-secondary/30 px-2 py-0.5 rounded">
              Optional
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="cursor-pointer bg-white border-2 border-deep-indigo px-4 py-2 font-heading font-black text-xs uppercase shadow-brutal hover:bg-secondary transition-all flex items-center gap-2 shrink-0">
              <Upload size={14} /> Upload Image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>

            <span className="text-xs font-bold opacity-40">OR</span>

            <input 
              type="text" 
              placeholder="Paste Image URL..." 
              value={formData.thumbnail}
              onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
              className="flex-1 w-full border-2 border-deep-indigo px-3 py-2 text-xs font-body focus:outline-none focus:shadow-brutal bg-white"
            />
          </div>

          {/* Live Thumbnail Preview */}
          {formData.thumbnail ? (
            <div className="relative aspect-video w-full max-w-xs mx-auto border-2 border-deep-indigo rounded overflow-hidden shadow-brutal-sm">
              <img 
                src={formData.thumbnail} 
                alt="Thumbnail preview" 
                className="w-full h-full object-cover" 
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, thumbnail: ''})}
                className="absolute top-2 right-2 bg-error text-white p-1 rounded border border-deep-indigo shadow hover:scale-105"
                title="Remove Image"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <div className="text-center py-2 text-[11px] font-bold text-dark-text/40 flex items-center justify-center gap-1.5">
              <ImageIcon size={14} /> Default cover image will be used if none provided
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t-2 border-deep-indigo/10">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : (initialData ? 'Update Course' : 'Create Course')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
