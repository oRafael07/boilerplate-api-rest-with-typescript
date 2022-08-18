import { sign } from "jsonwebtoken"


const generateRefreshToken = (payload : string | object | Buffer) => {
    return sign(payload, process.env['REFRESH_SECRET'], {
        expiresIn: 604800
    })
}

export default generateRefreshToken