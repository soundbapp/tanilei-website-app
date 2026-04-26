/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  /**
   * Reduces dev-only UI that hooks into the App Router; helps avoid
   * “SegmentViewNode / React Client Manifest” flakiness with webpack HMR
   * (use `npm run dev` with Turbopack for the most stable dev experience).
   */
  devIndicators: false,
};

export default nextConfig;
