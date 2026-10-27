var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
let Faq = class Faq {
    id;
    question;
    answer;
    category;
    displayOrder;
    isActive;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryColumn('text')
], Faq.prototype, "id", void 0);
__decorate([
    Column('text')
], Faq.prototype, "question", void 0);
__decorate([
    Column('text')
], Faq.prototype, "answer", void 0);
__decorate([
    Column('text', { nullable: true })
], Faq.prototype, "category", void 0);
__decorate([
    Column('integer', { name: 'display_order', default: 0 })
], Faq.prototype, "displayOrder", void 0);
__decorate([
    Column('boolean', { name: 'is_active', default: true })
], Faq.prototype, "isActive", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Faq.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Faq.prototype, "updatedAt", void 0);
Faq = __decorate([
    Entity('faqs')
], Faq);
export { Faq };
