/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [{ protocol: 'https', hostname: 'flagsapi.com' }],
	},
};

module.exports = nextConfig;
