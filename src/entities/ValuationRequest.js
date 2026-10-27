var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Property } from './Property.js';
import { User } from './User.js';
let ValuationRequest = class ValuationRequest {
    id;
    propertyId;
    userId;
    name;
    email;
    phone;
    propertyType;
    location;
    propertySize;
    bedrooms;
    bathrooms;
    description;
    estimatedValue;
    status;
    createdAt;
    updatedAt;
    property;
    user;
};
__decorate([
    PrimaryColumn('text')
], ValuationRequest.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'property_id', nullable: true })
], ValuationRequest.prototype, "propertyId", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], ValuationRequest.prototype, "userId", void 0);
__decorate([
    Column('text')
], ValuationRequest.prototype, "name", void 0);
__decorate([
    Column('text')
], ValuationRequest.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], ValuationRequest.prototype, "phone", void 0);
__decorate([
    Column('text', { name: 'property_type', default: 'RESIDENTIAL' })
], ValuationRequest.prototype, "propertyType", void 0);
__decorate([
    Column('text')
], ValuationRequest.prototype, "location", void 0);
__decorate([
    Column('decimal', { name: 'property_size', nullable: true })
], ValuationRequest.prototype, "propertySize", void 0);
__decorate([
    Column('integer', { nullable: true })
], ValuationRequest.prototype, "bedrooms", void 0);
__decorate([
    Column('integer', { nullable: true })
], ValuationRequest.prototype, "bathrooms", void 0);
__decorate([
    Column('text', { nullable: true })
], ValuationRequest.prototype, "description", void 0);
__decorate([
    Column('decimal', { name: 'estimated_value', nullable: true })
], ValuationRequest.prototype, "estimatedValue", void 0);
__decorate([
    Column('text', { default: 'NEW' })
], ValuationRequest.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], ValuationRequest.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], ValuationRequest.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.valuationRequests),
    JoinColumn({ name: 'property_id' })
], ValuationRequest.prototype, "property", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.valuationRequests),
    JoinColumn({ name: 'user_id' })
], ValuationRequest.prototype, "user", void 0);
ValuationRequest = __decorate([
    Entity('valuation_requests')
], ValuationRequest);
export { ValuationRequest };
