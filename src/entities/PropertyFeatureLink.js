var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './Property.js';
import { PropertyFeature } from './PropertyFeature.js';
let PropertyFeatureLink = class PropertyFeatureLink {
    propertyId;
    featureId;
    property;
    feature;
};
__decorate([
    PrimaryColumn('text', { name: 'property_id' })
], PropertyFeatureLink.prototype, "propertyId", void 0);
__decorate([
    PrimaryColumn('text', { name: 'feature_id' })
], PropertyFeatureLink.prototype, "featureId", void 0);
__decorate([
    ManyToOne(() => Property, (property) => property.propertyFeatures, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'property_id' })
], PropertyFeatureLink.prototype, "property", void 0);
__decorate([
    ManyToOne(() => PropertyFeature, (feature) => feature.properties, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'feature_id' })
], PropertyFeatureLink.prototype, "feature", void 0);
PropertyFeatureLink = __decorate([
    Entity('property_feature_links')
], PropertyFeatureLink);
export { PropertyFeatureLink };
