import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
              place.coordinates.longitude
            ]}
          >
            <Popup>
              <h3>{place.name}</h3>
              <p>{place.description}</p>
              
              
              {place?.photos?.[0]?.url && (
                 <img src={place.photos[0].url} width="150" alt={place.name} />
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;