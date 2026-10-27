var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Service } from './Service.js';
import { User } from './User.js';
let ServiceRequest = class ServiceRequest {
    id;
    serviceId;
    userId;
    name;
    email;
    phone;
    message;
    status;
    createdAt;
    updatedAt;
    service;
    user;
};
__decorate([
    PrimaryColumn('text')
], ServiceRequest.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'service_id' })
], ServiceRequest.prototype, "serviceId", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], ServiceRequest.prototype, "userId", void 0);
__decorate([
    Column('text')
], ServiceRequest.prototype, "name", void 0);
__decorate([
    Column('text')
], ServiceRequest.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], ServiceRequest.prototype, "phone", void 0);
__decorate([
    Column('text', { nullable: true })
], ServiceRequest.prototype, "message", void 0);
__decorate([
    Column('text', { default: 'NEW' })
], ServiceRequest.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], ServiceRequest.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], ServiceRequest.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Service, (service) => service.requests, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'service_id' })
], ServiceRequest.prototype, "service", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.serviceRequests),
    JoinColumn({ name: 'user_id' })
], ServiceRequest.prototype, "user", void 0);
ServiceRequest = __decorate([
    Entity('service_requests')
], ServiceRequest);
export { ServiceRequest };
