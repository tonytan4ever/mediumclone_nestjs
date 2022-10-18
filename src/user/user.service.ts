import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserEntity } from "@app/user/user.entity";
import { sign } from "jsonwebtoken";
import { UserResponseInterface } from "@app/user/types/userResponse.interface";
import { ConfigService } from "@nestjs/config";
import { LoginUserDto } from "./dto/loginUser.dto";
import { compare } from 'bcrypt';
import { UpdateUserDto } from "./dto/updateUser.dto";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly configService: ConfigService
    ) {

    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const errorResponse = {
            errors: {}
        };

        const userByEmail = await this.userRepository.findOneBy({
            email: createUserDto.email,
        });
        const userByUsername = await this.userRepository.findOneBy({
            username: createUserDto.username,
        });

        if (userByEmail) {
            errorResponse.errors['email'] = 'has already been taken';
        }

        if (userByUsername) {
            errorResponse.errors['username'] = 'has already been taken';
        }

        if (userByEmail || userByUsername) {
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        // console.log('newUser', newUser);

        return await this.userRepository.save(newUser);
    }

    async findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOneBy({
            id: id
        })
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const errorResponse = {
            errors: {
                'email or password': 'is invalid',
            }
        };

        const user = await this.userRepository.findOne({
            where: {
            email: loginUserDto.email
            },
            select: ['id', 'username', 'email', 'bio', 'image', 'password']
        })

        console.log('user', user);

        if (!user) {
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const isPasswordCorrect = await compare(loginUserDto.password, user.password);

        if (!isPasswordCorrect) {
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        delete user.password;
        return user;
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.findById(userId);
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }

    generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            user: user.username,
            email: user.email
        }, this.configService.get('JWT_SECRET_KEY'));
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            },
        }
    }

}
