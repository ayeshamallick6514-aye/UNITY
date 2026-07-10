import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import UnityMap from '../../components/map/UnityMap';
import {
  Send, HelpCircle, UploadCloud, X, Play,
  CheckCircle, MapPin, AlertCircle, Info
} from 'lucide-react';

// Seeding default files to match the screenshot on load
const MOCK_FILES = [
  {
    id: 'f1',
    name: 'IMG_20240710_1015.jpg',
    size: '2.4 MB',
    type: 'image',
    preview: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=150&auto=format&fit=crop&q=60'
  },
  {
    id: 'f2',
    name: 'IMG_20240710_1021.jpg',
    size: '2.4 MB',
    type: 'image',
    preview: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=150&auto=format&fit=crop&q=60'
  },
  {
    id: 'f3',
    name: 'VID_20240710_1025.mp4',
    size: '12.8 MB',
    type: 'video',
    preview: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&auto=format&fit=crop&q=60',
    duration: '00:15'
  }
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [category, setCategory] = useState('roads');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loc, setLoc] = useState('Near MP Nagar Road, Zone 1, Bhopal, Madhya Pradesh 462011');
  const [refId, setRefId] = useState('');
  const [files, setFiles] = useState(MOCK_FILES);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const newFiles = selected.map((file, idx) => {
      const isVideo = file.type.startsWith('video');
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: `f_${Date.now()}_${idx}`,
        name: file.name,
        size: `${sizeMB} MB`,
        type: isVideo ? 'video' : 'image',
        preview: URL.createObjectURL(file),
        duration: isVideo ? '00:10' : undefined
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc || !loc) return;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newRefId = `BPL-COM-${randomNum}`;

    const complaint = {
      id: newRefId,
      title,
      category,
      description: desc,
      location: loc,
      status: 'pending',
      date: new Date().toLocaleDateString('en-IN'),
      evidenceCount: files.length
    };

    // Save to storage
    const existing = JSON.parse(sessionStorage.getItem('complaints') || '[]');
    sessionStorage.setItem('complaints', JSON.stringify([complaint, ...existing]));

    setRefId(newRefId);
    setTitle('');
    setDesc('');
    setFiles([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 animate-fade-in">
      
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Complaint Filing Form</h2>
          <p className="text-xs text-slate-400 mt-1">
            Help us resolve issues faster by providing accurate details and evidence.
          </p>
        </div>
        <Button
          variant="secondary"
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
          onClick={() => alert('Connect with Helpdesk: Toll-free 1800-233-0136')}
        >
          <HelpCircle size={14} />
          Need Help?
        </Button>
      </div>

      {/* ─── Success Gate ──────────────────────────────────────── */}
      {refId ? (
        <Card status="approved" className="max-w-md mx-auto text-center p-8 space-y-5">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100 shadow-sm">
            <CheckCircle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Complaint Logged Successfully</h3>
            <p className="text-xs text-slate-400">Save the ticket reference key to track department updates:</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg inline-block">
            <code className="text-lg font-mono font-bold text-slate-800 tracking-widest">{refId}</code>
          </div>
          <div className="pt-2">
            <Button
              variant="secondary"
              className="w-full font-bold"
              onClick={() => setRefId('')}
            >
              File Another Complaint
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Department Category
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white shadow-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="roads">PWD / Roads Department</option>
                  <option value="water">BMC Water Supply</option>
                  <option value="energy">MPEB Electricity</option>
                  <option value="sanitation">Waste &amp; Sanitation</option>
                  <option value="traffic">Traffic Police</option>
                </select>
              </div>

              {/* Title */}
              <Input
                label="Issue Title"
                required
                placeholder="e.g. Large pothole near Carmel Convent School"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Location Input with Locate Button */}
              <div className="space-y-2">
                <Input
                  label="Exact Location"
                  required
                  placeholder="e.g. Zone 1, MP Nagar Road Widening corridor"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-blue-900 border border-slate-200 bg-white hover:bg-slate-50 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <MapPin size={12} />
                  Locate on Map
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 bg-white shadow-sm placeholder:text-slate-400"
                  rows={6}
                  maxLength={1000}
                  placeholder="Describe the problem, duration, and safety hazards..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Describe clearly for faster action</span>
                  <span>{desc.length}/1000</span>
                </div>
              </div>

            </div>

            {/* Right Column - Evidence and Maps */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Evidence Upload Box */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Upload Evidence (Photos / Videos) <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                  
                  {/* File Selector */}
                  <div
                    onClick={triggerFileInput}
                    className="md:col-span-5 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/50"
                  >
                    <UploadCloud size={28} className="text-blue-900 mb-2" />
                    <span className="text-[11px] font-bold text-slate-700">Drag &amp; drop files here</span>
                    <span className="text-[9px] text-slate-400 my-1">or</span>
                    <span className="text-[10px] font-bold text-white bg-blue-900 px-3.5 py-1.5 rounded-lg shadow-sm hover:bg-blue-800 transition-colors">
                      Choose Files
                    </span>
                    <span className="text-[8px] text-slate-400 mt-2">
                      Supported: JPG, PNG, MP4, MOV (Max 50MB each)
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Previews */}
                  <div className="md:col-span-7 flex flex-wrap gap-3 content-start">
                    {files.map((file) => (
                      <div key={file.id} className="relative w-28 bg-white border border-slate-100 rounded-xl p-1.5 shadow-sm">
                        
                        {/* Thumbnail wrapper */}
                        <div className="relative h-16 w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                          {file.type === 'video' ? (
                            <>
                              <img src={file.preview} alt="Video preview" className="w-full h-full object-cover opacity-80" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-blue-950 shadow-sm">
                                  <Play size={10} className="fill-current ml-0.5" />
                                </div>
                              </div>
                              <span className="absolute bottom-1 right-1 bg-black/60 text-[8px] text-white font-mono px-1 rounded">
                                {file.duration}
                              </span>
                            </>
                          ) : (
                            <img src={file.preview} alt="Evidence preview" className="w-full h-full object-cover" />
                          )}
                        </div>

                        {/* Close button */}
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-md transition-colors"
                        >
                          <X size={10} />
                        </button>

                        {/* File detail labels */}
                        <div className="mt-1.5 overflow-hidden">
                          <p className="text-[9px] font-bold text-slate-700 truncate leading-none">{file.name}</p>
                          <p className="text-[8px] text-slate-400 font-mono mt-0.5 leading-none">{file.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Info Tip Alert Banner */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                  <Info size={14} className="text-blue-900 shrink-0" />
                  <span className="text-[10px] font-medium text-blue-900 leading-normal">
                    Tip: Clear evidence helps the department take faster action.
                  </span>
                </div>
              </div>

              {/* Location Mapped Verification */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Location Preview
                </label>
                <div className="text-[10px] text-slate-400 font-medium">
                  Verify the location of the issue on the map.
                </div>
                <div className="h-44 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                  <UnityMap activeLayers={['road_projects', 'road_closures']} />
                </div>
                <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm">
                  <span className="text-[10px] text-slate-600 font-bold truncate">
                    {loc}
                  </span>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-blue-900 border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm shrink-0"
                    onClick={() => alert('Location pinned: MP Nagar Road, Zone 1')}
                  >
                    Use This Location
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Full Width Submit Area */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-blue-900 hover:bg-blue-800 text-white shadow-md flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <Send size={14} />
              Dispatch Complaint
            </button>
            <p className="text-center text-[10px] text-slate-400 font-medium">
              By submitting, you agree to our <span className="underline cursor-pointer">terms</span> and <span className="underline cursor-pointer">privacy policy</span>.
            </p>
          </div>

        </form>
      )}

    </div>
  );
}
