var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { ServiceRequest } from './ServiceRequest.js';
let Service = class Service {
    id;
    name;
    slug;
    shortDescription;
    description;
    imageUrl;
    isActive;
    displayOrder;
    createdAt;
    updatedAt;
    requests;
};
__decorate([
    PrimaryColumn('text')
], Service.prototype, "id", void 0);
__decorate([
    Column('text')
], Service.prototype, "name", void 0);
__decorate([
    Column('text', { unique: true })
], Service.prototype, "slug", void 0);
__decorate([
    Column('text', { name: 'short_description', nullable: true })
], Service.prototype, "shortDescription", void 0);
__decorate([
    Column('text', { nullable: true })
], Service.prototype, "description", void 0);
__decorate([
    Column('text', { name: 'image_url', nullable: true })
], Service.prototype, "imageUrl", void 0);
__decorate([
    Column('boolean', { name: 'is_active', default: true })
], Service.prototype, "isActive", void 0);
__decorate([
    Column('integer', { name: 'display_order', default: 0 })
], Service.prototype, "displayOrder", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Service.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Service.prototype, "updatedAt", void 0);
__decorate([
    OneToMany(() => ServiceRequest, (request) => request.service)
], Service.prototype, "requests", void 0);
Service = __decorate([
    Entity('services')
], Service);
export { Service };
