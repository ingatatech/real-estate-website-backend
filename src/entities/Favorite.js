var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, } from 'typeorm';
import { Property } from './Property.js';
import { User } from './User.js';
let Favorite = class Favorite {
    id;
    userId;
    propertyId;
    createdAt;
    property;
    user;
};
__decorate([
    PrimaryColumn('text')
], Favorite.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'user_id' })
], Favorite.prototype, "userId", void 0);
__decorate([
    Column('text', { name: 'property_id' })
], Favorite.prototype, "propertyId", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Favorite.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.favorites, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'property_id' })
], Favorite.prototype, "property", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' })
], Favorite.prototype, "user", void 0);
Favorite = __decorate([
    Entity('favorites'),
    Index(['userId', 'propertyId'], { unique: true })
], Favorite);
export { Favorite };
