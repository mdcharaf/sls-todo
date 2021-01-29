export default {
    makeResponse(statusCode, data) {
        return {
            statusCode,
            body: JSON.stringify(data)
        };
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
    notFound(message) {
        return this.makeResponse(404, { message });
    }
};
//# sourceMappingURL=response.js.map