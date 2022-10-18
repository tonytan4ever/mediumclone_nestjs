import { User } from "@app/user/decorators/user.decorator";
import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProfileService } from "@app/profile/profile.service";
import { ProfileResponseInterface } from "@app/profile/types/profileResponse.interface";
import { AuthGuard } from "@app/user/guards/auth.guards";

@Controller("profiles")
export class ProfileController {

    constructor(private readonly profileService: ProfileService){

    }

    @Get(':username')
    async getProfile(@User('id') currentUserId: number, @Param('username') profileUserName: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.getProfile(currentUserId, profileUserName);
        return this.profileService.buildProfileResponse(profile);
    }

    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(@User('id') currentUserId: number, @Param('username') profileUserName: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.followProfile(currentUserId, profileUserName);
        return this.profileService.buildProfileResponse(profile);
    }

    @Delete(':username/follow')
    @UseGuards(AuthGuard)
    async unfollowProfile(@User('id') currentUserId: number, @Param('username') profileUserName: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.unfollowProfile(currentUserId, profileUserName);
        return this.profileService.buildProfileResponse(profile);
    }
}
