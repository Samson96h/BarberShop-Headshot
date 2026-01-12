import { Test, TestingModule } from '@nestjs/testing';
import { AdminAppController } from './admin-app.controller';
import { AdminAppService } from './admin-app.service';

describe('AdminAppController', () => {
  let adminAppController: AdminAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdminAppController],
      providers: [AdminAppService],
    }).compile();

    adminAppController = app.get<AdminAppController>(AdminAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(adminAppController.getHello()).toBe('Hello World!');
    });
  });
});
