import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/sat-act",             destination: "/#how",   permanent: false },
      { source: "/services",            destination: "/",       permanent: false },
      { source: "/college-admissions",  destination: "/",       permanent: false },
    ];
  },
};

export default nextConfig;
