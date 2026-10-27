var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { PropertyFeatureLink } from './PropertyFeatureLink.js';
let PropertyFeature = class PropertyFeature {
    id;
    name;
    slug;
    createdAt;
    properties;
};
__decorate([
    PrimaryColumn('text')
], PropertyFeature.prototype, "id", void 0);
__decorate([
    Column('text', { unique: true })
], PropertyFeature.prototype, "name", void 0);
__decorate([
    Column('text', { unique: true })
], PropertyFeature.prototype, "slug", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], PropertyFeature.prototype, "createdAt", void 0);
__decorate([
    OneToMany(() => PropertyFeatureLink, (link) => link.feature)
], PropertyFeature.prototype, "properties", void 0);
PropertyFeature = __decorate([
    Entity('property_features')
], PropertyFeature);
export { PropertyFeature };
