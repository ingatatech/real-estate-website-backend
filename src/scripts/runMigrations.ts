import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { getDirectDatabaseUrl } from '../config/database.js';
import { TextIdSubscriber } from '../lib/TextIdSubscriber.js';
import { User } from '../entities/User.js';
import { Role } from '../entities/Role.js';
import { Agent } from '../entities/Agent.js';
import { Property } from '../entities/Property.js';
import { PropertyCategory } from '../entities/PropertyCategory.js';
import { PropertyFeature } from '../entities/PropertyFeature.js';
import { PropertyFeatureLink } from '../entities/PropertyFeatureLink.js';
import { PropertyImage } from '../entities/PropertyImage.js';
import { Article } from '../entities/Article.js';
import { ArticleCategory } from '../entities/ArticleCategory.js';
import { ContactMessage } from '../entities/ContactMessage.js';
import { Development } from '../entities/Development.js';
import { Faq } from '../entities/Faq.js';
import { Favorite } from '../entities/Favorite.js';
import { Inquiry } from '../entities/Inquiry.js';
import { ListingRequest } from '../entities/ListingRequest.js';
import { PropertySearch } from '../entities/PropertySearch.js';
import { Service } from '../entities/Service.js';
import { ServiceRequest } from '../entities/ServiceRequest.js';
import { SitePage } from '../entities/SitePage.js';
import { SiteSetting } from '../entities/SiteSetting.js';
import { Testimonial } from '../entities/Testimonial.js';
import { ValuationRequest } from '../entities/ValuationRequest.js';
import { ViewingRequest } from '../entities/ViewingRequest.js';
import { PageView } from '../entities/PageView.js';
import { PropertyView } from '../entities/PropertyView.js';
import { ClickEvent } from '../entities/ClickEvent.js';
import { AgentInquiryNote } from '../entities/AgentInquiryNote.js';

// Use direct (unpooled) connection for migrations
const databaseUrl = getDirectDatabaseUrl();

const migrationDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  synchronize: false,
  logging: true,
  entities: [
    User,
    Role,
    Agent,
    Property,
    PropertyCategory,
    PropertyFeature,
    PropertyFeatureLink,
    PropertyImage,
    Article,
    ArticleCategory,
    ContactMessage,
    Development,
    Faq,
    Favorite,
    Inquiry,
    ListingRequest,
    PropertySearch,
    Service,
    ServiceRequest,
    SitePage,
    SiteSetting,
    Testimonial,
    ValuationRequest,
    ViewingRequest,
    PageView,
    PropertyView,
    ClickEvent,
    AgentInquiryNote,
  ],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: [TextIdSubscriber],
});

try {
  await migrationDataSource.initialize();
  const migrations = await migrationDataSource.runMigrations();
  console.log(`Applied ${migrations.length} database migration(s).`);
} catch (error) {
  console.error('Database migration failed:', error);
  process.exitCode = 1;
} finally {
  if (migrationDataSource.isInitialized) {
    await migrationDataSource.destroy();
  }
}
