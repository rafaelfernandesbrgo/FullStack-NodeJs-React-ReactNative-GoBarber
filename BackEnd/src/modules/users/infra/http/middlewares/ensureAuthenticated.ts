import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AuthConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAutheticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    // veja se tem em header o authozation
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError('JWT token is missing.', 401);
    }

    // ve se token válido com a chave, se tem erro, trato
    try {
        const [, token] = authHeader.split(' '); // retorna um vetor com o q tava antes e depois do espaço, q é desestruturado em tipo(descartado) e token propriamente
        const decoded = verify(token, AuthConfig.jwt.secret);
        const { sub } = decoded as ITokenPayload;
        request.user = {
            id: sub,
        };
        return next();
    } catch {
        throw new AppError('Invalid JWT token.', 401);
    }
}
