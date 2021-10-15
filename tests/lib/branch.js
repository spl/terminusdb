const { Params } = require('./params.js')
const util = require('./util.js')

function path (params) {
  params = new Params(params)
  const orgName = params.string('orgName', process.env.TERMINUSDB_USER)
  const dbName = params.string('dbName', 'db-' + util.randomString())
  params.assertEmpty()

  return {
    path: `/api/branch/${orgName}/${dbName}`,
    orgName: orgName,
    dbName: dbName,
  }
}

module.exports = {
  path,
}
