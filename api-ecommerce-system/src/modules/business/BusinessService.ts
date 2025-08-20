import { AppError } from "../../app.error";
import { BusinessesRepository } from "../../database/repositories/Businesses/BusinessesRepository";
import { BusinessesResponseDto } from "./interfaces/BusinessesResponseDto";
import { BusinessesUpdateDto } from "./interfaces/BusinessesUpdateDto";

export class BusinessService {
  protected businessesRepository: BusinessesRepository;

  constructor(businessesRepository: BusinessesRepository) {
    this.businessesRepository = businessesRepository;
  }

  async create(dto: BusinessesCreateDto): Promise<BusinessesResponseDto> {
    const businessExists = await this.businessesRepository.findByName(dto.name);
    if (businessExists) {
      throw new AppError("Empresa com este nome já existe.", 400);
    }

    return await this.businessesRepository.create(dto);
  }

  async update(dto: BusinessesUpdateDto): Promise<BusinessesResponseDto> {
    const business = await this.businessesRepository.update(dto);
    if (!business) {
      throw new AppError("Empresa não encontrada.", 404);
    }

    return business;
  }

  async get() {
    const businesses = await this.businessesRepository.get();
    return {
      page: 1,
      size: 10,
      total: businesses.length,
      sort: "created_at",
      order: "desc",
      has_more: false,
      prev_page: 1,
      next_page: 1,
      last_page: 1,
      column: [],
      data: businesses,
    };
  }
}
