const config = {
    API_URL: process.env.REACT_APP_API_URL || "http://localhost:8000", // Fallback if env variable is not set
    TIMEOUT: parseInt(process.env.REACT_APP_TIMEOUT, 10) || 5000, // Fallback if env variable is not set
  };
  
  export default config;