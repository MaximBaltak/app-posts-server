import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Request} from "express";
import {PayloadToken} from "../../types/auth";

export const UserId = createParamDecorator(
    (data: unknown , ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest<Request>()
        return (request.user as PayloadToken).id
    }
)
