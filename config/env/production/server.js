module.exports = ({ env }) => ({
    url: env(process.env.DATABASE_URL),
});