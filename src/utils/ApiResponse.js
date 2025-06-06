class ApiResponse {
    constructor(
        statuscode,
        data,
        message = "Success"
    ) {
        this.statuscode = statuscode;
        this.message = message;
        this.data = data;
        this.success = statuscode >= 200 && statuscode < 300;
    }
}

export default ApiResponse;
