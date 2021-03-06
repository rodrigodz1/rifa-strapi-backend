module.exports = ({ env }) => ({
    url: env('DATABASE_URL'),
});