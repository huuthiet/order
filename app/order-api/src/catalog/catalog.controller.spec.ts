import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { BadRequestException } from '@nestjs/common';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        CatalogService,
        {
          provide: CatalogService,
          useValue: {
            createCatalog: jest.fn(),
            getAllCatalogs: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('createCatalog', () => {
  //   it('should return bad request exception when catalog existed', async () => {
  //     expect(controller.createCatalog).rejects.toThrow(BadRequestException);
  //   });
  // });
})