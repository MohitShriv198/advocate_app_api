import {Injectable} from '@nestjs/common';

const HttpResponseCode: any = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
}

@Injectable()
export class HttpResponse {
    
    success(data = {}, message = '') {
        return {
            code: HttpResponseCode.OK,
            status: "success",
            message,
            data
        }
    }

    badRequest(data = {}, message = '') {
        return {
            code: HttpResponseCode.BAD_REQUEST,
            status: "error",
            message,
            data
        }
    }

    unauthorized(data = {}, message = '') {
        return {
            code: HttpResponseCode.UNAUTHORIZED,
            status: "error",
            message,
            data
        }
    }

    forbidden(data = {}, message = '') {
        return {
            code: HttpResponseCode.FORBIDDEN,
            status: "error",
            message,
            data
        }
    }

    notFound(data = {}, message = '') {
        return {
            code: HttpResponseCode.NOT_FOUND,
            status: "error",
            message,
            data
        }
    }

   
    serverError(data = {}, message = '') {
        return {
            code: HttpResponseCode.SERVER_ERROR,
            status: "error",
            message,
            data
        }
    }
}


