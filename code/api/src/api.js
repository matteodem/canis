const qs = require('qs')
const url = require('url')
const axios = require('axios')
const { json, send } = require('micro')

const setCrossOriginHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  )
}

module.exports = ({ mastodonUri, clientId, clientSecret }) => async (req, res) => {
  setCrossOriginHeaders(res)

  if (req.method.toLowerCase() === 'options') {
    return send(res, 200, '')
  }

  const { endpoint, method, data, withCredentials, headers } = await json(req)

  if (!endpoint || !method) {
    return send(res, 400, {
      status: 400,
      message: 'Endpoint or method not set',
    })
  }

  const endpointUri = url.resolve(mastodonUri, endpoint)

  try {
    if (withCredentials) {
      data.client_id = clientId
      data.client_secret = clientSecret
    }

    const endpointRes = await axios.request({
      method,
      headers,
      url: endpointUri,
      paramsSerializer: (params) => qs.stringify(params, {
        arrayFormat: 'brackets',
      }),
      params: (method.toLowerCase() === 'get' ? data : {}),
      data: (method.toLowerCase() !== 'get' ? qs.stringify(data) : ''),
    })

    send(res, 200, endpointRes.data)
  } catch (e) {
    send(res, 500, {
      status: 500,
      message: e.message,
    })
  }
}
