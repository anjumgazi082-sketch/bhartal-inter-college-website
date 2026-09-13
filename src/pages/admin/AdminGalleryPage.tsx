import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, FolderPlus, Upload, X } from 'lucide-react';
import { api } from '../../services/api';
import type { GalleryImage, GalleryAlbum } from '../../types';

export const AdminGalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  // Upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);

  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'Campus',
    album_id: '' as string | number,
  });

  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    cover_image: '',
  });

  const [uploading, setUploading] = useState(false);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const [galleryRes, albumRes] = await Promise.all([
        api.gallery.getAll(selectedAlbum ? { album_id: selectedAlbum } : undefined),
        api.gallery.getAlbums(),
      ]);
      setImages(galleryRes.images || []);
      setAlbums(albumRes.albums || []);
    } catch (err) {
      console.error('Failed to load gallery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [selectedAlbum]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const res = await api.upload.file(file.name, dataUrl);
        if (res.success && res.fileUrl) {
          setNewImage(prev => ({ ...prev, image_url: res.fileUrl }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.image_url) {
      alert('Please provide or upload an image URL.');
      return;
    }
    try {
      await api.gallery.createImage({
        ...newImage,
        album_id: newImage.album_id ? Number(newImage.album_id) : undefined,
      });
      setUploadModalOpen(false);
      setNewImage({
        title: '',
        description: '',
        image_url: '',
        category: 'Campus',
        album_id: '',
      });
      loadGallery();
    } catch (err) {
      console.error('Error adding image:', err);
      alert('Failed to add photo.');
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.gallery.createAlbum(newAlbum);
      setAlbumModalOpen(false);
      setNewAlbum({ title: '', description: '', cover_image: '' });
      loadGallery();
    } catch (err) {
      console.error('Error adding album:', err);
      alert('Failed to create album.');
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (window.confirm('Delete this photo from gallery?')) {
      try {
        await api.gallery.deleteImage(id);
        loadGallery();
      } catch (err) {
        console.error('Delete image failed:', err);
      }
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    if (window.confirm('Delete this album and unlink associated photos?')) {
      try {
        await api.gallery.deleteAlbum(id);
        setSelectedAlbum(null);
        loadGallery();
      } catch (err) {
        console.error('Delete album failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Photo Gallery Management</h2>
          <p className="text-xs text-slate-500">
            Upload school photos, organize by albums (Celebrations, Infrastructure, Sports, Lab).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAlbumModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Album</span>
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Album Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedAlbum(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            selectedAlbum === null
              ? 'bg-blue-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Photos ({images.length})
        </button>
        {albums.map(alb => (
          <div key={alb.id} className="relative group flex items-center">
            <button
              onClick={() => setSelectedAlbum(alb.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                selectedAlbum === alb.id
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{alb.title}</span>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleDeleteAlbum(alb.id);
              }}
              title="Delete Album"
              className="ml-1 p-1 text-slate-400 hover:text-rose-600 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading gallery photos...</div>
        ) : images.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No photos found in this category. Click &quot;Upload Photo&quot; to add.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs hover:shadow-md transition"
              >
                <div className="aspect-4/3 overflow-hidden bg-slate-200">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-2.5 bg-white">
                  <p className="font-bold text-xs text-slate-800 truncate">{img.title || 'Untitled Photo'}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{img.category}</p>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Photo Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Photo to Gallery</h3>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateImage} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Photo Title</label>
                <input
                  type="text"
                  placeholder="e.g. Science Laboratory Session"
                  value={newImage.title}
                  onChange={e => setNewImage({ ...newImage, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newImage.category}
                    onChange={e => setNewImage({ ...newImage, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                  >
                    <option value="Campus">Campus</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Celebrations">Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Album (Optional)</label>
                  <select
                    value={newImage.album_id}
                    onChange={e => setNewImage({ ...newImage, album_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                  >
                    <option value="">No Album</option>
                    {albums.map(alb => (
                      <option key={alb.id} value={alb.id}>
                        {alb.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload image area */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-semibold text-slate-700 block">Select File or Provide URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white"
                />
                {uploading && <p className="text-xs text-blue-900">Uploading image...</p>}

                <div className="pt-1">
                  <input
                    type="text"
                    required
                    placeholder="Or enter image URL (https://...)"
                    value={newImage.image_url}
                    onChange={e => setNewImage({ ...newImage, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                {newImage.image_url && (
                  <img
                    src={newImage.image_url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200 mt-2"
                  />
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Album Modal */}
      {albumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Album</h3>
              <button onClick={() => setAlbumModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Independence Day 2024"
                  value={newAlbum.title}
                  onChange={e => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short summary of this album..."
                  value={newAlbum.description}
                  onChange={e => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newAlbum.cover_image}
                  onChange={e => setNewAlbum({ ...newAlbum, cover_image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAlbumModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
