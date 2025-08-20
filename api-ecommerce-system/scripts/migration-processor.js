const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Processa um arquivo SQL substituindo variáveis do .env
 * @param {string} sqlFilePath - Caminho para o arquivo SQL
 * @returns {string} - SQL processado com variáveis substituídas
 */
function processSQLWithEnv(sqlFilePath) {
  if (!fs.existsSync(sqlFilePath)) {
    throw new Error(`Arquivo SQL não encontrado: ${sqlFilePath}`);
  }

  let sqlContent = fs.readFileSync(sqlFilePath, "utf-8");

  // Substitui variáveis no formato ${NOME_VARIAVEL} pelos valores do .env
  sqlContent = sqlContent.replace(/\$\{([^}]+)\}/g, (match, variableName) => {
    const envValue = process.env[variableName];
    if (envValue === undefined) {
      console.warn(`⚠️  Variável de ambiente não encontrada: ${variableName}`);
      return match; // Mantém o placeholder se a variável não existir
    }
    return envValue;
  });

  return sqlContent;
}

/**
 * Executa uma migração SQL processando variáveis de ambiente
 * @param {string} migrationName - Nome do arquivo de migração (sem extensão)
 */
function runMigrationWithEnv(migrationName) {
  const migrationsDir = path.join(
    __dirname,
    "..",
    "src",
    "database",
    "migrations"
  );
  const sqlFile = path.join(migrationsDir, `${migrationName}.sql`);

  try {
    const processedSQL = processSQLWithEnv(sqlFile);

    // Aqui você pode integrar com seu sistema de banco de dados
    // Por enquanto, vamos apenas mostrar o SQL processado
    console.log("🔄 SQL Processado:");
    console.log("=".repeat(50));
    console.log(processedSQL);
    console.log("=".repeat(50));

    return processedSQL;
  } catch (error) {
    console.error("❌ Erro ao processar migração:", error.message);
    process.exit(1);
  }
}

module.exports = { processSQLWithEnv, runMigrationWithEnv };
