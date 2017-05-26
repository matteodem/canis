import axios from 'axios'

const call = (endpoint, data) => axios.post(endpoint, data)

export default (endpoint) => ({
  getToken: (email, password) => call(endpoint, {
    endpoint: '/oauth/token',
    method: 'post',
    data: {
      grant_type: 'password',
      username: email,
      password,
    },
    withCredentials: true,
  }),
  callAuthorized: (token, data) => call(endpoint, {
    ...data,
    ...{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  }),
})
