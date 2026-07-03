import { useState, useEffect } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";

const ExistingPlaces = () => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/places")
      .then(res => {
        setPlaces(res.data);
      })
      .catch(err => {
        console.error("ERROR fetching places:", err);
      });
  }, []);

  return (
    <div className="min-h-screen pb-12">
      <div className="bg-black text-white p-6 ">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }} className="w-full h-[350px] md:h-[500px] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-white/20">
          <MapView  places={places} />
        </motion.div>
      </div>

      <div className="container min-h-screen bg-gradient-to-br from-orange-900 via-blue-900 to-green-600 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {places.map((place) => (
          <motion.div
            key={place._id}
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="
              flex flex-col h-full
              bg-white/30 backdrop-blur-md 
              border border-white/40 
              shadow-2xl 
              rounded-2xl md:rounded-3xl 
              p-6 sm:p-8 md:p-10
              text-center
            "
          >
            <img 
              src={place.photos?.[0]?.url || '/placeholder-image.jpg'} 
              alt={place.photos?.[0]?.caption || place.name} 
              className="w-full h-48 md:h-64 object-cover rounded-xl mb-6 md:mb-8 shadow-md"
            />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 md:mb-6">
              {place.name}
            </h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-6">
              {place.tags?.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-orange-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="h-1 w-16 md:w-20  bg-orange-500 rounded-full shrink-0 mx-auto mb-4 md:mb-6" /> 
            
            <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed flex-grow mb-6">
              <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-orange-500" />
              {place.address}                      
            </p>
            
            <button 
              className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-blue-500 transition shadow-lg mt-auto" 
              onClick={() => navigate(`/about/${place._id}`)}
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExistingPlaces;