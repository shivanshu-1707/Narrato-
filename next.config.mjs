/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns:[
      {
        hostname:'lh3.googleusercontent.com',
      },
      {
        hostname:"res.cloudinary.com"
      }
    ]
  },
  webpack:(config)=>{
    config.resolve.alias.canvas = false;
    return config;
  },
  
};

export default nextConfig;
