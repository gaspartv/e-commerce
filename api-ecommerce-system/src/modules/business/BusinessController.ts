import { Request, Response } from "express";
import { BusinessService } from "./BusinessService";

export class BusinessController {
  protected businessService: BusinessService;

  constructor(businessService: BusinessService) {
    this.businessService = businessService;
  }

  create = async (req: Request, res: Response) => {
    const response = await this.businessService.create(req.body);
    return res.status(201).json(response);
  };

  update = async (req: Request, res: Response) => {
    const response = await this.businessService.update(req.body);
    return res.status(200).json(response);
  };

  get = async (req: Request, res: Response) => {
    const response = await this.businessService.get();
    return res.status(200).json(response);
  };
}
