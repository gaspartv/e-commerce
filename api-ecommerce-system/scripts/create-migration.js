const fs = require("fs");
const path = require("path");
const { getTemplateByType } = require("./migration-templates");

const migrationName = process.argv[2];

if (!migrationName) {
  console.error("❌ Erro: Nome da migração é obrigatório!");
  console.log("📝 Uso: npm run create:migration <nome-da-migracao>");
  console.log("📝 Exemplo: npm run create:migration v1_3_create_table_clients");
  process.exit(1);
}

const now = new Date();
const timestamp =
  now.getFullYear().toString() +
  (now.getMonth() + 1).toString().padStart(2, "0") +
  now.getDate().toString().padStart(2, "0") +
  now.getHours().toString().padStart(2, "0") +
  now.getMinutes().toString().padStart(2, "0") +
  now.getSeconds().toString().padStart(2, "0");

const fileName = `${timestamp}_${migrationName}${
  migrationName.endsWith(".sql") ? "" : ".sql"
}`;

const migrationsDir = path.join(
  __dirname,
  "..",
  "src",
  "database",
  "migrations"
);
const filePath = path.join(migrationsDir, fileName);

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const migrationTemplate = getTemplateByType(migrationName, timestamp, now);

try {
  fs.writeFileSync(filePath, migrationTemplate);
  console.log("✅ Migração criada com sucesso!");
  console.log(`📁 Arquivo: ${fileName}`);
  console.log(`📍 Local: ${filePath}`);
} catch (error) {
  console.error("❌ Erro ao criar arquivo de migração:", error.message);
  process.exit(1);
}
