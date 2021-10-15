const assert = require('assert')
const superagent = require('superagent')

const baseUrl = process.env.TERMINUSDB_BASE_URL || 'http://localhost:6363'

// Create a base superagent with the base URL as a prefix for requests.
function base () {
  return superagent
    .agent()
    // Consider response status codes other than server errors as successful.
    // See <https://visionmedia.github.io/superagent/#error-handling>.
    .ok((r) => r.status < 500)
    .use(prependBaseUrl)
    .use(verboseError)
}

// This is an agent plugin that prepends the base URL.
function prependBaseUrl (request) {
  request.url = baseUrl + request.url
}

// This is an agent plugin that prints the request and response to stderr when
// there is an error.
function verboseError (request) {
  request.on('error', (err) => {
    const response = err.response
    if (!response) {
      return
    }

    const contentType = response.header['content-type']
    if (!contentType) {
      return
    }

    err.message += '\n' + response.error.method + ' ' + response.error.path

    const request = response.request

    if (request._header) {
      err.message += '\nRequest headers: ' + JSON.stringify(request._header, null, 2)
    }
    if (request._data) {
      err.message += '\nRequest body: ' + JSON.stringify(request._data, null, 2)
    }

    err.message += '\nResponse status: ' + response.error.status
    err.message += '\nResponse headers: ' + JSON.stringify(response.headers, null, 2)
    if (contentType.startsWith('application/json') && response.body) {
      err.message += '\nResponse body: ' + JSON.stringify(response.body, null, 2)
    }
    if (contentType.startsWith('text') && response.text) {
      err.message += '\nResponse body: ' + response.text
    }
  })
}

// This is an agent plugin that adds authentication.
function auth (request) {
  const user = process.env.TERMINUSDB_USER
  assert(user, 'Missing environment variable: TERMINUSDB_USER')

  const token = process.env.TERMINUSDB_ACCESS_TOKEN
  if (token) {
    request.auth(token, { type: 'bearer' })
  } else {
    const pass = process.env.TERMINUSDB_PASS
    assert(pass, 'Missing environment variable: TERMINUSDB_ACCESS_TOKEN or TERMINUSDB_PASS')
    request.auth(user, pass)
  }
}

module.exports = {
  baseUrl,
  base,
  auth,
}
