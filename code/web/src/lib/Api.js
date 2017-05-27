import qs from 'qs'
import axios from 'axios'
import es from 'event-source/eventsource'

const EventSource = es.default

const doRequest = (
    {
      url,
      method = 'get',
      params = {},
      data = {},
      headers = {},
    }
  ) => axios.request({
    url,
    params,
    method,
    headers,
    data: qs.stringify(data),
    paramsSerializer: (params) => qs.stringify(params, {
      arrayFormat: 'brackets',
    }),
  })



export default (endpoint) => {
  const methods = {
    registerApp: async (appName) => {
      try {
        const response = await doRequest({
          method: 'post',
          url: `${endpoint}/api/v1/apps`,
          data: {
            client_name: appName,
            redirect_uris: window.location.href,
            scopes: 'read',
          },
        })

        return response.data
      } catch (e) {
        return {}
      }
    },
    getToken: async (code, clientId, clientSecret, baseUri) => {
      const res = await doRequest({
        method: 'post',
        url: `${endpoint}/oauth/token`,
        data: {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: baseUri,
        }
      })

      return res.data
    },
    getUser: async (token) => {
      const res = await methods.callWithToken(token, '/api/v1/accounts/verify_credentials')

      return res.data
    },
    callWithToken: (token, path, requestData) => doRequest({
      ...requestData,
      url: `${endpoint}${path}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
    streamWithToken: (token, path, onMessage) => {
      const source = new EventSource(`${endpoint}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      source.onopen = function (e) {
        source.onmessage = function (event) {
          console.log(event)
        }
      }

      source.onerror = function (e) {
        console.error(e)
      }
    }
  }

  return methods
}
