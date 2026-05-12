/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Protocol of the remote images
        hostname: "img.clerk.com", // Hostname of the remote images
        port: "", // Port of the remote images (leave empty if not using)
        pathname: "/**", // Pathname pattern of the remote images
      },
    ],
  },
};

export default nextConfig;
