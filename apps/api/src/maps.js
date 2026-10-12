import { getDistance, isPointInPolygon } from 'geolib';

export const MapProvider = {
  async geocode(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'RestaurantApp/1.0' } });
    return res.json();
  },

  async reverseGeocode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'RestaurantApp/1.0' } });
    return res.json();
  },

  calculateDistance(coord1, coord2) {
    // Distance in meters
    return getDistance(coord1, coord2);
  },

  isInZone(point, center, radiusKm, polygon) {
    if (polygon && polygon.length > 2) {
      return isPointInPolygon(point, polygon);
    }
    const dist = getDistance(point, center);
    return dist <= radiusKm * 1000;
  }
};