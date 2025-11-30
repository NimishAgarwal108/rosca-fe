/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Google User Content (for Google profile pictures)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Backend API
      {
        protocol: "https",
        hostname: "rosca-be.vercel.app",
      },
      // Localhost (for development)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
    // Add this to handle images better
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;