import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.externals.push({
                bufferutil: "bufferutil",
                "utf-8-validate": "utf-8-validate",
            })
        }
        return config
    },
};

export default nextConfig;
