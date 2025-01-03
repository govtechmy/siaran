import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // LAST_UPDATED: new Date().toISOString(),
    }
};
 
export default withNextIntl(nextConfig);