const request = require('request')
const queryString = require('querystring')

const createRequest = (method, url, data, options) => {
    return new Promise((resolve, reject) => {
        let headers = {}
        const res = {
            status: 502,
            body: {}
        }
        const settings = {
            method: method,
            url: url,
            headers: headers,
            body: queryString.stringify(data)
        }
        request(settings, (error, response, body) => {
            if(error) {
                reject(error)
            } else {
                res.status = response.statusCode
                if(response.statusCode == '200' && response.headers['content-type'] != 'audio/mpeg') {
                    res.body = JSON.parse(body)
                } else {
                    res.body = {code: res.status}
                }
                resolve(res)
            }
        })

    })
}

module.exports = createRequest


