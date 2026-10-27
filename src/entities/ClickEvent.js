var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, } from 'typeorm';
import { User } from './User.js';
import { Property } from './Property.js';
let ClickEvent = class ClickEvent {
    id;
    userId;
    sessionId;
    eventType;
    propertyId;
    elementId;
    elementText;
    pagePath;
    destinationUrl;
    deviceType;
    ipAddress;
    createdAt;
    user;
    property;
};
__decorate([
    PrimaryColumn('text')
], ClickEvent.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], ClickEvent.prototype, "userId", void 0);
__decorate([
    Column('text', { name: 'session_id', nullable: true })
], ClickEvent.prototype, "sessionId", void 0);
__decorate([
    Column('text', { name: 'event_type' })
], ClickEvent.prototype, "eventType", void 0);
__decorate([
    Column('text', { name: 'property_id', nullable: true })
], ClickEvent.prototype, "propertyId", void 0);
__decorate([
    Column('text', { name: 'element_id', nullable: true })
], ClickEvent.prototype, "elementId", void 0);
__decorate([
    Column('text', { name: 'element_text', nullable: true })
], ClickEvent.prototype, "elementText", void 0);
__decorate([
    Column('text', { name: 'page_path' })
], ClickEvent.prototype, "pagePath", void 0);
__decorate([
    Column('text', { name: 'destination_url', nullable: true })
], ClickEvent.prototype, "destinationUrl", void 0);
__decorate([
    Column('text', { name: 'device_type', nullable: true })
], ClickEvent.prototype, "deviceType", void 0);
__decorate([
    Column('text', { name: 'ip_address', nullable: true })
], ClickEvent.prototype, "ipAddress", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], ClickEvent.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.clickEvents, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'user_id' })
], ClickEvent.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.clickEvents, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'property_id' })
], ClickEvent.prototype, "property", void 0);
ClickEvent = __decorate([
    Entity('click_events'),
    Index(['userId']),
    Index(['eventType']),
    Index(['propertyId']),
    Index(['createdAt'])
], ClickEvent);
export { ClickEvent };
