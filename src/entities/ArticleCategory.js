var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Article } from './Article.js';
let ArticleCategory = class ArticleCategory {
    id;
    name;
    slug;
    description;
    isActive;
    createdAt;
    updatedAt;
    imageUrl;
    articles;
};
__decorate([
    PrimaryColumn('text')
], ArticleCategory.prototype, "id", void 0);
__decorate([
    Column('text', { unique: true })
], ArticleCategory.prototype, "name", void 0);
__decorate([
    Column('text', { unique: true })
], ArticleCategory.prototype, "slug", void 0);
__decorate([
    Column('text', { nullable: true })
], ArticleCategory.prototype, "description", void 0);
__decorate([
    Column('boolean', { name: 'is_active', default: true })
], ArticleCategory.prototype, "isActive", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], ArticleCategory.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], ArticleCategory.prototype, "updatedAt", void 0);
__decorate([
    Column('text', { name: 'image_url', nullable: true })
], ArticleCategory.prototype, "imageUrl", void 0);
__decorate([
    OneToMany(() => Article, (article) => article.category)
], ArticleCategory.prototype, "articles", void 0);
ArticleCategory = __decorate([
    Entity('article_categories')
], ArticleCategory);
export { ArticleCategory };
