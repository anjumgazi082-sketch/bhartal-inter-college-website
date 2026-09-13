import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Filter, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { api } from '../services/api';
import type { GalleryImage, GalleryAlbum } from '../types';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await api.gallery.getAll();
        setImages(res.images || []);
        setAlbums(res.albums || []);
        setCategories(['All', ...(res.categories || [])]);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
    const matchesAlbum = selectedAlbum === 'All' || String(img.album_id) === selectedAlbum;
    return matchesCategory && matchesAlbum;
  });

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredImages.length);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ImageIcon className="w-4 h-4" />
            <span>Campus Moments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            A visual journey celebrating campus life, national festivals, sports competitions, annual days, and academic achievements.
          </p>
        </div>
      </section>

      {/* Filter and Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Filter:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {albums.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto text-xs">
              <span className="font-semibold text-slate-500 shrink-0">Albums:</span>
              <button
                onClick={() => setSelectedAlbum('All')}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  selectedAlbum === 'All' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Albums
              </button>
              {albums.map(alb => (
                <button
                  key={alb.id}
                  onClick={() => setSelectedAlbum(String(alb.id))}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    selectedAlbum === String(alb.id)
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {alb.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Images Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading gallery...</div>
        ) : filteredImages.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            No photos found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer shadow-xs border border-slate-200 hover:shadow-md transition-all"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || 'Bhartal Inter College'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                  <span className="self-end bg-black/50 text-white p-1.5 rounded-full backdrop-blur-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>

                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      {img.category}
                    </span>
                    <p className="text-xs font-medium text-white line-clamp-2 mt-0.5">{img.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredImages[activeLightboxIndex] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-amber-400 p-2 rounded-full bg-black/50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 p-3 rounded-full bg-black/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 p-3 rounded-full bg-black/50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-3"
          >
            <img
              src={filteredImages[activeLightboxIndex].image_url}
              alt={filteredImages[activeLightboxIndex].caption || 'Enlarged photo'}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center text-white px-4">
              <span className="text-xs font-semibold text-amber-400">
                {filteredImages[activeLightboxIndex].category}
              </span>
              <p className="text-sm font-medium mt-0.5">
                {filteredImages[activeLightboxIndex].caption || 'Bhartal Inter College Photo'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeLightboxIndex + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
