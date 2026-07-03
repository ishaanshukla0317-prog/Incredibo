import { useState, useEffect } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import { faLocationDot, faSpinner, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'; 
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";
import AddPlace from "../controller/AddPlaces"; 
import ExistingPlaces from "../controller/ExistingPlaces";

const About = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [showForm, setShowForm] = useState(false); 
  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchPlaces = () => {
    setIsLoading(true);
    api.get("/api/places")
      .then(res => {
        setPlaces(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("ERROR fetching places:", err);
        setError("Failed to load destinations.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handlePlaceAdded = () => {
    setShowForm(false); 
    fetchPlaces();     
  };

  return (
    <>
    <div>
    <ExistingPlaces/>
    <div className="min-h-screen pb-12 flex flex-col">

      <div className="flex-grow bg-gradient-to-br from-orange-900 via-blue-900 to-green-600">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Explore Destinations</h1>
            {!user && (
  <p className="text-yellow-300 mt-2">
    Login to add new places.
  </p>
)}
           {user && (
  <button
    onClick={() => setShowForm(!showForm)}
    className="bg-white text-blue-900 font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-gray-100 transition flex items-center"
  >
    <FontAwesomeIcon
      icon={showForm ? faTimes : faPlus}
      className="mr-2"
    />
    {showForm
      ? "Cancel"
      : "Add New Place"}
  </button>
)}
              
          </div>

          <AnimatePresence>
            {showForm && (
               <AddPlace onSuccess={handlePlaceAdded} />
            )}
          </AnimatePresence>


          {isLoading && (
             <div className="flex justify-center items-center h-64 text-white text-2xl">
               <FontAwesomeIcon icon={faSpinner} spin className="mr-3" /> Loading...
             </div>
          )}

          {!isLoading && !error && places.length > 0 && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
             </div>
          )}

        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default About;