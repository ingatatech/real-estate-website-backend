var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index, } from 'typeorm';
import { User } from './User.js';
let PropertySearch = class PropertySearch {
    id;
    userId;
    email;
    location;
    propertyType;
    transactionType;
    minPrice;
    maxPrice;
    minBedrooms;
    maxBedrooms;
    minBathrooms;
    maxBathrooms;
    minSize;
    maxSize;
    sizeUnit;
    availability;
    furnishingStatus;
    features;
    createdAt;
    updatedAt;
    user;
};
__decorate([
    PrimaryColumn('text')
], PropertySearch.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], PropertySearch.prototype, "userId", void 0);
__decorate([
    Column('text', { nullable: true })
], PropertySearch.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], PropertySearch.prototype, "location", void 0);
__decorate([
    Column('text', { name: 'property_type', nullable: true })
], PropertySearch.prototype, "propertyType", void 0);
__decorate([
    Column('text', { name: 'transaction_type', nullable: true })
], PropertySearch.prototype, "transactionType", void 0);
__decorate([
    Column('decimal', { name: 'min_price', nullable: true })
], PropertySearch.prototype, "minPrice", void 0);
__decorate([
    Column('decimal', { name: 'max_price', nullable: true })
], PropertySearch.prototype, "maxPrice", void 0);
__decorate([
    Column('integer', { name: 'min_bedrooms', nullable: true })
], PropertySearch.prototype, "minBedrooms", void 0);
__decorate([
    Column('integer', { name: 'max_bedrooms', nullable: true })
], PropertySearch.prototype, "maxBedrooms", void 0);
__decorate([
    Column('integer', { name: 'min_bathrooms', nullable: true })
], PropertySearch.prototype, "minBathrooms", void 0);
__decorate([
    Column('integer', { name: 'max_bathrooms', nullable: true })
], PropertySearch.prototype, "maxBathrooms", void 0);
__decorate([
    Column('decimal', { name: 'min_size', nullable: true })
], PropertySearch.prototype, "minSize", void 0);
__decorate([
    Column('decimal', { name: 'max_size', nullable: true })
], PropertySearch.prototype, "maxSize", void 0);
__decorate([
    Column('text', { name: 'size_unit', nullable: true })
], PropertySearch.prototype, "sizeUnit", void 0);
__decorate([
    Column('text', { nullable: true })
], PropertySearch.prototype, "availability", void 0);
__decorate([
    Column('text', { name: 'furnishing_status', nullable: true })
], PropertySearch.prototype, "furnishingStatus", void 0);
__decorate([
    Column('text', { array: true, default: () => "'{}'" })
], PropertySearch.prototype, "features", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], PropertySearch.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], PropertySearch.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.propertySearches, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' })
], PropertySearch.prototype, "user", void 0);
PropertySearch = __decorate([
    Entity('property_searches'),
    Index(['userId'])
], PropertySearch);
export { PropertySearch };
