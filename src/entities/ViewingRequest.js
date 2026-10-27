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
let ViewingRequest = class ViewingRequest {
    id;
    propertyId;
    userId;
    agentId;
    name;
    email;
    phone;
    preferredDate;
    preferredTime;
    message;
    status;
    createdAt;
    updatedAt;
    agent;
    property;
    user;
};
__decorate([
    PrimaryColumn('text')
], ViewingRequest.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'property_id' })
], ViewingRequest.prototype, "propertyId", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], ViewingRequest.prototype, "userId", void 0);
__decorate([
    Column('text', { name: 'agent_id', nullable: true })
], ViewingRequest.prototype, "agentId", void 0);
__decorate([
    Column('text')
], ViewingRequest.prototype, "name", void 0);
__decorate([
    Column('text')
], ViewingRequest.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], ViewingRequest.prototype, "phone", void 0);
__decorate([
    Column('timestamp', { name: 'preferred_date', nullable: true })
], ViewingRequest.prototype, "preferredDate", void 0);
__decorate([
    Column('text', { name: 'preferred_time', nullable: true })
], ViewingRequest.prototype, "preferredTime", void 0);
__decorate([
    Column('text', { nullable: true })
], ViewingRequest.prototype, "message", void 0);
__decorate([
    Column('text', { default: 'PENDING' })
], ViewingRequest.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], ViewingRequest.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], ViewingRequest.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Agent, (agent) => agent.viewingRequests),
    JoinColumn({ name: 'agent_id' })
], ViewingRequest.prototype, "agent", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.viewingRequests, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'property_id' })
], ViewingRequest.prototype, "property", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.viewingRequests),
    JoinColumn({ name: 'user_id' })
], ViewingRequest.prototype, "user", void 0);
ViewingRequest = __decorate([
    Entity('viewing_requests')
], ViewingRequest);
export { ViewingRequest };
