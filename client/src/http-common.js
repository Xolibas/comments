import axios from "axios";

const host = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    "Content-type": "application/json"
  }
});

const authInterceptor = config => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`

  return config
}

host.interceptors.request.use(authInterceptor)

export default host;