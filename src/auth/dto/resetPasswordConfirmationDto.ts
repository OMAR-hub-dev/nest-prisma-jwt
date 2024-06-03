import {IsString, IsEmail, IsNotEmpty, Length} from "class-validator"
export class ResetPasswordConfirmationDto{
    

    @IsNotEmpty()
    @IsEmail()
    readonly email : string

    
    @IsNotEmpty()
    @Length(6,50)
    readonly password : string
    
    @IsNotEmpty()
    readonly code : string
  
}