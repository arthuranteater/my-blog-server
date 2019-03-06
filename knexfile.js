// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgresql://localhost/my-blog-1'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }

};
