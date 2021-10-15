const { expect } = require('chai')
const { agents, branch, util } = require('../lib')

describe('branch', function () {
  let agent

  before(function () {
    agent = agents.base().use(agents.auth)
  })

  it('fails on bad origin descriptor', async function () {
    const { path } = branch.path()
    const originDescriptor = 'desc-' + util.randomString()
    const r = await agent
      .post(path)
      .send({ origin: originDescriptor })
    expect(r.status).to.equal(400)
    expect(r.body['@type']).to.equal('api:BranchErrorResponse')
    expect(r.body['api:status']).to.equal('api:failure')
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
    expect(r.body['@type']).to.equal('api:BranchErrorResponse')
    expect(r.body['api:status']).to.equal('api:failure')
    expect(r.body['api:error']['@type']).to.equal('api:UnknownOriginDatabase')
    expect(r.body['api:error']['api:organization_name']).to.equal(orgName)
    expect(r.body['api:error']['api:database_name']).to.equal(originDbName)
  })
})
