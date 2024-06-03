import { Injectable } from '@nestjs/common';
import * as nodemailer  from 'nodemailer';
@Injectable()
export class MailerService {
    private async transporter(){
        const testAccount = await nodemailer.createTestAccount();
        const transport = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            }
        })
        return transport
        }

        async sendSignupConfirmation(userEmail : string){
            (await this.transporter()).sendMail({
                from: "blog_nest@example.com",
                to : userEmail,
                subject: "Confirmation",
                html: "<h3>Confirmation d'inscription </h3>"
            })
        }

        async sendResetPassword(userEmail: string , url: string, code : string){
            (await this.transporter()).sendMail({
                from: "blog_nest@example.com",
                to : userEmail,
                subject: "Reset password",
                html: `
                <a href=${url} >Reset password</a>
                <p>Secret code <strong>${code}</strong></p>
                <p>code will expire in 15 minutes</p>
                `                
            })
        }
}
