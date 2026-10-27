var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
let SitePage = class SitePage {
    id;
    title;
    slug;
    content;
    pageType;
    metaTitle;
    metaDescription;
    isPublished;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryColumn('text')
], SitePage.prototype, "id", void 0);
__decorate([
    Column('text')
], SitePage.prototype, "title", void 0);
__decorate([
    Column('text', { unique: true })
], SitePage.prototype, "slug", void 0);
__decorate([
    Column('text', { nullable: true })
], SitePage.prototype, "content", void 0);
__decorate([
    Column('text', { name: 'page_type', nullable: true })
], SitePage.prototype, "pageType", void 0);
__decorate([
    Column('text', { name: 'meta_title', nullable: true })
], SitePage.prototype, "metaTitle", void 0);
__decorate([
    Column('text', { name: 'meta_description', nullable: true })
], SitePage.prototype, "metaDescription", void 0);
__decorate([
    Column('boolean', { name: 'is_published', default: true })
], SitePage.prototype, "isPublished", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], SitePage.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], SitePage.prototype, "updatedAt", void 0);
SitePage = __decorate([
    Entity('site_pages')
], SitePage);
export { SitePage };
