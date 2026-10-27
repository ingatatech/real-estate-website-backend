var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, } from 'typeorm';
import { User } from './User.js';
import { Property } from './Property.js';
let PropertyView = class PropertyView {
    id;
    userId;
    sessionId;
    propertyId;
    sessionDurationSeconds;
    referrer;
    deviceType;
    ipAddress;
    createdAt;
    user;
    property;
};
__decorate([
    PrimaryColumn('text')
], PropertyView.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], PropertyView.prototype, "userId", void 0);
__decorate([
    Column('text', { name: 'session_id', nullable: true })
], PropertyView.prototype, "sessionId", void 0);
__decorate([
    Column('text', { name: 'property_id' })
], PropertyView.prototype, "propertyId", void 0);
__decorate([
    Column('text', { name: 'session_duration_seconds', nullable: true })
], PropertyView.prototype, "sessionDurationSeconds", void 0);
__decorate([
    Column('text', { name: 'referrer', nullable: true })
], PropertyView.prototype, "referrer", void 0);
__decorate([
    Column('text', { name: 'device_type', nullable: true })
], PropertyView.prototype, "deviceType", void 0);
__decorate([
    Column('text', { name: 'ip_address', nullable: true })
], PropertyView.prototype, "ipAddress", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], PropertyView.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.propertyViews, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'user_id' })
], PropertyView.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.propertyViews, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'property_id' })
], PropertyView.prototype, "property", void 0);
PropertyView = __decorate([
    Entity('property_views'),
    Index(['userId']),
    Index(['propertyId']),
    Index(['createdAt'])
], PropertyView);
export { PropertyView };
