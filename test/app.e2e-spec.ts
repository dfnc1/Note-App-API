import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { Note, User } from '../generated/prisma/client';

describe('App(e2e)', () => {
  let app: INestApplication<App>;
  let testService: TestService;
  let jwt_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication({
      logger: new ConsoleLogger({
        json: true,
        logLevels: ['log', 'debug', 'error'],
      }),
    });
    await app.init();

    testService = app.get(TestService);
  });

  describe('User Controller', () => {
    describe('POST /auth/register', () => {
      beforeEach(async (): Promise<void> => {
        await testService.deleteNote();
        await testService.deleteUser();
      });

      it('should cant register', async (): Promise<void> => {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: '',
            password: '',
          });

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.errors).toBeDefined();
      });

      it('should can register', async (): Promise<void> => {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'test@gmail',
            password: 'test',
          });

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.token_type).toBe('Bearer');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.access_token).toBeDefined();
      });
    });

    describe('POST /auth/login', () => {
      beforeEach(async () => {
        await testService.deleteNote();
        await testService.deleteUser();
        await testService.createUser();
      });
      it('should cant login', async (): Promise<void> => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: '',
            password: '',
          });

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.errors).toBeDefined();
      });

      it('should can login', async (): Promise<void> => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'test@gmail',
            password: 'test',
          });

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.token_type).toBe('Bearer');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.access_token).toBeDefined();
      });
    });
  });

  describe('Note Controller', () => {
    it('should can login', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@gmail',
          password: 'test',
        });

      expect(response.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.token_type).toBe('Bearer');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.access_token).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jwt_token = `Bearer ${response.body.access_token}`;
    });
    describe('POST /note', () => {
      it('should cant create note', async (): Promise<void> => {
        const user: User | null = await testService.getUser();
        const response = await request(app.getHttpServer())
          .post('/note')
          .set('Authorization', jwt_token)
          .send({
            title: '',
            content: '',
            user_id: user!.id + 1,
          });

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.errors).toBeDefined();
      });

      it('should can create note', async (): Promise<void> => {
        const user: User | null = await testService.getUser();
        const response = await request(app.getHttpServer())
          .post('/note')
          .set('Authorization', jwt_token)
          .send({
            title: 'test title',
            content: 'test content',
            user_id: user!.id,
          });

        expect(response.status).toBe(201);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.title).toBe('test title');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.content).toBe('test content');
      });
    });
    describe('GET /note/:noteId', () => {
      it('should cant get note', async (): Promise<void> => {
        const note: Note | null = await testService.getNote();
        const response = await request(app.getHttpServer())
          .get(`/note/${note!.id + 1}`)
          .set('Authorization', jwt_token);

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.errors).toBeDefined();
      });

      it('should can get note', async (): Promise<void> => {
        const note: Note | null = await testService.getNote();
        const response = await request(app.getHttpServer())
          .get(`/note/${note!.id}`)
          .set('Authorization', jwt_token);

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.title).toBe('test title');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.content).toBe('test content');
      });
    });
    describe('PATCH /note', () => {
      it('should cant update note', async (): Promise<void> => {
        const note: Note | null = await testService.getNote();
        const response = await request(app.getHttpServer())
          .patch('/note')
          .set('Authorization', jwt_token)
          .send({
            id: note!.id,
            title: '',
            content: '',
          });

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.errors).toBeDefined();
      });

      it('should can update note', async (): Promise<void> => {
        const note: Note | null = await testService.getNote();
        const response = await request(app.getHttpServer())
          .patch('/note')
          .set('Authorization', jwt_token)
          .send({
            id: note!.id,
            title: 'test title update',
            content: 'test content update',
          });

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.title).toBe('test title update');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.content).toBe('test content update');
      });
    });
    describe('GET /note/notes', () => {
      it('should can list note', async (): Promise<void> => {
        const response = await request(app.getHttpServer())
          .get('/note')
          .set('Authorization', jwt_token);

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.length).toBe(1);
      });
    });
    describe('DELETE /note', () => {
      it('should cant remove note', async (): Promise<void> => {
        const note: Note | null = await testService.getNote();
        const response = await request(app.getHttpServer())
          .delete(`/note/${note!.id + 1}`)
          .set('Authorization', jwt_token);

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.errors).toBeDefined();
      });

      it('should can remove note', async (): Promise<void> => {
        const note: Note | null = await testService.getNote();
        const response = await request(app.getHttpServer())
          .delete(`/note/${note!.id + 1}`)
          .set('Authorization', jwt_token);

        expect(response.status).toBe(204);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
