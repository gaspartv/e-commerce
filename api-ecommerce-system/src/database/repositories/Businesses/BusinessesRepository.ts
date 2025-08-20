import cuid from "cuid";
import { BusinessesUpdateDto } from "../../../modules/business/interfaces/BusinessesUpdateDto";
import { CodeGeneratorUtil } from "../../../utils/code-generator.util";
import db from "../../db";

export class BusinessesRepository {
  findByName(name: string) {
    return db.oneOrNone("SELECT * FROM businesses WHERE name = $1", [name]);
  }

  create(dto: BusinessesCreateDto) {
    return db.one(
      `INSERT INTO businesses (id, code, created_at, updated_at, deleted_at, disabled, name)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
      [
        cuid(),
        CodeGeneratorUtil.execute(),
        new Date(),
        new Date(),
        null,
        false,
        dto.name,
      ]
    );
  }

  update(dto: BusinessesUpdateDto) {
    const deletedAt = dto.deleted ? new Date() : null;
    return db.one(
      `UPDATE businesses SET name = $1, deleted_at = $2, disabled = $3 WHERE id = $4 RETURNING *`,
      [dto.name, deletedAt, dto.disabled, dto.id]
    );
  }
}
