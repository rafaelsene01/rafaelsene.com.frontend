import axios from "axios";

const api = axios.create({
  baseURL: "https://rafaelsene.herokuapp.com/"
});

export default api;
