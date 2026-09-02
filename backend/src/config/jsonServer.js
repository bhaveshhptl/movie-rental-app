import axios from "axios";
import { config } from "./env.js";

export const jsonServerClient = axios.create({
  baseURL: config.jsonServerUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});