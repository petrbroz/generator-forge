const { FORGE_CLIENT_ID, FORGE_CLIENT_SECRET, FORGE_BUCKET, PORT } = process.env;

if (!FORGE_CLIENT_ID || !FORGE_CLIENT_SECRET || !FORGE_BUCKET) {
    console.warn('Some environment variables are missing.');
    process.exit(1);
}

module.exports = {
    port: parseInt(PORT) || 3000,
    forge: {
        client_id: FORGE_CLIENT_ID,
        client_secret: FORGE_CLIENT_SECRET,
        bucket: FORGE_BUCKET
    }
};
