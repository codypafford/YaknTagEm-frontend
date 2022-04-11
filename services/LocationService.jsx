import axios from "axios";
import { REACT_NATIVE_API_URL } from "@env";

// Pull REACT_NATIVE_API_URL from .env
// http://<URL>:5000/api/

class LocationService {
  async createLocation(location) {
    return axios.post("http://73.224.86.127:5000/api/create-location", {
      name: location.name,
      tags: location.tags,
      difficulty: location.difficulty,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  async getAllLocations() {
    console.log("The base url: " + REACT_NATIVE_API_URL);
    return axios.get(REACT_NATIVE_API_URL + "locations");
  }

  async updateTagsByLocationID(id, tags) {
    console.log("Sending id: " + id);
    console.log("Sending tags: ");
    console.log(tags);
    return axios.post(REACT_NATIVE_API_URL + "update-location-tags", {
      id: id,
      tags: tags,
    });
  }

  async getLocationById(id) {
    console.log("Id being sent: " + id);
    return axios.get(REACT_NATIVE_API_URL + "get-location-by-id/" + id);
  }
}

export default new LocationService();
