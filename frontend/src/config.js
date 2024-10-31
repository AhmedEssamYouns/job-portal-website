let BASE_URL = "http://job-portal-website-production.up.railway.app/";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "http://job-portal-website-production.up.railway.app/";
}

export { BASE_URL };
