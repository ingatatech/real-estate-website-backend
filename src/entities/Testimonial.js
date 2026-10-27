var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
let Testimonial = class Testimonial {
    id;
    name;
    role;
    content;
    imageUrl;
    rating;
    isFeatured;
    isActive;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryColumn('text')
], Testimonial.prototype, "id", void 0);
__decorate([
    Column('text')
], Testimonial.prototype, "name", void 0);
__decorate([
    Column('text', { nullable: true })
], Testimonial.prototype, "role", void 0);
__decorate([
    Column('text')
], Testimonial.prototype, "content", void 0);
__decorate([
    Column('text', { name: 'image_url', nullable: true })
], Testimonial.prototype, "imageUrl", void 0);
__decorate([
    Column('integer', { default: 5 })
], Testimonial.prototype, "rating", void 0);
__decorate([
    Column('boolean', { name: 'is_featured', default: false })
], Testimonial.prototype, "isFeatured", void 0);
__decorate([
    Column('boolean', { name: 'is_active', default: true })
], Testimonial.prototype, "isActive", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Testimonial.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Testimonial.prototype, "updatedAt", void 0);
Testimonial = __decorate([
    Entity('testimonials')
], Testimonial);
export { Testimonial };
