var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, } from 'typeorm';
import { User } from './User.js';
let PageView = class PageView {
    id;
    userId;
    sessionId;
    pagePath;
    pageTitle;
    referrer;
    utmSource;
    utmMedium;
    utmCampaign;
    utmTerm;
    utmContent;
    deviceType;
    browser;
    os;
    ipAddress;
    country;
    city;
    createdAt;
    user;
};
__decorate([
    PrimaryColumn('text')
], PageView.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], PageView.prototype, "userId", void 0);
__decorate([
    Column('text', { name: 'session_id', nullable: true })
], PageView.prototype, "sessionId", void 0);
__decorate([
    Column('text', { name: 'page_path' })
], PageView.prototype, "pagePath", void 0);
__decorate([
    Column('text', { name: 'page_title', nullable: true })
], PageView.prototype, "pageTitle", void 0);
__decorate([
    Column('text', { name: 'referrer', nullable: true })
], PageView.prototype, "referrer", void 0);
__decorate([
    Column('text', { name: 'utm_source', nullable: true })
], PageView.prototype, "utmSource", void 0);
__decorate([
    Column('text', { name: 'utm_medium', nullable: true })
], PageView.prototype, "utmMedium", void 0);
__decorate([
    Column('text', { name: 'utm_campaign', nullable: true })
], PageView.prototype, "utmCampaign", void 0);
__decorate([
    Column('text', { name: 'utm_term', nullable: true })
], PageView.prototype, "utmTerm", void 0);
__decorate([
    Column('text', { name: 'utm_content', nullable: true })
], PageView.prototype, "utmContent", void 0);
__decorate([
    Column('text', { name: 'device_type', nullable: true })
], PageView.prototype, "deviceType", void 0);
__decorate([
    Column('text', { name: 'browser', nullable: true })
], PageView.prototype, "browser", void 0);
__decorate([
    Column('text', { name: 'os', nullable: true })
], PageView.prototype, "os", void 0);
__decorate([
    Column('text', { name: 'ip_address', nullable: true })
], PageView.prototype, "ipAddress", void 0);
__decorate([
    Column('text', { name: 'country', nullable: true })
], PageView.prototype, "country", void 0);
__decorate([
    Column('text', { name: 'city', nullable: true })
], PageView.prototype, "city", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], PageView.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.pageViews, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'user_id' })
], PageView.prototype, "user", void 0);
PageView = __decorate([
    Entity('page_views'),
    Index(['userId']),
    Index(['pagePath']),
    Index(['createdAt'])
], PageView);
export { PageView };
