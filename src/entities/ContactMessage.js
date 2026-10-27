var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { User } from './User.js';
let ContactMessage = class ContactMessage {
    id;
    name;
    email;
    phone;
    subject;
    message;
    status;
    createdAt;
    updatedAt;
    userId;
    user;
};
__decorate([
    PrimaryColumn('text')
], ContactMessage.prototype, "id", void 0);
__decorate([
    Column('text')
], ContactMessage.prototype, "name", void 0);
__decorate([
    Column('text')
], ContactMessage.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], ContactMessage.prototype, "phone", void 0);
__decorate([
    Column('text', { nullable: true })
], ContactMessage.prototype, "subject", void 0);
__decorate([
    Column('text')
], ContactMessage.prototype, "message", void 0);
__decorate([
    Column('text', { default: 'NEW' })
], ContactMessage.prototype, "status", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], ContactMessage.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], ContactMessage.prototype, "updatedAt", void 0);
__decorate([
    Column('text', { name: 'user_id', nullable: true })
], ContactMessage.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.contactMessages),
    JoinColumn({ name: 'user_id' })
], ContactMessage.prototype, "user", void 0);
ContactMessage = __decorate([
    Entity('contact_messages')
], ContactMessage);
export { ContactMessage };
