import { Module } from "@nestjs/common";
import { UserController } from "@app/user/user.controller";
import { UserService } from "@app/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { AuthGuard } from "@app/user/guards/auth.guards";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, AuthGuard],
    // this is for authmidware to be able to inject userservice
    exports: [UserService],
})
export class UserModule {

}
