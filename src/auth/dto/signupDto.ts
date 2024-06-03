import {IsString, IsEmail, IsNotEmpty, Length} from "class-validator"
export class signupDto{
    
    @IsNotEmpty()
    @Length(3,50)
    readonly username : string
    
    @IsEmail()
    readonly email : string

    
    @IsNotEmpty()
    @Length(6,50)
    readonly password : string
}