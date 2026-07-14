import axios from "axios";

export default axios.create({
  categoryImageURL: "http://localhost:5000/category",
  imagesURL: "http://localhost:5000/products",
  baseURL: "http://localhost:5000/api",
  domain: "http://localhost:5000",
});
