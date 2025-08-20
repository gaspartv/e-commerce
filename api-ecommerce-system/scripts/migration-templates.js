/**
 * Gera templates de migração SQL baseado no tipo de operação
 */
function getTemplateByType(migrationName, timestamp, now) {
  const name = migrationName.toLowerCase();

  if (name.includes("create_table") || name.includes("create-table")) {
    const tableName =
      extractTableName(name, "create_table") ||
      extractTableName(name, "create-table") ||
      "users";
    return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}
-- Type: CREATE TABLE

-- Criar tabela ${tableName}
CREATE TABLE ${tableName} (
  id CHAR(25) PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  disabled BOOLEAN DEFAULT false
);

-- Criar índices
CREATE INDEX idx_${tableName}_code ON ${tableName}(code);

-- Comentários na tabela
COMMENT ON TABLE ${tableName} IS 'Tabela para armazenar informações de ${tableName}';

COMMENT ON COLUMN ${tableName}.id IS 'ID único da ${tableName}';
COMMENT ON COLUMN ${tableName}.code IS 'Código único da ${tableName}';
COMMENT ON COLUMN ${tableName}.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN ${tableName}.updated_at IS 'Data da última atualização do registro';
COMMENT ON COLUMN ${tableName}.deleted_at IS 'Data de exclusão lógica do registro';
COMMENT ON COLUMN ${tableName}.disabled IS 'Indica se a ${tableName} está desativada';
`;
  }

  if (
    name.includes("update_table") ||
    name.includes("update-table") ||
    name.includes("alter_table") ||
    name.includes("alter-table")
  ) {
    const tableName =
      extractTableName(name, "update_table") ||
      extractTableName(name, "alter_table") ||
      "users";
    return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}
-- Type: ALTER/UPDATE TABLE

-- Adicionar novas colunas à tabela ${tableName}
ALTER TABLE ${tableName} 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address TEXT,
ADD COLUMN birth_date DATE;

-- Modificar coluna existente
ALTER TABLE ${tableName} ALTER COLUMN name TYPE VARCHAR(300);

-- Adicionar constraint
ALTER TABLE ${tableName} ADD CONSTRAINT chk_${tableName}_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

-- Atualizar dados existentes
UPDATE ${tableName} 
SET active = true, updated_at = CURRENT_TIMESTAMP
WHERE created_at < CURRENT_DATE - INTERVAL '30 days';

-- Criar novo índice
CREATE INDEX idx_${tableName}_phone ON ${tableName}(phone);
`;
  }

  if (
    name.includes("drop_table") ||
    name.includes("drop-table") ||
    name.includes("delete_table") ||
    name.includes("delete-table")
  ) {
    const tableName =
      extractTableName(name, "drop_table") ||
      extractTableName(name, "delete_table") ||
      "old_table";
    return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}
-- Type: DROP TABLE

-- ATENÇÃO: Esta operação remove a tabela permanentemente!

-- 1. Fazer backup da tabela (opcional)
CREATE TABLE backup_${tableName}_${timestamp} AS 
SELECT * FROM ${tableName};

-- 2. Remover constraints/índices dependentes (se necessário)
-- DROP INDEX IF EXISTS idx_${tableName}_email;
-- ALTER TABLE outras_tabelas DROP CONSTRAINT fk_${tableName};

-- 3. Remover a tabela
DROP TABLE IF EXISTS ${tableName} CASCADE;

-- Para reverter (rollback):
-- ALTER TABLE backup_${tableName}_${timestamp} RENAME TO ${tableName};
`;
  }

  if (name.includes("insert") || name.includes("seed")) {
    const tableName =
      extractTableName(name, "insert") ||
      extractTableName(name, "seed") ||
      "users";
    return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}
-- Type: INSERT/SEED DATA

-- Inserir dados na tabela ${tableName}
INSERT INTO ${tableName} (name, email, active) VALUES
('Admin User', 'admin@example.com', true),
('Test User', 'test@example.com', true),
('Demo User', 'demo@example.com', false);

-- Inserir com verificação de conflito (PostgreSQL)
INSERT INTO ${tableName} (id, name, email) VALUES
(1, 'Sistema Admin', 'admin@sistema.com')
ON CONFLICT (email) DO UPDATE SET
name = EXCLUDED.name,
updated_at = CURRENT_TIMESTAMP;

-- Inserir dados condicionalmente
INSERT INTO ${tableName} (name, email, active)
SELECT 'Default User', 'default@example.com', true
WHERE NOT EXISTS (
  SELECT 1 FROM ${tableName} WHERE email = 'default@example.com'
);
`;
  }

  if (name.includes("update") && !name.includes("table")) {
    const tableName = extractTableName(name, "update") || "users";
    return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}
-- Type: UPDATE DATA

-- Atualizar registros na tabela ${tableName}
UPDATE ${tableName} 
SET 
  active = true,
  updated_at = CURRENT_TIMESTAMP
WHERE created_at < CURRENT_DATE - INTERVAL '7 days';

-- Atualizar com JOIN (exemplo complexo)
UPDATE ${tableName} u
SET status = 'verified'
FROM verificacoes v
WHERE u.id = v.user_id 
AND v.verified = true;

-- Atualizar com condições múltiplas
UPDATE ${tableName}
SET 
  name = CASE 
    WHEN name IS NULL THEN 'Nome não informado'
    ELSE TRIM(name)
  END,
  email = LOWER(email)
WHERE active = true;
`;
  }

  if (name.includes("delete") && !name.includes("table")) {
    const tableName = extractTableName(name, "delete") || "users";
    return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}
-- Type: DELETE DATA

-- CUIDADO: Operação de exclusão de dados

-- Soft delete (recomendado)
UPDATE ${tableName} 
SET 
  deleted_at = CURRENT_TIMESTAMP,
  active = false
WHERE condition = 'value';

-- Hard delete (permanente)
-- DELETE FROM ${tableName} 
-- WHERE created_at < CURRENT_DATE - INTERVAL '1 year'
-- AND active = false;

-- Delete com backup
-- CREATE TEMP TABLE deleted_${tableName} AS 
-- SELECT * FROM ${tableName} WHERE condition = 'value';
-- DELETE FROM ${tableName} WHERE condition = 'value';
`;
  }

  if (name.includes("add_column") || name.includes("add-column")) {
    const tableName =
      extractTableName(name, "add_column") ||
      extractTableName(name, "add-column") ||
      "users";
    return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}
-- Type: ADD COLUMN

-- Adicionar colunas à tabela ${tableName}
ALTER TABLE ${tableName}
ADD COLUMN new_column VARCHAR(255),
ADD COLUMN another_column INTEGER DEFAULT 0,
ADD COLUMN status_column BOOLEAN DEFAULT true;

-- Adicionar coluna com constraint
ALTER TABLE ${tableName}
ADD COLUMN email_verified BOOLEAN DEFAULT false,
ADD CONSTRAINT chk_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

-- Criar índice para nova coluna
CREATE INDEX idx_${tableName}_status ON ${tableName}(status_column);
`;
  }

  // Template padrão para outros casos
  return `-- Migration: ${migrationName}
-- Created: ${now.toISOString()}
-- Timestamp: ${timestamp}

-- Coloque aqui suas queries SQL
-- Exemplos disponíveis:
-- CREATE TABLE, ALTER TABLE, UPDATE, INSERT, DELETE
-- DROP TABLE, ADD COLUMN, etc.

-- Exemplo genérico:
-- CREATE TABLE exemplo (
--   id SERIAL PRIMARY KEY,
--   nome VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
`;
}

/**
 * Extrai o nome da tabela do nome da migração
 */
function extractTableName(migrationName, operation) {
  const regex = new RegExp(`${operation}[_-](.+?)(?:[_-]|$)`, "i");
  const match = migrationName.match(regex);
  return match ? match[1].replace(/[_-]/g, "_") : null;
}

module.exports = { getTemplateByType };
