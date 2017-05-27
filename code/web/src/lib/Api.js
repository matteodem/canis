import qs from 'qs'
import axios from 'axios'

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
    registerApp: async () => {
      try {
        const response = await doRequest({
          method: 'post',
          url: `${endpoint}/api/v1/apps`,
          data: {
            client_name: 'mastoviewr',
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
  }

  return methods
}
