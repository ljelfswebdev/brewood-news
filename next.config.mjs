/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
      {
        source: '/commitee',
        destination: '/committee',
        permanent: true,
      },
      {
        source: '/Commitee',
        destination: '/committee',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
