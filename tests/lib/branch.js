const { expect } = require('chai')

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

function verifyFailure (r) {
  expect(r.status).to.equal(400)
  expect(r.body['api:status']).to.equal('api:failure')
  expect(r.body['@type']).to.equal('api:BranchErrorResponse')
}

module.exports = {
  path,
  verifyFailure,
}
