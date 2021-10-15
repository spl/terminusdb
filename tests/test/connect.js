const { expect } = require('chai')
const { agents } = require('../lib')

describe('connect', function () {
  let agent

  before(function () {
    agent = agents.base()
  })

  it('responds with empty array', async function () {
    const r = await agent.get('/api/')
    expect(r.status).to.equal(200)
    expect(r.body).to.be.an('array').that.has.lengthOf(0)
  })
})
