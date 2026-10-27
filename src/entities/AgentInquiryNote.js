var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
let AgentInquiryNote = class AgentInquiryNote {
    id;
    agentId;
    inquiryId;
    notes;
    nextFollowUpDate;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryColumn('text')
], AgentInquiryNote.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'agent_id' })
], AgentInquiryNote.prototype, "agentId", void 0);
__decorate([
    Column('text', { name: 'inquiry_id' })
], AgentInquiryNote.prototype, "inquiryId", void 0);
__decorate([
    Column('text', { default: '' })
], AgentInquiryNote.prototype, "notes", void 0);
__decorate([
    Column('timestamp', { name: 'next_follow_up_date', nullable: true })
], AgentInquiryNote.prototype, "nextFollowUpDate", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], AgentInquiryNote.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], AgentInquiryNote.prototype, "updatedAt", void 0);
AgentInquiryNote = __decorate([
    Entity('agent_inquiry_notes'),
    Unique(['agentId', 'inquiryId'])
], AgentInquiryNote);
export { AgentInquiryNote };
