import { Body, INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { CatalogModule } from "src/catalog/catalog.module";
import { CatalogService } from "src/catalog/catalog.service";
import { AppModule } from "src/app/app.module";

describe('CatalogController (e2e)', () => {
  let app: INestApplication;
  let catalogService: CatalogService;
  let jwtService: JwtService;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // CatalogModule,
        AppModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = app.get<JwtService>(JwtService);
    await app.init();

    const payload = { sub: 1, username: 'johndoe' };
    authToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/catalogs (GET)', () => {
    return request(app.getHttpServer())
      .get('/catalogs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        console.log({ body: res.body })
      })
  });
});