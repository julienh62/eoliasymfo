<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231213103251 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE calendar DROP FOREIGN KEY FK_6EA9A14612469DE2');
        $this->addSql('ALTER TABLE purchase DROP FOREIGN KEY FK_6117D13BA76ED395');
        $this->addSql('ALTER TABLE purchase_item DROP FOREIGN KEY FK_6FA8ED7D558FBEB9');
        $this->addSql('ALTER TABLE purchase_item DROP FOREIGN KEY FK_6FA8ED7DA40A2C8');
        $this->addSql('DROP TABLE calendar');
        $this->addSql('DROP TABLE purchase');
        $this->addSql('DROP TABLE purchase_item');
        $this->addSql('DROP TABLE category');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE calendar (id INT AUTO_INCREMENT NOT NULL, category_id INT NOT NULL, title VARCHAR(100) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, start DATETIME NOT NULL, end DATETIME NOT NULL, stock INT NOT NULL, price INT NOT NULL, background_color VARCHAR(7) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, border_color VARCHAR(7) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, text_color VARCHAR(7) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, INDEX IDX_6EA9A14612469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE purchase (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, total INT NOT NULL, status VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, created_at DATE DEFAULT NULL, full_name VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, address VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, postal_code VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, city VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, INDEX IDX_6117D13BA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE purchase_item (id INT AUTO_INCREMENT NOT NULL, calendar_id INT DEFAULT NULL, purchase_id INT NOT NULL, calendar_name VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, calendar_price INT NOT NULL, quantity INT NOT NULL, total INT NOT NULL, INDEX IDX_6FA8ED7DA40A2C8 (calendar_id), INDEX IDX_6FA8ED7D558FBEB9 (purchase_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, slug VARCHAR(150) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE calendar ADD CONSTRAINT FK_6EA9A14612469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE purchase ADD CONSTRAINT FK_6117D13BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE purchase_item ADD CONSTRAINT FK_6FA8ED7D558FBEB9 FOREIGN KEY (purchase_id) REFERENCES purchase (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE purchase_item ADD CONSTRAINT FK_6FA8ED7DA40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
