const { expect } = require('chai')
const { Agent, db } = require('../lib')

describe('db', function () {
  let agent

  before(function () {
    agent = new Agent().auth()
  })

  it('fails on deleting nonexistent database', async function () {
    const { path, orgName, dbName } = db.path()

    // Delete a database but don't verify.
    await db.delUnverified(agent, path)

    // Delete the same database.
    const r = await db.del(agent, path)
    db.verifyDeleteNotFound(r)
    expect(r.body['api:error']['@type']).to.equal('api:UnknownDatabase')
    expect(r.body['api:error']['api:organization_name']).to.equal(orgName)
    expect(r.body['api:error']['api:database_name']).to.equal(dbName)
  })
})
