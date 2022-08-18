import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken'

const Auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).send({ error: 'No token provided'});

    const parts = authHeader.split(" ");

    if(parts.length !== 2) return res.status(401).send({ error: 'Token Error'});

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformatted'});

    verify(token, process.env['REFRESH_SECRET'], (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token Invalid'});

        return next();
    })
}

export default Auth