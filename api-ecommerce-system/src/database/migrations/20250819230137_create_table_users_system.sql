-- Migration: create_table_users_system
-- Created: 2025-08-20T02:01:37.522Z
-- Timestamp: 20250819230137
-- Type: CREATE TABLE

-- Criar tabela users_system
CREATE TABLE users_system (
  id CHAR(25) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Criar índices
CREATE INDEX idx_users_system_email ON users_system(email);

-- Comentários na tabela
COMMENT ON TABLE users_system IS 'Tabela para armazenar informações de usuários do sistema';

COMMENT ON COLUMN users_system.id IS 'ID único da usuário';
COMMENT ON COLUMN users_system.email IS 'Email único do usuário';
COMMENT ON COLUMN users_system.password IS 'Senha do usuário, armazenada de forma criptografada';

INSERT INTO users_system (id, email, password) VALUES
  ('${ADMIN_USER_ID}', '${ADMIN_EMAIL}', '${ADMIN_PASSWORD_HASH}');
  