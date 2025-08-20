#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { processSQLWithEnv } = require("./migration-processor");

// Importar configuração do banco
require("dotenv").config();
const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);

class MigrationRunner {
  async execute() {
    try {
      await this.tableMigrationsExists();

      console.log("🔄 Verificando migrações pendentes...");

      const migrationsPath = path.join(
        __dirname,
        "..",
        "src",
        "database",
        "migrations"
      );
      const files = fs
        .readdirSync(migrationsPath)
        .filter((file) => file.endsWith(".sql"));
      const filesWithoutExtension = files.map((file) =>
        file.replace(".sql", "")
      );

      let executedCount = 0;

      for (const file of filesWithoutExtension) {
        const migrationExists = await this.findByName(file);
        if (!migrationExists) {
          console.log(`� Executando migração: ${file}`);

          const sqlFilePath = path.join(migrationsPath, `${file}.sql`);
          const sqlContent = processSQLWithEnv(sqlFilePath);

          await db.query(sqlContent);
          await this.insert(file);

          console.log(`✅ Migração executada com sucesso: ${file}`);
          executedCount++;
        } else {
          console.log(`⏭️  Migração já executada: ${file}`);
        }
      }

      if (executedCount === 0) {
        console.log("🎉 Todas as migrações já foram executadas!");
      } else {
        console.log(
          `🎉 ${executedCount} migração(ões) executada(s) com sucesso!`
        );
      }
    } catch (error) {
      console.error("❌ Erro ao executar migrações:", error.message);
      process.exit(1);
    } finally {
      await db.$pool.end();
    }
  }

  async tableMigrationsExists() {
    const result = await db.oneOrNone(
      `SELECT to_regclass('public.migrations') as exists`
    );

    if (!result || !result.exists) {
      console.log("🔧 Criando tabela de migrações...");
      await db.query(`
        CREATE TABLE migrations
        (
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name TEXT NOT NULL,
          applied_at TIMESTAMP DEFAULT now()
        );
        CREATE INDEX idx_migrations_name ON migrations(name);
        COMMENT ON TABLE migrations IS 'Tabela para armazenar informações de migrações';
        COMMENT ON COLUMN migrations.id IS 'ID único da migração';
        COMMENT ON COLUMN migrations.name IS 'Nome da migração';
        COMMENT ON COLUMN migrations.applied_at IS 'Data e hora em que a migração foi aplicada';
      `);
      console.log("✅ Tabela de migrações criada com sucesso!");
    }
  }

  async findByName(name) {
    return db.oneOrNone("SELECT * FROM migrations WHERE name = $1 LIMIT 1", [
      name,
    ]);
  }

  async insert(name) {
    return db.none("INSERT INTO migrations (name) VALUES ($1)", [name]);
  }
}

// Executar migrações
const runner = new MigrationRunner();
runner.execute();
