var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Property } from './Property.js';
let PropertyCategory = class PropertyCategory {
    id;
    name;
    slug;
    description;
    isActive;
    createdAt;
    updatedAt;
    imageUrl;
    properties;
};
__decorate([
    PrimaryColumn('text')
], PropertyCategory.prototype, "id", void 0);
__decorate([
    Column('text', { unique: true })
], PropertyCategory.prototype, "name", void 0);
__decorate([
    Column('text', { unique: true })
], PropertyCategory.prototype, "slug", void 0);
__decorate([
    Column('text', { nullable: true })
], PropertyCategory.prototype, "description", void 0);
__decorate([
    Column('boolean', { name: 'is_active', default: true })
], PropertyCategory.prototype, "isActive", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], PropertyCategory.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], PropertyCategory.prototype, "updatedAt", void 0);
__decorate([
    Column('text', { name: 'image_url', nullable: true })
], PropertyCategory.prototype, "imageUrl", void 0);
__decorate([
    OneToMany(() => Property, (property) => property.category)
], PropertyCategory.prototype, "properties", void 0);
PropertyCategory = __decorate([
    Entity('property_categories')
], PropertyCategory);
export { PropertyCategory };
