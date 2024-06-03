import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { signupDto } from './dto/signupDto';
import { signinDto } from './dto/signinDto';
import { AuthService } from './auth.service';
import { resetPasswordDto } from './dto/resetPasswordDto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
    @Post('/signup')
    async signup(@Body() signupDto : signupDto ){
    return await this.authService.signup(signupDto)
  }  
  @Post('/signin')
    signin(@Body() signinDto : signinDto ){
    return  this.authService.signin(signinDto)
  }


  @Post('/reset')
  resetPasswordDemand(@Body() resetDto : resetPasswordDto){
    return  this.authService.resetPassword(resetDto)
  }
  @Post('/reset-confirmation')
  resetPasswordConfirmation(@Body() resetconfirmDto: ResetPasswordConfirmationDto){
    return  this.authService.resetPasswordConfirmation(resetconfirmDto)
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete')
  deleteAccount(){
    return "compte supprimé ..."
  }



}
