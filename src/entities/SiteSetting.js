var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
let SiteSetting = class SiteSetting {
    id;
    siteName;
    logoUrl;
    faviconUrl;
    email;
    phone;
    address;
    facebookUrl;
    instagramUrl;
    xUrl;
    linkedinUrl;
    defaultCurrency;
    createdAt;
    updatedAt;
    aboutCtaLink;
    aboutCtaText;
    aboutDescription;
    aboutImageUrl;
    aboutTitle;
    featuredSectionTitle;
    heroCtaLink;
    heroCtaText;
    heroImageUrl;
    heroSubtitle;
    heroTitle;
    servicesDescription;
    servicesTitle;
    showAboutSection;
    showFeaturedSection;
    showServicesSection;
    whatsapp;
    analyticsRetentionDays;
};
__decorate([
    PrimaryColumn('text')
], SiteSetting.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'site_name', nullable: true })
], SiteSetting.prototype, "siteName", void 0);
__decorate([
    Column('text', { name: 'logo_url', nullable: true })
], SiteSetting.prototype, "logoUrl", void 0);
__decorate([
    Column('text', { name: 'favicon_url', nullable: true })
], SiteSetting.prototype, "faviconUrl", void 0);
__decorate([
    Column('text', { nullable: true })
], SiteSetting.prototype, "email", void 0);
__decorate([
    Column('text', { nullable: true })
], SiteSetting.prototype, "phone", void 0);
__decorate([
    Column('text', { nullable: true })
], SiteSetting.prototype, "address", void 0);
__decorate([
    Column('text', { name: 'facebook_url', nullable: true })
], SiteSetting.prototype, "facebookUrl", void 0);
__decorate([
    Column('text', { name: 'instagram_url', nullable: true })
], SiteSetting.prototype, "instagramUrl", void 0);
__decorate([
    Column('text', { name: 'x_url', nullable: true })
], SiteSetting.prototype, "xUrl", void 0);
__decorate([
    Column('text', { name: 'linkedin_url', nullable: true })
], SiteSetting.prototype, "linkedinUrl", void 0);
__decorate([
    Column('text', { name: 'default_currency', nullable: true })
], SiteSetting.prototype, "defaultCurrency", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], SiteSetting.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], SiteSetting.prototype, "updatedAt", void 0);
__decorate([
    Column('text', { name: 'about_cta_link', nullable: true })
], SiteSetting.prototype, "aboutCtaLink", void 0);
__decorate([
    Column('text', { name: 'about_cta_text', nullable: true })
], SiteSetting.prototype, "aboutCtaText", void 0);
__decorate([
    Column('text', { name: 'about_description', nullable: true })
], SiteSetting.prototype, "aboutDescription", void 0);
__decorate([
    Column('text', { name: 'about_image_url', nullable: true })
], SiteSetting.prototype, "aboutImageUrl", void 0);
__decorate([
    Column('text', { name: 'about_title', nullable: true })
], SiteSetting.prototype, "aboutTitle", void 0);
__decorate([
    Column('text', { name: 'featured_section_title', nullable: true })
], SiteSetting.prototype, "featuredSectionTitle", void 0);
__decorate([
    Column('text', { name: 'hero_cta_link', nullable: true })
], SiteSetting.prototype, "heroCtaLink", void 0);
__decorate([
    Column('text', { name: 'hero_cta_text', nullable: true })
], SiteSetting.prototype, "heroCtaText", void 0);
__decorate([
    Column('text', { name: 'hero_image_url', nullable: true })
], SiteSetting.prototype, "heroImageUrl", void 0);
__decorate([
    Column('text', { name: 'hero_subtitle', nullable: true })
], SiteSetting.prototype, "heroSubtitle", void 0);
__decorate([
    Column('text', { name: 'hero_title', nullable: true })
], SiteSetting.prototype, "heroTitle", void 0);
__decorate([
    Column('text', { name: 'services_description', nullable: true })
], SiteSetting.prototype, "servicesDescription", void 0);
__decorate([
    Column('text', { name: 'services_title', nullable: true })
], SiteSetting.prototype, "servicesTitle", void 0);
__decorate([
    Column('boolean', { name: 'show_about_section', default: false })
], SiteSetting.prototype, "showAboutSection", void 0);
__decorate([
    Column('boolean', { name: 'show_featured_section', default: false })
], SiteSetting.prototype, "showFeaturedSection", void 0);
__decorate([
    Column('boolean', { name: 'show_services_section', default: false })
], SiteSetting.prototype, "showServicesSection", void 0);
__decorate([
    Column('text', { nullable: true })
], SiteSetting.prototype, "whatsapp", void 0);
__decorate([
    Column('integer', { name: 'analytics_retention_days', default: 365 })
], SiteSetting.prototype, "analyticsRetentionDays", void 0);
SiteSetting = __decorate([
    Entity('site_settings')
], SiteSetting);
export { SiteSetting };
