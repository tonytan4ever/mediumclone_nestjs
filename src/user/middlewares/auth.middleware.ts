import { ExpressRequest } from "@app/types/expressRequest.interface";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Response } from "express";
import { verify } from 'jsonwebtoken';
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {

    }

    async use(req: ExpressRequest, _: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null;
            next();
            return;
        }

        const token = req.headers.authorization.split(' ')[1];

        try {
            const decode  = verify(token, this.configService.get('JWT_SECRET_KEY'))
            const user = await this.userService.findById(decode.id);
            req.user = user;
            next();
        } catch (err) {
            req.user = null;
            next();
        }

    }

}
