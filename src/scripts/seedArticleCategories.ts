import 'reflect-metadata';
import AppDataSource from '../lib/typeorm.js';
import { ArticleCategory } from '../entities/ArticleCategory.js';

const categories = [
  { id: '1', name: 'Property Market Updates', slug: 'property-market-updates' },
  { id: '2', name: 'Buying Guides', slug: 'buying-guides' },
  { id: '3', name: 'Renting Guides', slug: 'renting-guides' },
  { id: '4', name: 'Selling Guides', slug: 'selling-guides' },
  { id: '5', name: 'Property Investment', slug: 'property-investment' },
  { id: '6', name: 'Property Management', slug: 'property-management' },
  { id: '7', name: 'Homeownership', slug: 'homeownership' },
  { id: '8', name: 'Real Estate Trends', slug: 'real-estate-trends' },
  { id: '9', name: 'Company Announcements', slug: 'company-announcements' },
  { id: '10', name: 'New Developments', slug: 'new-developments' },
];

try {
  await AppDataSource.initialize();
  const categoryRepo = AppDataSource.getRepository(ArticleCategory);

  for (const categoryData of categories) {
    let category = await categoryRepo.findOne({ where: { id: categoryData.id } });
    
    if (category) {
      // Update existing category
      category.name = categoryData.name;
      category.slug = categoryData.slug;
      category.isActive = true;
      await categoryRepo.save(category);
      console.log(`Updated category: ${categoryData.name}`);
    } else {
      // Create new category
      category = categoryRepo.create({
        ...categoryData,
        isActive: true,
      });
      await categoryRepo.save(category);
      console.log(`Created category: ${categoryData.name}`);
    }
  }

  console.log('Article categories seeded successfully!');
} catch (error) {
  console.error('Error seeding article categories:', error);
  process.exitCode = 1;
} finally {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
