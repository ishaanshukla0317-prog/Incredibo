import { useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";

const AddPlace = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", type: "", city: "", state: "", address: "",
    history: "", description: "", timings: "", best_time_to_visit: "Winter",
    tags: "", rating: "", latitude: "", longitude: "",
    indianFee: 0, foreignerFee: 0, currency: "INR"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      name: formData.name,
      type: formData.type,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      history: formData.history,
      description: formData.description,
      timings: formData.timings,
      best_time_to_visit: formData.best_time_to_visit,
      rating: Number(formData.rating) || 0,
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [], 
      coordinates: {
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0
      },
      entry_fee: {
        indian: Number(formData.indianFee) || 0,
        foreigner: Number(formData.foreignerFee) || 0,
        currency: formData.currency
      }
    };

    const submitData = new FormData();
    submitData.append("placeData", JSON.stringify(formattedData));
    
    if (imageFile) {
      submitData.append("photo", imageFile);
    }

    try {
      await api.post("/api/places/add", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
      
      setFormData({
        name: "", type: "", city: "", state: "", address: "",
        history: "", description: "", timings: "", best_time_to_visit: "Winter",
        tags: "", rating: "", latitude: "", longitude: "",
        indianFee: 0, foreignerFee: 0, currency: "INR"
      });
      setImageFile(null);
      
      if (onSuccess) onSuccess(); 
      
    } catch (error) {
      console.error("Error adding place:", error);
      alert("Failed to add the destination.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white/30 backdrop-blur-md border border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-3xl mx-auto mb-12 text-slate-900"
    >
      <h3 className="text-3xl font-black text-center mb-6">Register a New Spot</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input type="text" name="name" placeholder="Place Name" required onChange={handleChange} value={formData.name} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
          <input type="text" name="city" placeholder="City" required onChange={handleChange} value={formData.city} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <input type="text" name="state" placeholder="State" required onChange={handleChange} value={formData.state} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
          <input type="text" name="address" placeholder="Full Address" required onChange={handleChange} value={formData.address} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input type="text" name="timings" placeholder="Timings" required onChange={handleChange} value={formData.timings} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
          <input type="text" name="type" placeholder="Type" required onChange={handleChange} value={formData.type} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>          
        </div>
        
        <h1 className="text-xl font-bold mt-2">Coordinates </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="number" step="any" name="longitude" placeholder="Longitude" required onChange={handleChange} value={formData.longitude} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
            <input type="number" step="any" name="latitude" placeholder="Latitude" required onChange={handleChange} value={formData.latitude} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
        </div>
        
        <textarea name="description" placeholder="Short Description..." rows="3" required onChange={handleChange} value={formData.description} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium w-full"></textarea> 
        <textarea name="history" placeholder="History..." rows="3" required onChange={handleChange} value={formData.history} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium w-full"></textarea>
        <input type="text" name="tags" placeholder="Tags (comma separated: ancient, mythical, scenic)" onChange={handleChange} value={formData.tags} className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"/>
        
        <h1 className="text-xl font-bold mt-2">Upload Photo</h1>
        <input 
          type="file" 
          accept="image/*" 
          required 
          onChange={(e) => setImageFile(e.target.files[0])} 
          className="p-3 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        <button type="submit" disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:bg-slate-400">
          {loading ? "Uploading to Cloudinary & Saving..." : "Add to Guide"}
        </button>

      </form>
    </motion.div>
  );
};

export default AddPlace;