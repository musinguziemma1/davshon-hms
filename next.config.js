/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix: allow CSS files with @tailwind directives to pass through PostCSS
    const cssRules = config.module.rules.find(
      (rule) => Array.isArray(rule.oneOf)
    );
    if (cssRules) {
      cssRules.oneOf.forEach((rule) => {
        if (Array.isArray(rule.use)) {
          rule.use = rule.use.filter(
            (u) =>
              !(
                typeof u === "object" &&
                u.loader &&
                u.loader.includes("next-flight-css-loader")
              )
          );
        }
      });
    }
    return config;
  },
};
module.exports = nextConfig;
