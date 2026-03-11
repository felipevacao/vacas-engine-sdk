-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           PostgreSQL 17.5 (Debian 17.5-1.pgdg120+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
-- OS do Servidor:               
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando estrutura para tabela public.users
CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"email" VARCHAR(255) NOT NULL,
	"login" VARCHAR(15) NOT NULL,
	"password" VARCHAR(60) NOT NULL,
	"role" UNKNOWN NOT NULL DEFAULT 'regular',
	"status" UNKNOWN NOT NULL DEFAULT 'active',
	"pepper" VARCHAR(3) NOT NULL DEFAULT '1',
	"created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" TIMESTAMP NULL DEFAULT NULL,
	UNIQUE ("login"),
	PRIMARY KEY ("id"),
	UNIQUE ("email"),
	KEY ("role"),
	KEY ("status")
);

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela public.user_sessions
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"user_id" INTEGER NOT NULL,
	"is_revoked" BOOLEAN NULL DEFAULT false,
	"token_hash" VARCHAR(255) NOT NULL,
	"expires_at" TIMESTAMPTZ NOT NULL,
	"ip_address" VARCHAR(45) NOT NULL,
	"last_used_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	"created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" TIMESTAMP NULL DEFAULT NULL,
	"updated_at" TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	KEY ("token_hash"),
	KEY ("user_id"),
	KEY ("expires_at"),
	KEY ("is_revoked"),
	CONSTRAINT "idx_user_sessions_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- Exportação de dados foi desmarcado.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
