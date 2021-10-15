const { expect } = require('chai')
const { Agent, db, util } = require('../lib')

describe('db-noauth', function () {
  let agent

  before(function () {
    agent = new Agent()
  })

  it('fails on missing content-type', async function () {
    const { path } = db.path()
    const r = await agent.post(path)
    expect(r.status).to.equal(400)
    expect(r.body['api:status']).to.equal('api:failure')
    expect(r.body['@type']).to.equal('api:MissingContentTypeErrorResponse')
  })

  it('fails on invalid JSON', async function () {
    const { path } = db.path()
    const body = '{'
    const r = await agent
      .post(path)
      .type('application/json')
      .send(body)
    expect(r.status).to.equal(400)
    expect(r.body['api:status']).to.equal('api:failure')
    expect(r.body['system:object']).to.equal(body)
  })

  it('fails on missing comment and label', async function () {
    const { path } = db.path()
    const bodies = [
      {},
      { comment: 'c' },
      { label: 'l' },
    ]
    for (const body of bodies) {
      const r = await agent
        .post(path)
        .send(body)
      expect(r.status).to.equal(400)
      expect(r.body['api:status']).to.equal('api:failure')
      expect(r.body['@type']).to.equal('api:BadAPIDocumentErrorResponse')
      expect(r.body['api:error']['@type']).to.equal('api:RequiredFieldsMissing')
      expect(r.body['api:error']['api:expected'][0]).to.equal('comment')
      expect(r.body['api:error']['api:expected'][1]).to.equal('label')
    }
  })

  it('fails on duplicate field (#603)', async function () {
    const { path } = db.path()
    const r = await agent
      .post(path)
      .type('application/json')
      .send('{"comment":"c","comment":"c","label":"l"}')
    expect(r.status).to.equal(400)
    expect(r.body['@type']).to.equal('api:DuplicateField')
    expect(r.body['api:status']).to.equal('api:failure')
  })

  it('reports unknown organization', async function () {
    const { path, orgName } = db.path({ orgName: 'unknownorg-' + util.randomString() })

    {
      const r = await db.create(agent, path)
      expect(r.status).to.equal(400)
      expect(r.body['@type']).to.equal('api:DbCreateErrorResponse')
      expect(r.body['api:status']).to.equal('api:failure')
      expect(r.body['api:error']['@type']).to.equal('api:UnknownOrganization')
      expect(r.body['api:error']['api:organization_name']).to.equal(orgName)
    }
    {
      const r = await db.del(agent, path)
      expect(r.status).to.equal(400)
      expect(r.body['@type']).to.equal('api:DbDeleteErrorResponse')
      expect(r.body['api:status']).to.equal('api:failure')
      expect(r.body['api:error']['@type']).to.equal('api:UnknownOrganization')
      expect(r.body['api:error']['api:organization_name']).to.equal(orgName)
    }
  })
})
