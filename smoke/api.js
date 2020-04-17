const axios = require('axios')
const port = process.env.PORT || 5000
const _get = require('lodash/get')

module.exports = async ({ url, method, token = '', body = {} }) => {
  try {
    const res = await axios({
      baseURL: `http://localhost:${port}`,
      url,
      method,
      headers: {
        authorization: token,
      },
      data: body,
    })

    const data = _get(res, 'data.data', {})
    const message = _get(res, 'data.message', '')
    const status = _get(res, 'status', 0)

    return { data, message, status }
  } catch (err) {
    const response = _get(err, 'response', {})

    const status = _get(response, 'status', 0)
    const apiMessage = _get(response, 'data.message')
    const apiError = _get(response, 'data.error')
    const message = apiMessage ? `${apiError} - ${apiMessage}` : err.toString()
    return { data: {}, message, status }
  }
}
