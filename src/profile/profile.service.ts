import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProfileType } from "@app/profile/types/profile.type";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { ProfileResponseInterface } from "@app/profile/types/profileResponse.interface";
import { FollowEntity } from "./follow.entity";

@Injectable()
export class ProfileService {

    async unfollowProfile(currentUserId: number, profileUserName: string): Promise<ProfileType> {
        const user = await this.userRepository.findOneBy({
            username: profileUserName
        });

        if (!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
        }

        if (currentUserId === user.id) {
            throw new HttpException('Follower and followee cant be the same', HttpStatus.BAD_REQUEST);
        }


        await this.followRepository.delete({
            followerId: currentUserId,
            followingId: user.id,
        });

        return {...user, following: false}
    }

    async followProfile(currentUserId: number, profileUserName: string): Promise<ProfileType> {
        const user = await this.userRepository.findOneBy({
            username: profileUserName
        });

        if (!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
        }

        if (currentUserId === user.id) {
            throw new HttpException('Follower and followee cant be the same', HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followRepository.findOneBy({
            followerId: currentUserId,
            followingId: user.id,
        })

        if (!follow) {
            const followToCreate = new FollowEntity();
            followToCreate.followerId = currentUserId;
            followToCreate.followingId = user.id;
            await this.followRepository.save(followToCreate);
        }

        return {...user, following: true}
    }

    buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
        delete profile.email;
        return { profile };
    }

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>) {

    }

    async getProfile(currentUserId: number, profileUserName: string): Promise<ProfileType> {
        const user = await this.userRepository.findOneBy({
            username: profileUserName
        });

        if (!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
        }

        const follow = await this.followRepository.findOneBy({
            followerId: currentUserId,
            followingId: user.id,
        })

        return {...user, following: Boolean(follow)}
    }

}
