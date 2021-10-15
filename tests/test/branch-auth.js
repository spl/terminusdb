const { expect } = require('chai')
const { Agent, branch, util } = require('../lib')

describe('branch', function () {
  let agent

  before(function () {
    agent = new Agent().auth()
  })

  it('fails on bad origin descriptor', async function () {
    const { path } = branch.path()
    const originDescriptor = 'desc-' + util.randomString()
    const r = await agent
      .post(path)
      .send({ origin: originDescriptor })
    expect(r.status).to.equal(400)
    branch.verifyFailure(r)
    expect(r.body['api:error']['@type']).to.equal('api:BadOriginAbsoluteDescriptor')
    expect(r.body['api:error']['api:absolute_descriptor']).to.equal(originDescriptor)
  })

  it('fails on unknown origin database', async function () {
    const { path, orgName, dbName } = branch.path()
    const originDbName = dbName + '-origin'
    const r = await agent
      .post(path)
      .send({ origin: `${orgName}/${originDbName}` })
    expect(r.status).to.equal(400)
    branch.verifyFailure(r)
    expect(r.body['api:error']['@type']).to.equal('api:UnknownOriginDatabase')
    expect(r.body['api:error']['api:organization_name']).to.equal(orgName)
    expect(r.body['api:error']['api:database_name']).to.equal(originDbName)
  })
})
