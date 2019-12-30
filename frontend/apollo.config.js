module.exports = {
  client: {
    service: {
      name: 'backend',
      url: 'http://localhost:4000',
    },
    service: {
      name: 'backendfile',
      localSchemaFile: './schema.gql',
    },
  },
}
