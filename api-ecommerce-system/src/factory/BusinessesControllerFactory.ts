import { BusinessesRepository } from "../database/repositories/Businesses/BusinessesRepository";
import { BusinessController } from "../modules/business/BusinessController";
import { BusinessService } from "../modules/business/BusinessService";

export class BusinessesControllerFactory {
  static execute() {
    const businessesRepository = new BusinessesRepository();
    const businessService = new BusinessService(businessesRepository);
    return new BusinessController(businessService);
  }
}
