-- Migration: create_table_businesses
-- Created: 2025-08-20T01:54:56.996Z
-- Timestamp: 20250819225456
-- Type: CREATE TABLE

-- Criar tabela businesses
CREATE TABLE businesses (
  id CHAR(25) PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  disabled BOOLEAN DEFAULT false,
  name VARCHAR(255) NOT NULL
);

-- Criar índices
CREATE INDEX idx_businesses_code ON businesses(code);
CREATE INDEX idx_businesses_name ON businesses(name);

-- Comentários na tabela
COMMENT ON TABLE businesses IS 'Tabela para armazenar informações de empresas';

COMMENT ON COLUMN businesses.id IS 'ID único da empresa';
COMMENT ON COLUMN businesses.code IS 'Código único da empresa';
COMMENT ON COLUMN businesses.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN businesses.updated_at IS 'Data da última atualização do registro';
COMMENT ON COLUMN businesses.deleted_at IS 'Data de exclusão lógica do registro';
COMMENT ON COLUMN businesses.disabled IS 'Indica se a empresa está desativada';
COMMENT ON COLUMN businesses.name IS 'Nome da empresa';
