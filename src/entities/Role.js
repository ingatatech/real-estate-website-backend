var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User.js';
let Role = class Role {
    id;
    name;
    description;
    users;
};
__decorate([
    PrimaryGeneratedColumn('increment')
], Role.prototype, "id", void 0);
__decorate([
    Column('text', { unique: true })
], Role.prototype, "name", void 0);
__decorate([
    Column('text', { nullable: true })
], Role.prototype, "description", void 0);
__decorate([
    OneToMany(() => User, (user) => user.role)
], Role.prototype, "users", void 0);
Role = __decorate([
    Entity('roles')
], Role);
export { Role };
