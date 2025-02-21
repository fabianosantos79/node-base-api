import {Request, Response, NextFunction} from 'express'
import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { User } from '../models/User'

const notAuthorizedJson = {status: 400, nessage: 'Não autorizado'}

//Configuração da Estratégia
passport.use(new BasicStrategy( async (email, password, done) => {
    if(email && password){
        const user = await User.findOne({
            where: {email, password}
        })

        if(user){
            return done(null, user)
        }
    }
    return done(notAuthorizedJson, false)
}))

//Configuração do Middleware
export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('basic', (err, user) => {
        req.user = user
        if(user){
            next()
        }else{
            next(notAuthorizedJson)
        }
    })(req, res, next)
}


export default passport