const { expect } = require('chai')
const { agents } = require('../lib')

describe('ok', function () {
  let agent

  before(function () {
    agent = agents.base()
  })

  it('responds with success', async function () {
    const r = await agent.get('/api/ok')
    expect(r.status).to.equal(200)
    expect(r.header['content-length']).to.equal('0')
  })
})
