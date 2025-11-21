/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

      // Localhost (for file uploads in development)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },

      // API Base URL (automatic)
      {
        protocol: "https",
        hostname:
          process.env.NEXT_PUBLIC_API_BASE_URL?.replace("https://", "")
            .replace("http://", "")
            .split("/")[0] || "",
      },
    ],
  },
};

export default nextConfig;
