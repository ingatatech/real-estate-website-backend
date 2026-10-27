var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Property } from './Property.js';
let Development = class Development {
    id;
    name;
    slug;
    description;
    location;
    developerName;
    status;
    completionDate;
    imageUrl;
    createdAt;
    updatedAt;
    properties;
};
__decorate([
    PrimaryColumn('text')
], Development.prototype, "id", void 0);
__decorate([
    Column('text')
], Development.prototype, "name", void 0);
__decorate([
    Column('text', { unique: true })
], Development.prototype, "slug", void 0);
__decorate([
    Column('text', { nullable: true })
], Development.prototype, "description", void 0);
__decorate([
    Column('text', { nullable: true })
], Development.prototype, "location", void 0);
__decorate([
    Column('text', { name: 'developer_name', nullable: true })
], Development.prototype, "developerName", void 0);
__decorate([
    Column('text', { nullable: true })
], Development.prototype, "status", void 0);
__decorate([
    Column('timestamp', { name: 'completion_date', nullable: true })
], Development.prototype, "completionDate", void 0);
__decorate([
    Column('text', { name: 'image_url', nullable: true })
], Development.prototype, "imageUrl", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Development.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Development.prototype, "updatedAt", void 0);
__decorate([
    OneToMany(() => Property, (property) => property.development)
], Development.prototype, "properties", void 0);
Development = __decorate([
    Entity('developments')
], Development);
export { Development };
