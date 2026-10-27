var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { User } from './User.js';
import { Inquiry } from './Inquiry.js';
import { Property } from './Property.js';
import { ViewingRequest } from './ViewingRequest.js';
let Agent = class Agent {
    id;
    userId;
    name;
    slug;
    email;
    phone;
    profileImage;
    bio;
    specialization;
    licenseNumber;
    yearsExperience;
    isActive;
    createdAt;
    updatedAt;
    user;
    inquiries;
    properties;
    viewingRequests;
};
__decorate([
    PrimaryColumn('text')
], Agent.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'user_id', unique: true })
], Agent.prototype, "userId", void 0);
__decorate([
    Column('text')
], Agent.prototype, "name", void 0);
__decorate([
    Column('text', { unique: true })
], Agent.prototype, "slug", void 0);
__decorate([
    Column('text', { nullable: true })
], Agent.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], Agent.prototype, "phone", void 0);
__decorate([
    Column('text', { name: 'profile_image', nullable: true })
], Agent.prototype, "profileImage", void 0);
__decorate([
    Column('text', { nullable: true })
], Agent.prototype, "bio", void 0);
__decorate([
    Column('text', { nullable: true })
], Agent.prototype, "specialization", void 0);
__decorate([
    Column('text', { name: 'license_number', nullable: true })
], Agent.prototype, "licenseNumber", void 0);
__decorate([
    Column('integer', { name: 'years_experience', nullable: true })
], Agent.prototype, "yearsExperience", void 0);
__decorate([
    Column('boolean', { name: 'is_active', default: true })
], Agent.prototype, "isActive", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Agent.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Agent.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.agent, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' })
], Agent.prototype, "user", void 0);
__decorate([
    OneToMany(() => Inquiry, (inquiry) => inquiry.agent)
], Agent.prototype, "inquiries", void 0);
__decorate([
    OneToMany(() => Property, (property) => property.agent)
], Agent.prototype, "properties", void 0);
__decorate([
    OneToMany(() => ViewingRequest, (request) => request.agent)
], Agent.prototype, "viewingRequests", void 0);
Agent = __decorate([
    Entity('agents')
], Agent);
export { Agent };
