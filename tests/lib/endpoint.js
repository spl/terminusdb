// Each of these functions contructs a path for an endpoint.

const { Params } = require('./params.js')

function branch (params) {
  params = new Params(params)
  const orgName = params.stringRequired('orgName')
  const dbName = params.stringRequired('dbName')
  return {
    path: `/api/branch/${orgName}/${dbName}`,
    orgName: orgName,
    dbName: dbName,
  }
}

function db (params) {
  params = new Params(params)
  const orgName = params.stringRequired('orgName')
  const dbName = params.stringRequired('dbName')
  return {
    path: `/api/db/${orgName}/${dbName}`,
    orgName: orgName,
    dbName: dbName,
  }
}

function document (params) {
  params = new Params(params)
  const orgName = params.stringRequired('orgName')
  const dbName = params.stringRequired('dbName')
  return {
    path: `/api/document/${orgName}/${dbName}`,
    orgName: orgName,
    dbName: dbName,
  }
}

function remote (params) {
  params = new Params(params)
  const orgName = params.stringRequired('orgName')
  const dbName = params.stringRequired('dbName')
  return {
    path: `/api/remote/${orgName}/${dbName}`,
    orgName: orgName,
    dbName: dbName,
  }
}

module.exports = {
  branch,
  db,
  document,
  remote,
}
