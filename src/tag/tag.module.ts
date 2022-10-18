import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagController } from './tag.controller';
import { TagEntity } from "./tag.entity";
import { TagService } from "./tag.service";

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
    controllers: [TagController],
    // Dependency Injection Providers
    providers: [TagService]
})
export class TagModule {

}
