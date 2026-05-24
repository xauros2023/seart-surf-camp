"use client";

import { useState, useEffect } from "react";
import { Save, UploadCloud, CheckCircle, CalendarDays, Users, MessageSquare } from "lucide-react";
import { updateContent, uploadImage } from "../actions";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("content");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [dormPrice, setDormPrice] = useState("");
  const [privatePrice, setPrivatePrice] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImg, setUploadingImg] = useState<string | null>(null);
  
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if(data && data.hero) {
          setHeroTitle(data.hero.title);
          setHeroSubtitle(data.hero.subtitle);
        }
        if(data && data.rooms) {
          setDormPrice(data.rooms.dormPrice);
          setPrivatePrice(data.rooms.privatePrice);
        }
      })
      .catch(console.error);
      
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(console.error);
  }, []);

  const handleSaveContent = async () => {
    setSaving(true);
    const result = await updateContent(heroTitle, heroSubtitle, dormPrice, privatePrice);
    setSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImg(fileName);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("fileName", fileName);
    
    const result = await uploadImage(formData);
    setUploadingImg(null);
    if (result.success) {
      alert("Image replaced successfully! (You might need to refresh the page to bypass browser cache)");
    } else {
      alert("Error replacing image.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-300 pb-2">
        <button 
          className={`pb-2 px-4 ${activeTab === 'content' ? 'border-b-2 border-ocean-dark font-bold text-ocean-dark' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('content')}
        >
          Edit Content
        </button>
        <button 
          className={`pb-2 px-4 ${activeTab === 'images' ? 'border-b-2 border-ocean-dark font-bold text-ocean-dark' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('images')}
        >
          Manage Images
        </button>
        <button 
          className={`pb-2 px-4 flex items-center ${activeTab === 'bookings' ? 'border-b-2 border-ocean-dark font-bold text-ocean-dark' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Reservations <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{bookings.length}</span>
        </button>
      </div>

      {activeTab === 'content' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Website Content</h2>
            {saveSuccess && <span className="text-green-600 flex items-center font-bold"><CheckCircle size={18} className="mr-1"/> Saved</span>}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Hero Title</label>
              <input type="text" className="w-full border border-gray-300 p-2 rounded focus:border-ocean-dark focus:outline-none" 
                     value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Hero Subtitle</label>
              <textarea className="w-full border border-gray-300 p-2 rounded focus:border-ocean-dark focus:outline-none" rows={3} 
                        value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Dorms Price</label>
                <input type="text" className="w-full border border-gray-300 p-2 rounded focus:border-ocean-dark focus:outline-none" 
                       value={dormPrice} onChange={(e) => setDormPrice(e.target.value)} placeholder="e.g. 15€" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Private Room Price</label>
                <input type="text" className="w-full border border-gray-300 p-2 rounded focus:border-ocean-dark focus:outline-none" 
                       value={privatePrice} onChange={(e) => setPrivatePrice(e.target.value)} placeholder="e.g. 45€" />
              </div>
            </div>
            <button onClick={handleSaveContent} disabled={saving} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold transition-colors disabled:opacity-50">
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['hero-bg.png', 'quad.png', 'campfire.png', 'interior.png'].map((img, idx) => (
              <div key={idx} className="border border-gray-200 p-4 rounded-lg flex flex-col items-center hover:shadow-md transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/${img}?t=${Date.now()}`} alt={img} className="h-40 w-full object-cover rounded-md mb-4" />
                <p className="font-mono text-sm text-gray-600 mb-4">{img}</p>
                <div className="relative w-full">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                         onChange={(e) => handleUploadImage(e, img)} disabled={uploadingImg === img} />
                  <button type="button" className={`flex items-center justify-center w-full space-x-2 border-2 border-ocean-dark text-ocean-dark px-4 py-2 rounded font-bold transition-colors ${uploadingImg === img ? 'opacity-50' : 'hover:bg-ocean-dark hover:text-white'}`}>
                    <UploadCloud size={18} />
                    <span>{uploadingImg === img ? 'Uploading...' : 'Replace Image'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Reservation Requests</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500 italic">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.slice().reverse().map((booking: any) => (
                <div key={booking.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-ocean-dark font-bold"><CalendarDays size={16} className="mr-1"/> {booking.checkIn} to {booking.checkOut}</span>
                      <span className="flex items-center text-gray-700"><Users size={16} className="mr-1"/> {booking.guests}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(booking.date).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 bg-white p-3 rounded border border-gray-200 text-gray-800">
                    <span className="flex items-center text-xs font-bold text-gray-500 mb-1"><MessageSquare size={14} className="mr-1"/> Message:</span>
                    {booking.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
