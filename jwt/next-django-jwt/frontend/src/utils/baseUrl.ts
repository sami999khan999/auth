const baseUrl = () => {
  if (typeof window !== "undefined") {
    return "http://localhost:8000/api";
  }

  return process.env.NEXT_PUBLIC_API_URL;
};

export default baseUrl;
