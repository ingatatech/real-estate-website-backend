import request from 'supertest';
import app from '../app';

describe.skip('Article Controller', () => {
  describe('updateArticle', () => {
    it('should allow updating article with hardcoded category ID', async () => {
      // This test would require authentication and a test database
      // Skipping for now as it requires full test setup
      const response = await request(app)
        .patch('/api/v1/admin/articles/test-id')
        .send({
          title: 'Test Article',
          categoryId: '6', // Hardcoded category ID
        });

      // Should not return 500 error
      expect(response.status).not.toBe(500);
    });
  });
});
