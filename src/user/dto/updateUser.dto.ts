// dto stands for Data Transfer Object

import { IsEmail, IsNotEmpty } from "class-validator";


export class UpdateUserDto {

    readonly username: string;

    readonly email: string;

    readonly bio: string;

    readonly image: string;
}
