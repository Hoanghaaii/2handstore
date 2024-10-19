/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '2handstoreimg.s3.ap-southeast-2.amazonaws.com',
            pathname: '/**', // Cho phép tất cả các đường dẫn từ domain này
          },
        ],
      },
};

export default nextConfig;
