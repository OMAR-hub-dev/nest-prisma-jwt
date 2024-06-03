import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { signupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { signinDto } from './dto/signinDto';
import { resetPasswordDto } from './dto/resetPasswordDto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
@Injectable()
export class AuthService {
  
  
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly JwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  
  async signup(signupDto: signupDto) {
    const { email, password, username } = signupDto;
    // Vérifier si l'utisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) {
      throw new ConflictException('cet utilisateur existe déja');
    }
    //  hacher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    // enregister l'utosateur en bdd
    await this.prismaService.user.create({
      data: { email, username, password: hash },
    });
    // envoyer un mail de confirmation
    await this.mailerService.sendSignupConfirmation(email);
    // retourner une reponse 
    return {data: 'Utilisateur est bien enregistrer'}
    
  }
  // connexion
  async signin(signinDto: signinDto) {
    const { email, password } = signinDto;
  // verification d el'utilisateur
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('cet utilisateur n\'existe pas');
    }
  //  comparer le mot de passe 
    const match = await bcrypt.compare(password, user.password)
    if (!match ) throw new UnauthorizedException(' votre Password est incorrecte')
  //  Retourner un token jwt
    const payload = {
      sub: user.userId,
      email: user.email,
    };
    const token = this.JwtService.sign(payload, {
      expiresIn: '2h',
      secret: this.configService.get('SECRET_KEY'),
    });
    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }
  
  async resetPassword(resetDto: resetPasswordDto) {
    const { email } = resetDto;
    // verification d el'utilisateur
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('cet utilisateur n\'existe pas');
    }

    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits:5,
      step: 60*15,
      encoding: 'base32',
    })
    const url = "https://localhost:3000/auth/reset-confiramtion"
    await this.mailerService.sendResetPassword(email, url, code)
    return {data : "reset password est bien envoyé"}
  }
  
  async resetPasswordConfirmation(resetConfirmDto: ResetPasswordConfirmationDto) {
    const { email, password, code  } = resetConfirmDto
    // verification d el'utilisateur
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) { throw new NotFoundException('cet utilisateur n\'existe pas');};
    const match = speakeasy.totp.verify({
      secret : this.configService.get('OTP_CODE'),
      token: code,
      digits:5,
      step: 60*15,
      encoding: 'base32',
    })
    if (!match)throw new UnauthorizedException('jetton invlaide ou expiré ')
      const hash = await bcrypt.hash(password, 10);
    await this.prismaService.user.update({where: { email}, data:{password: hash}})
    return {data : "mot de passe bien modifié"}
  }


}
