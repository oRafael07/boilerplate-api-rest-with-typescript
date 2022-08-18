import { NextFunction, Request, Response } from "express";
import { client } from "../prisma/client";
import { hash, compare } from 'bcrypt'

import { IRequestLogin, IRequestRegister, IRequestRefreshToken } from '../types/index'
import generateToken from "../helpers/generateToken";
import generateRefreshToken from "../helpers/generateRefreshToken";
import { verify } from 'jsonwebtoken'

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password, username } = <IRequestRegister>req.body

    if(!(email || name || password || username)){
        return res.status(400).send({ error: 'All fields is Required!' })
    }

    const userExists = await client.user.findFirst({
        where: {
            email,
            username
        }
    })

    if(userExists) return res.status(400).send({ error: 'User already exists!' })

    const passwordHash = await hash(password, 8);

    const user = await client.user.create({
        data: {
            name,
            password: passwordHash,
            username,
            email,
            updateAt: null
        }
    })

    user.password = undefined

    const token = generateToken({ id: user.id })
    const refresh_token = generateRefreshToken({ id: user.id })

    return res.send({
        user,
        token,
        refresh_token
    })
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <IRequestLogin>req.body

    if(!(email || password)) return res.status(400).send({ error: 'All fields is Required!'})

    const user = await client.user.findFirst({
        where: {
            email
        }
    })

    if(!user) return res.status(401).send({ error: 'Email or Password is Invalids!'});

    if(!compare(password, user.password)) return res.status(401).send({ error: 'Email or Password is Invalids!'});

    const token = generateToken({ id: user.id })
    const refresh_token = generateRefreshToken({ id: user.id })

    user.password = undefined
    user.createdAt = undefined
    user.updateAt = undefined

    return res.send({
        user,
        token,
        refresh_token
    })
}

export const RefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = <IRequestRefreshToken>req.body

    if(!refresh_token) return res.status(400).send({ error: 'All fields is Required!'})

    try{
        verify(refresh_token, process.env['REFRESH_SECRET'], async (err, decoded: { id: string }) => {
            if(err) return res.status(401).send({ error: 'Token Invalid'});

            const user = await client.user.findFirst({
                where: {
                    id: decoded.id
                }
            })

            if(!user) return res.status(401).send({ error: 'Token Invalid'});

            const token = generateToken({ id: user.id })
            const refresh_token = generateRefreshToken({ id: user.id })

            return res.send({
                token,
                refresh_token
            })
        })
    } catch(err) {
        return res.status(400).send({ error: 'Error Internal'});
    }
}