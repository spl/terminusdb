const { expect } = require('chai')
const { Agent } = require('../lib')

describe('branch-noauth', function () {
  let agent

  before(function () {
    agent = new Agent()
  })

  it('fails on unknown descriptor', async function () {
    const r = await agent
      .post('/api/branch/unknowndesc')
      .send({})
    expect(r.status).to.equal(400)
    expect(r.body['api:status']).to.equal('api:failure')
    expect(r.body['@type']).to.equal('api:BranchErrorResponse')
    expect(r.body['api:error']['@type']).to.equal('api:BadTargetAbsoluteDescriptor')
    expect(r.body['api:error']['api:absolute_descriptor']).to.equal('unknowndesc')
  })
})
