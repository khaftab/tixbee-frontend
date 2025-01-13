import axios, { AxiosInstance } from "axios";

let instance;

if (import.meta.env.DEV) {
  (async () => {
    try {
      const https = await import("https");
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

      axios.defaults.httpsAgent = httpsAgent;
      // instance = axios.create({
      //   httpsAgent,
      // });
      console.log("Development mode - RejectUnauthorized is disabled.");
    } catch (error) {
      console.error("Failed to import https module:", error);
    }
  })();
} else {
  instance = axios.create({
    withCredentials: true, // Important for cookies
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// export default instance as AxiosInstance;
export default axios;
