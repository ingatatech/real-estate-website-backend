import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { AppDataSource } from '../lib/typeorm.js';
import { Article } from '../entities/Article.js';
import { ArticleCategory } from '../entities/ArticleCategory.js';

export const getArticles = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const categoryRepo = AppDataSource.getRepository(ArticleCategory);

    const qb = articleRepo.createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.author', 'author')
      .orderBy('article.publishedAt', 'DESC');

    if (typeof req.query.category === 'string') {
      const category = await categoryRepo.findOne({ where: { slug: req.query.category } });
      if (category) {
        qb.andWhere('article.categoryId = :categoryId', { categoryId: category.id });
      }
    }

    if (typeof req.query.status === 'string') {
      qb.andWhere('article.publicationStatus = :status', { status: req.query.status });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    qb.skip((page - 1) * limit).take(limit);

    const [articles, total] = await qb.getManyAndCount();

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    next(error);
  }
};

export const getArticleBySlug = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({
      where: { slug: String(req.params.slug) },
      relations: { category: true, author: true },
    });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    return res.json({ success: true, data: article });
  } catch (error) { return next(error); }
};

export const getArticleById = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({
      where: { id: String(req.params.id) },
      relations: { category: true, author: true },
    });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    return res.json({ success: true, data: article });
  } catch (error) { return next(error); }
};

export const createArticle = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const categoryRepo = AppDataSource.getRepository(ArticleCategory);
    const { title, slug, excerpt, content, featuredImage, categoryId, authorId, publicationStatus = 'DRAFT' } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, message: 'Title, slug, and content are required' });
    }

    if (categoryId) {
      const category = await categoryRepo.findOne({ where: { id: String(categoryId), isActive: true } });
      if (!category) return res.status(400).json({ success: false, message: 'The selected article category is unavailable' });
    }

    // Check for duplicate slug
    const existingArticle = await articleRepo.findOne({ where: { slug } });
    if (existingArticle) {
      return res.status(409).json({ success: false, message: 'An article with this slug already exists' });
    }

    const article = articleRepo.create({
      id: randomUUID(),
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      featuredImage: featuredImage || undefined,
      categoryId: categoryId || undefined,
      authorId: authorId || undefined,
      publicationStatus,
      publishedAt: publicationStatus === 'PUBLISHED' ? new Date() : undefined,
    });
    const savedArticle = await articleRepo.save(article);
    res.status(201).json({ success: true, data: savedArticle });
  } catch (error) { next(error); }
};

export const replaceArticle = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({ where: { id: String(req.params.id) } });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    Object.assign(article, req.body);
    const updatedArticle = await articleRepo.save(article);
    res.json({ success: true, data: updatedArticle });
  } catch (error) { next(error); }
};

export const updateArticle = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({ where: { id: String(req.params.id) } });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    Object.assign(article, req.body);
    const updatedArticle = await articleRepo.save(article);
    res.json({ success: true, data: updatedArticle });
  } catch (error) { next(error); }
};

export const deleteArticle = async (req: Request, res: Response, next: (error: unknown) => void) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const article = await articleRepo.findOne({ where: { id: String(req.params.id) } });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    await articleRepo.remove(article);
    res.status(204).send();
  } catch (error) { next(error); }
};
