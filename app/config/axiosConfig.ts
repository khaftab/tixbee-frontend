import axios from "axios";

if (import.meta.env.DEV) {
  (async () => {
    try {
      const https = await import("https");
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

      axios.defaults.httpsAgent = httpsAgent;
      console.log("Development mode - RejectUnauthorized is disabled.");
    } catch (error) {
      console.error("Failed to import https module:", error);
    }
  })();
}

export default axios;
