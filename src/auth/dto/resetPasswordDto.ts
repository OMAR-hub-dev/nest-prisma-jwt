import {IsString, IsEmail, IsNotEmpty, Length} from "class-validator"
export class resetPasswordDto{
    

    @IsNotEmpty()
    @IsEmail()
    readonly email : string

    
    
}