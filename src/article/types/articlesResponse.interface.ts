import { ArticleEntity } from "@app/article/article.entity";
import { ArticleType } from "@app/article/types/article.type";

export interface ArticlesResponseInterface {
    articles: ArticleType[];
    articlesCount: number;
}
