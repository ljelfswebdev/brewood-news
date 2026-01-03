/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
    async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true, // 308 redirect
      },
    ];
  },
};

export default nextConfig;
