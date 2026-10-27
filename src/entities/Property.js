var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { Agent } from './Agent.js';
import { PropertyCategory } from './PropertyCategory.js';
import { Development } from './Development.js';
import { PropertyFeatureLink } from './PropertyFeatureLink.js';
import { PropertyImage } from './PropertyImage.js';
import { Favorite } from './Favorite.js';
import { Inquiry } from './Inquiry.js';
import { ListingRequest } from './ListingRequest.js';
import { ValuationRequest } from './ValuationRequest.js';
import { ViewingRequest } from './ViewingRequest.js';
import { User } from './User.js';
import { PropertyView } from './PropertyView.js';
import { ClickEvent } from './ClickEvent.js';
let Property = class Property {
    id;
    propertyId;
    title;
    slug;
    description;
    categoryId;
    agentId;
    propertyManagerId;
    developmentId;
    propertyType;
    transactionType;
    price;
    currency;
    location;
    district;
    sector;
    address;
    latitude;
    longitude;
    size;
    sizeUnit;
    bedrooms;
    bathrooms;
    status;
    publicationStatus;
    isFeatured;
    isNewDevelopment;
    listedAt;
    createdAt;
    updatedAt;
    furnishingStatus;
    amenities;
    area;
    locationDescription;
    nearbyLandmarks;
    neighborhood;
    parking;
    agent;
    propertyManager;
    category;
    development;
    propertyFeatures;
    propertyImages;
    favorites;
    inquiries;
    listingRequests;
    valuationRequests;
    viewingRequests;
    propertyViews;
    clickEvents;
};
__decorate([
    PrimaryColumn('text')
], Property.prototype, "id", void 0);
__decorate([
    Column('text', { name: 'property_id', unique: true, nullable: true })
], Property.prototype, "propertyId", void 0);
__decorate([
    Column('text')
], Property.prototype, "title", void 0);
__decorate([
    Column('text', { unique: true })
], Property.prototype, "slug", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "description", void 0);
__decorate([
    Column('text', { name: 'category_id', nullable: true })
], Property.prototype, "categoryId", void 0);
__decorate([
    Column('text', { name: 'agent_id', nullable: true })
], Property.prototype, "agentId", void 0);
__decorate([
    Column('text', { name: 'property_manager_id', nullable: true })
], Property.prototype, "propertyManagerId", void 0);
__decorate([
    Column('text', { name: 'development_id', nullable: true })
], Property.prototype, "developmentId", void 0);
__decorate([
    Column('text', { name: 'property_type', default: 'RESIDENTIAL' })
], Property.prototype, "propertyType", void 0);
__decorate([
    Column('text', { name: 'transaction_type', default: 'SALE' })
], Property.prototype, "transactionType", void 0);
__decorate([
    Column('decimal', { nullable: true })
], Property.prototype, "price", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "currency", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "location", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "district", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "sector", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "address", void 0);
__decorate([
    Column('double precision', { nullable: true })
], Property.prototype, "latitude", void 0);
__decorate([
    Column('double precision', { nullable: true })
], Property.prototype, "longitude", void 0);
__decorate([
    Column('decimal', { nullable: true })
], Property.prototype, "size", void 0);
__decorate([
    Column('text', { name: 'size_unit', nullable: true })
], Property.prototype, "sizeUnit", void 0);
__decorate([
    Column('integer', { nullable: true })
], Property.prototype, "bedrooms", void 0);
__decorate([
    Column('integer', { nullable: true })
], Property.prototype, "bathrooms", void 0);
__decorate([
    Column('text', { default: 'AVAILABLE' })
], Property.prototype, "status", void 0);
__decorate([
    Column('text', { name: 'publication_status', default: 'PUBLISHED' })
], Property.prototype, "publicationStatus", void 0);
__decorate([
    Column('boolean', { name: 'is_featured', default: false })
], Property.prototype, "isFeatured", void 0);
__decorate([
    Column('boolean', { name: 'is_new_development', default: false })
], Property.prototype, "isNewDevelopment", void 0);
__decorate([
    Column('timestamp', { name: 'listed_at', nullable: true })
], Property.prototype, "listedAt", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' })
], Property.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' })
], Property.prototype, "updatedAt", void 0);
__decorate([
    Column('text', { name: 'furnishing_status', nullable: true })
], Property.prototype, "furnishingStatus", void 0);
__decorate([
    Column('text', { array: true, nullable: true, default: () => "'{}'" })
], Property.prototype, "amenities", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "area", void 0);
__decorate([
    Column('text', { name: 'location_description', nullable: true })
], Property.prototype, "locationDescription", void 0);
__decorate([
    Column('text', { name: 'nearby_landmarks', nullable: true })
], Property.prototype, "nearbyLandmarks", void 0);
__decorate([
    Column('text', { nullable: true })
], Property.prototype, "neighborhood", void 0);
__decorate([
    Column('integer', { nullable: true })
], Property.prototype, "parking", void 0);
__decorate([
    ManyToOne(() => Agent, (agent) => agent.properties),
    JoinColumn({ name: 'agent_id' })
], Property.prototype, "agent", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: 'property_manager_id' })
], Property.prototype, "propertyManager", void 0);
__decorate([
    ManyToOne(() => PropertyCategory, (category) => category.properties),
    JoinColumn({ name: 'category_id' })
], Property.prototype, "category", void 0);
__decorate([
    ManyToOne(() => Development, (development) => development.properties),
    JoinColumn({ name: 'development_id' })
], Property.prototype, "development", void 0);
__decorate([
    OneToMany(() => PropertyFeatureLink, (link) => link.property)
], Property.prototype, "propertyFeatures", void 0);
__decorate([
    OneToMany(() => PropertyImage, (image) => image.property)
], Property.prototype, "propertyImages", void 0);
__decorate([
    OneToMany(() => Favorite, (favorite) => favorite.property)
], Property.prototype, "favorites", void 0);
__decorate([
    OneToMany(() => Inquiry, (inquiry) => inquiry.property)
], Property.prototype, "inquiries", void 0);
__decorate([
    OneToMany(() => ListingRequest, (request) => request.property)
], Property.prototype, "listingRequests", void 0);
__decorate([
    OneToMany(() => ValuationRequest, (request) => request.property)
], Property.prototype, "valuationRequests", void 0);
__decorate([
    OneToMany(() => ViewingRequest, (request) => request.property)
], Property.prototype, "viewingRequests", void 0);
__decorate([
    OneToMany(() => PropertyView, (propertyView) => propertyView.property)
], Property.prototype, "propertyViews", void 0);
__decorate([
    OneToMany(() => ClickEvent, (clickEvent) => clickEvent.property)
], Property.prototype, "clickEvents", void 0);
Property = __decorate([
    Entity('properties')
], Property);
export { Property };
