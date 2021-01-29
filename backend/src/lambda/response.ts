export default {
  makeResponse(statusCode, data) {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }
  },
  created(data = {}) {
    return this.makeResponse(201, data);
  },
  success(data = {}) {
    return this.makeResponse(200, data);
  },
  error(message) {
    return this.makeResponse(422, { message });
  },
  notFound(data = {}) {
    return this.makeResponse(404, data);
  },
  badRequest(message) {
    return this.makeResponse(400, { message })
  }
}