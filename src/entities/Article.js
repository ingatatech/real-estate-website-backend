var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { User } from './User.js';
import { ArticleCategory } from './ArticleCategory.js';
let Article = class Article {
    id;
    title;
    slug;
    excerpt;
    content;
    featuredImage;
    categoryId;
    authorId;
    publicationStatus;
    publishedAt;
    createdAt;
    updatedAt;
    author;
    category;
};
__decorate([
    PrimaryColumn('text')
], Article.prototype, "id", void 0);
__decorate([
    Column('text')
], Article.prototype, "title", void 0);
__decorate([
    Column('text', { unique: true })
], Article.prototype, "slug", void 0);
__decorate([
    Column('text', { nullable: true })
], Article.prototype, "excerpt", void 0);
__decorate([
    Column('text')
], Article.prototype, "content", void 0);
__decorate([
    Column('text', { name: 'featured_image', nullable: true })
], Article.prototype, "featuredImage", void 0);
__decorate([
    Column('text', { name: 'category_id', nullable: true })
], Article.prototype, "categoryId", void 0);
__decorate([
    Column('text', { name: 'author_id', nullable: true })
], Article.prototype, "authorId", void 0);
__decorate([
    Column('text', { name: 'publication_status', default: 'DRAFT' })
], Article.prototype, "publicationStatus", void 0);
__decorate([
    Column('timestamp', { name: 'published_at', nullable: true })
], Article.prototype, "publishedAt", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Article.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Article.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.articles),
    JoinColumn({ name: 'author_id' })
], Article.prototype, "author", void 0);
__decorate([
    ManyToOne(() => ArticleCategory, (category) => category.articles),
    JoinColumn({ name: 'category_id' })
], Article.prototype, "category", void 0);
Article = __decorate([
    Entity('articles')
], Article);
export { Article };
