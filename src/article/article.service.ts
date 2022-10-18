import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateArticleDto } from "@app/article/dto/createArticle.dto";
import { ArticleEntity } from "@app/article/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { UserEntity } from "@app/user/user.entity";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import slugify from "slugify";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponse.interface";
import { FollowEntity } from "@app/profile/follow.entity";


@Injectable()
export class ArticleService {
    async getFeed(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
        const follows = await this.followRepository.find({
            where: {
                followerId: currentUserId
            }
        });

        if (follows.length == 0) {
            return { articles: [], articlesCount: 0 }
        }

        const followingUserIds = follows.map(follow => follow.followingId);
        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
            .where('articles.authorId IN (:...ids)', {ids: followingUserIds});

        queryBuilder.orderBy('articles.createAt', 'DESC');

        const articlesCount = await queryBuilder.getCount();

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        const articles = await queryBuilder.getMany();

        return { articles, articlesCount };
    }

    async deleteArticleFromFavorites(slug: string, userId: number): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['favorites']
        });

        const articleIndex = user.favorites.findIndex(
            (articleInFavorites) => articleInFavorites.id === article.id,
        );

        if (articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favoritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    async addArticleToFavorites(slug: string, userId: number): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['favorites']
        });

        const isNotFavorited = user.favorites.findIndex(
            (articleInFavorites) => articleInFavorites.id === article.id,
        ) === -1;

        if (isNotFavorited) {
            user.favorites.push(article);
            article.favoritesCount++;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author');   // notice here is articles.author

        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {
                tag: `%${query.tag}%`
            })
        }

        if (query.author) {
            const author = await this.userRepository.findOneBy({username: query.author});
            queryBuilder.andWhere('articles.authorId = :id', {
                id: author.id
            })
        }

        if (query.favorited) {
            const author = await this.userRepository.findOne({
                where: {
                    username: query.favorited
                },
                relations: ['favorites']
            });
            const ids = author.favorites.map((el) => el.id);
            if (ids.length > 0) {
                queryBuilder.andWhere('articles.id IN (:...ids)', { ids })
            } else {
                queryBuilder.andWhere('1=0');
            }
            // console.log('author', author);
            // console.log(queryBuilder.getQuery())
        }

        queryBuilder.orderBy('articles.updatedAt', "DESC");

        const articlesCount = await queryBuilder.getCount();

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        let favoriteIds: number[] = [];
        if (currentUserId) {
            const currentUser = await this.userRepository.findOne({
                where: {
                    id: currentUserId
                },
                relations: ['favorites']
            });
            favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
        }

        const articles = await queryBuilder.getMany();
        const articlesWithFavorited = articles.map(article => {
            const favorited = favoriteIds.includes(article.id);
            return { ...article, favorited };
        })

        return { articles: articlesWithFavorited, articlesCount }

    }

    async updateArticle(slug: string, updateArticleDto: CreateArticleDto, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);

        if (!article) {
            throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
        }

        Object.assign(article, updateArticleDto)

        return await this.articleRepository.save(article);
    }

    async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
        const article = await this.findBySlug(slug);

        if (!article) {
            throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({ slug });

    }

    async findBySlug(slug: string): Promise<ArticleEntity> {
        return await this.articleRepository.findOneBy({
            slug: slug
        });
    }

    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
    ) {

    }

    async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);
        if (!article.tagList) {
            article.tagList = [];
        }


        article.slug = this.getSlug(createArticleDto.title);
        article.author = user;

        return await this.articleRepository.save(article);
    }

    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article };
    }

    private getSlug(title: string): string {
        return slugify(title, {lower: true}) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }

}
