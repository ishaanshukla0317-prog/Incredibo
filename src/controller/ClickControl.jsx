import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ClickControl() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    api.get("/api/places")
      .then((res) => {
        const found = res.data.find((p) => p._id === id);
        setPlace(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!place) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-white to-green-500 p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {place.name}
        </h1>
        <p className="text-gray-600 mb-6">
          {place.city}, {place.state}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={place.photos?.[0]?.url || "/placeholder-image.jpg"}
            alt={place.name}
            className="w-full h-80 object-cover rounded-2xl shadow-lg"
          />
          <div className="flex flex-col justify-between">
            <p className="text-gray-700 text-lg mb-4">
              {place.description}
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Type:</strong> {place.type}</p>
              <p><strong>Timings:</strong> {place.timings}</p>
              <p><strong>Best Time:</strong> {place.best_time_to_visit}</p>
              <p><strong>Rating:</strong> ⭐ {place.rating}</p>
              <p>
                <strong>Entry Fee:</strong> ₹{place.entry_fee?.indian} (Indian)
              </p>
            </div>
          </div>
        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-3 text-gray-800">
            History
          </h2>
          <p className="text-gray-700 leading-relaxed bg-gray-100 p-4 rounded-xl shadow-inner">
            {place.history}
          </p>
        </div>
      </div>
    </div>
  );
}