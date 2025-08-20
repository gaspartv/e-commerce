export class BusinessesResponseDto {
  "id": string;
  "code": string;
  "created_at": Date;
  "updated_at": Date;
  "deleted_at": Date | null;
  "disabled": boolean;
  "name": string;
  "permissions": string[];
}
