import { sign } from "jsonwebtoken"


const generateToken = (payload : string | object | Buffer) => {
    return sign(payload, process.env['JWT_SECRET'], {
        expiresIn: 86400
    })
}

export default generateToken