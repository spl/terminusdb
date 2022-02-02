const { expect } = require('chai')
const { Agent, organization, util } = require('../lib')

describe('organization', function () {
  let agent

  before(async function () {
    agent = new Agent().auth()
  })

  describe('fails adding on missing parameters', function () {
    const options = [
      ['{"organization_name":"abd"}', 'user_name'],
      ['{"user_name":"adj"}', 'organization_name'],
    ]
    for (const [bodyString, missingParam] of options) {
      it(bodyString, async function () {
        const r = await organization
          .add(agent, { bodyString: bodyString })
          .then(organization.verifyAddFailure)
        expect(r.body['api:error']['@type']).to.equal('api:MissingParameter')
        expect(r.body['api:error']['api:parameter']).to.equal(missingParam)
      })
    }
  })

  describe('with random organization name', function () {
    let params
    before(async function () {
      params = {
        organization_name: util.randomString(),
      }
    })
    after(async function () {
      // deleting organizations is unfortunately broken right now.
      /*
      await organization
        .del(agent, params)
        .then(organization.verifyDelSuccess)
      */
    })

    it('succeeds adding organization', async function () {
      await organization
        .add(agent, params)
        .then(organization.verifyAddSuccess)
    })
  })

  describe('with random organization name with pipe', function () {
    let params
    before(async function () {
      params = {
        organization_name: util.randomString() + '|pipe',
      }
    })
    after(async function () {
      // deleting organizations is unfortunately broken right now.
      /*
      await organization
        .del(agent, params)
        .then(organization.verifyDelSuccess)
      */
    })

    it('succeeds adding organization', async function () {
      await organization
        .add(agent, params)
        .then(organization.verifyAddSuccess)
    })
  })

  it('fails adding unknown user', async function () {
    const userName = util.randomString()
    const r = await organization
      .add(agent, {
        organization_name: util.randomString(),
        user_name: userName,
      })
      .then(organization.verifyAddFailure)
    expect(r.body['api:error']['@type']).to.equal('api:UnknownUser')
    expect(r.body['api:error']['api:user_name']).to.equal(userName)
  })

  it('fails deleting unknown organization', async function () {
    const organizationName = util.randomString()
    const r = await organization
      .del(agent, { organization_name: organizationName })
      .then(organization.verifyDelFailure)
    expect(r.body['api:error']['@type']).to.equal('api:UnknownOrganization')
    expect(r.body['api:error']['api:organization_name']).to.equal(organizationName)
  })
})
