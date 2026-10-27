var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Property } from './Property.js';
import { User } from './User.js';
let ListingRequest = class ListingRequest {
    id;
    propertyId;
    userId;
    name;
    email;
    phone;
    propertyType;
    transactionType;
    location;
    district;
    sector;
    propertySize;
    sizeUnit;
    bedrooms;
    bathrooms;
    description;
    price;
    status;
    images;
    createdAt;
    updatedAt;
    property;
    user;
};
__decorate([
    PrimaryColumn('text')
], ListingRequest.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'property_id', nullable: true })
], ListingRequest.prototype, "propertyId", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], ListingRequest.prototype, "userId", void 0);
__decorate([
    Column('text')
], ListingRequest.prototype, "name", void 0);
__decorate([
    Column('text')
], ListingRequest.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], ListingRequest.prototype, "phone", void 0);
__decorate([
    Column('text', { name: 'property_type', default: 'RESIDENTIAL' })
], ListingRequest.prototype, "propertyType", void 0);
__decorate([
    Column('text', { name: 'transaction_type', default: 'SALE' })
], ListingRequest.prototype, "transactionType", void 0);
__decorate([
    Column('text')
], ListingRequest.prototype, "location", void 0);
__decorate([
    Column('text', { nullable: true })
], ListingRequest.prototype, "district", void 0);
__decorate([
    Column('text', { nullable: true })
], ListingRequest.prototype, "sector", void 0);
__decorate([
    Column('decimal', { name: 'property_size', nullable: true })
], ListingRequest.prototype, "propertySize", void 0);
__decorate([
    Column('text', { name: 'size_unit', nullable: true })
], ListingRequest.prototype, "sizeUnit", void 0);
__decorate([
    Column('integer', { nullable: true })
], ListingRequest.prototype, "bedrooms", void 0);
__decorate([
    Column('integer', { nullable: true })
], ListingRequest.prototype, "bathrooms", void 0);
__decorate([
    Column('text', { nullable: true })
], ListingRequest.prototype, "description", void 0);
__decorate([
    Column('decimal', { nullable: true })
], ListingRequest.prototype, "price", void 0);
__decorate([
    Column('text', { default: 'SUBMITTED' })
], ListingRequest.prototype, "status", void 0);
__decorate([
    Column('jsonb', { default: () => "'[]'::jsonb" })
], ListingRequest.prototype, "images", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], ListingRequest.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], ListingRequest.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.listingRequests),
    JoinColumn({ name: 'property_id' })
], ListingRequest.prototype, "property", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.listingRequests),
    JoinColumn({ name: 'user_id' })
], ListingRequest.prototype, "user", void 0);
ListingRequest = __decorate([
    Entity('listing_requests')
], ListingRequest);
export { ListingRequest };
