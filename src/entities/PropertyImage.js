var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, } from 'typeorm';
import { Property } from './Property.js';
let PropertyImage = class PropertyImage {
    id;
    propertyId;
    imageUrl;
    altText;
    displayOrder;
    isPrimary;
    createdAt;
    mediaType;
    property;
};
__decorate([
    PrimaryColumn('text')
], PropertyImage.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'property_id' })
], PropertyImage.prototype, "propertyId", void 0);
__decorate([
    Column('text', { name: 'image_url' })
], PropertyImage.prototype, "imageUrl", void 0);
__decorate([
    Column('text', { name: 'alt_text', nullable: true })
], PropertyImage.prototype, "altText", void 0);
__decorate([
    Column('integer', { name: 'display_order', default: 0 })
], PropertyImage.prototype, "displayOrder", void 0);
__decorate([
    Column('boolean', { name: 'is_primary', default: false })
], PropertyImage.prototype, "isPrimary", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], PropertyImage.prototype, "createdAt", void 0);
__decorate([
    Column('text', { name: 'media_type', default: 'IMAGE' })
], PropertyImage.prototype, "mediaType", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.propertyImages, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'property_id' })
], PropertyImage.prototype, "property", void 0);
PropertyImage = __decorate([
    Entity('property_images')
], PropertyImage);
export { PropertyImage };
