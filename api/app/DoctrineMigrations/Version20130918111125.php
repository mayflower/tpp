<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration,
    Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your need!
 */
class Version20130918111125 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        // this up() migration is autogenerated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql");
        
        $this->addSql("ALTER TABLE Resource DROP FOREIGN KEY FK_45E7964012469DE2");
        $this->addSql("CREATE TABLE Project (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, color VARCHAR(20) NOT NULL, begin DATE NOT NULL, end DATE NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB");
        $this->addSql("DROP TABLE Category");
        $this->addSql("DROP TABLE Person");
        $this->addSql("ALTER TABLE Task DROP FOREIGN KEY FK_F24C741B89329D25");
        $this->addSql("ALTER TABLE Task ADD project_id INT DEFAULT NULL");
        $this->addSql("ALTER TABLE Task ADD CONSTRAINT FK_F24C741B166D1F9C FOREIGN KEY (project_id) REFERENCES Project (id)");
        $this->addSql("ALTER TABLE Task ADD CONSTRAINT FK_F24C741B89329D25 FOREIGN KEY (resource_id) REFERENCES Resource (id)");
        $this->addSql("CREATE INDEX IDX_F24C741B166D1F9C ON Task (project_id)");
        $this->addSql("DROP INDEX IDX_45E7964012469DE2 ON Resource");
        $this->addSql("ALTER TABLE Resource DROP category_id");
    }

    public function down(Schema $schema)
    {
        // this down() migration is autogenerated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql");
        
        $this->addSql("ALTER TABLE Task DROP FOREIGN KEY FK_F24C741B166D1F9C");
        $this->addSql("CREATE TABLE Category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB");
        $this->addSql("CREATE TABLE Person (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB");
        $this->addSql("DROP TABLE Project");
        $this->addSql("ALTER TABLE Resource ADD category_id INT DEFAULT NULL");
        $this->addSql("ALTER TABLE Resource ADD CONSTRAINT FK_45E7964012469DE2 FOREIGN KEY (category_id) REFERENCES Category (id)");
        $this->addSql("CREATE INDEX IDX_45E7964012469DE2 ON Resource (category_id)");
        $this->addSql("ALTER TABLE Task DROP FOREIGN KEY FK_F24C741B89329D25");
        $this->addSql("DROP INDEX IDX_F24C741B166D1F9C ON Task");
        $this->addSql("ALTER TABLE Task DROP project_id");
        $this->addSql("ALTER TABLE Task ADD CONSTRAINT FK_F24C741B89329D25 FOREIGN KEY (resource_id) REFERENCES Resource (id) ON DELETE CASCADE");
    }
}
