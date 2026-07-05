import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { MapPin } from "lucide-react";
export const customMarker = L.divIcon({
  html: renderToString(
    <MapPin
      size={40}
      color="#2563eb"
      fill="#2563eb"
      strokeWidth={2}
    />
  ),
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});
const MapView = ({ places }) => {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom={false}  
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place, index) => {
       
        if (!place?.coordinates?.latitude || !place?.coordinates?.longitude) {
          return null; 
        }

        return (
          <Marker
  key={index}
  position={[
    place.coordinates.latitude,
    place.coordinates.longitude,
  ]}
  icon={customMarker}
>
  <Popup>
    <h3>{place.name}</h3>
    <p>{place.description}</p>

    {place?.photos?.[0]?.url && (
      <img
        src={place.photos[0].url}
        width="150"
        alt={place.name}
      />
    )}
  </Popup>
</Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;