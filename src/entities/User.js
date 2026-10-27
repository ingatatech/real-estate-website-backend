var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Role } from './Role.js';
import { Agent } from './Agent.js';
import { Article } from './Article.js';
import { ContactMessage } from './ContactMessage.js';
import { Favorite } from './Favorite.js';
import { Inquiry } from './Inquiry.js';
import { ListingRequest } from './ListingRequest.js';
import { PropertySearch } from './PropertySearch.js';
import { ServiceRequest } from './ServiceRequest.js';
import { ValuationRequest } from './ValuationRequest.js';
import { ViewingRequest } from './ViewingRequest.js';
import { PageView } from './PageView.js';
import { PropertyView } from './PropertyView.js';
import { ClickEvent } from './ClickEvent.js';
let User = class User {
    id;
    name;
    email;
    phone;
    passwordHash;
    roleId;
    isActive;
    createdAt;
    updatedAt;
    lastLoginAt;
    canUploadPropertyMedia;
    passwordResetTokenHash;
    passwordResetExpiresAt;
    role;
    agent;
    articles;
    contactMessages;
    favorites;
    inquiries;
    listingRequests;
    propertySearches;
    serviceRequests;
    valuationRequests;
    viewingRequests;
    pageViews;
    propertyViews;
    clickEvents;
};
__decorate([
    PrimaryColumn('text')
], User.prototype, "id", void 0);
__decorate([
    Column('text', { nullable: true })
], User.prototype, "name", void 0);
__decorate([
    Column('text', { unique: true })
], User.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], User.prototype, "phone", void 0);
__decorate([
    Column('text', { name: 'password_hash' })
], User.prototype, "passwordHash", void 0);
__decorate([
    Column('integer', { name: 'role_id' })
], User.prototype, "roleId", void 0);
__decorate([
    Column('boolean', { name: 'is_active', default: true })
], User.prototype, "isActive", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], User.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], User.prototype, "updatedAt", void 0);
__decorate([
    Column('timestamp', { name: 'last_login_at', nullable: true })
], User.prototype, "lastLoginAt", void 0);
__decorate([
    Column('boolean', { name: 'can_upload_property_media', default: false })
], User.prototype, "canUploadPropertyMedia", void 0);
__decorate([
    Column('text', { name: 'password_reset_token_hash', nullable: true })
], User.prototype, "passwordResetTokenHash", void 0);
__decorate([
    Column('timestamp', { name: 'password_reset_expires_at', nullable: true })
], User.prototype, "passwordResetExpiresAt", void 0);
__decorate([
    ManyToOne(() => Role, (role) => role.users),
    JoinColumn({ name: 'role_id' })
], User.prototype, "role", void 0);
__decorate([
    OneToMany(() => Agent, (agent) => agent.user)
], User.prototype, "agent", void 0);
__decorate([
    OneToMany(() => Article, (article) => article.author)
], User.prototype, "articles", void 0);
__decorate([
    OneToMany(() => ContactMessage, (message) => message.user)
], User.prototype, "contactMessages", void 0);
__decorate([
    OneToMany(() => Favorite, (favorite) => favorite.user)
], User.prototype, "favorites", void 0);
__decorate([
    OneToMany(() => Inquiry, (inquiry) => inquiry.user)
], User.prototype, "inquiries", void 0);
__decorate([
    OneToMany(() => ListingRequest, (request) => request.user)
], User.prototype, "listingRequests", void 0);
__decorate([
    OneToMany(() => PropertySearch, (search) => search.user)
], User.prototype, "propertySearches", void 0);
__decorate([
    OneToMany(() => ServiceRequest, (request) => request.user)
], User.prototype, "serviceRequests", void 0);
__decorate([
    OneToMany(() => ValuationRequest, (request) => request.user)
], User.prototype, "valuationRequests", void 0);
__decorate([
    OneToMany(() => ViewingRequest, (request) => request.user)
], User.prototype, "viewingRequests", void 0);
__decorate([
    OneToMany(() => PageView, (pageView) => pageView.user)
], User.prototype, "pageViews", void 0);
__decorate([
    OneToMany(() => PropertyView, (propertyView) => propertyView.user)
], User.prototype, "propertyViews", void 0);
__decorate([
    OneToMany(() => ClickEvent, (clickEvent) => clickEvent.user)
], User.prototype, "clickEvents", void 0);
User = __decorate([
    Entity('users')
], User);
export { User };
