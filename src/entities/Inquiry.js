var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Agent } from './Agent.js';
import { Property } from './Property.js';
import { User } from './User.js';
let Inquiry = class Inquiry {
    id;
    propertyId;
    agentId;
    userId;
    name;
    email;
    phone;
    inquiry;
    status;
    createdAt;
    updatedAt;
    agent;
    property;
    user;
};
__decorate([
    PrimaryColumn('text')
], Inquiry.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'property_id', nullable: true })
], Inquiry.prototype, "propertyId", void 0);
__decorate([
    Column('text', { name: 'agent_id', nullable: true })
], Inquiry.prototype, "agentId", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], Inquiry.prototype, "userId", void 0);
__decorate([
    Column('text')
], Inquiry.prototype, "name", void 0);
__decorate([
    Column('text')
], Inquiry.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], Inquiry.prototype, "phone", void 0);
__decorate([
    Column('text')
], Inquiry.prototype, "inquiry", void 0);
__decorate([
    Column('text', { default: 'NEW' })
], Inquiry.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Inquiry.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Inquiry.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Agent, (agent) => agent.inquiries),
    JoinColumn({ name: 'agent_id' })
], Inquiry.prototype, "agent", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.inquiries),
    JoinColumn({ name: 'property_id' })
], Inquiry.prototype, "property", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.inquiries),
    JoinColumn({ name: 'user_id' })
], Inquiry.prototype, "user", void 0);
Inquiry = __decorate([
    Entity('inquiries')
], Inquiry);
export { Inquiry };
