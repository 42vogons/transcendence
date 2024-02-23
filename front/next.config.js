/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: process.env.NEXT_PUBLIC_BACK_HOST.split('://')[0],
				hostname:
					process.env.NEXT_PUBLIC_BACK_HOST.split('://')[1].split(
						':',
					)[0],
			},
		],
	},
}
module.exports = nextConfig
