<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231213102137 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE calendar_staff DROP FOREIGN KEY FK_2E3AF0FCA40A2C8');
        $this->addSql('ALTER TABLE calendar_staff DROP FOREIGN KEY FK_2E3AF0FCD4D57CD');
        $this->addSql('ALTER TABLE calendar_user DROP FOREIGN KEY FK_DF05551DA40A2C8');
        $this->addSql('ALTER TABLE calendar_user DROP FOREIGN KEY FK_DF05551DA76ED395');
        $this->addSql('ALTER TABLE category_color_setting DROP FOREIGN KEY FK_D23910FD4BA706BC');
        $this->addSql('ALTER TABLE payment_purchase DROP FOREIGN KEY FK_21D193534C3A3BB');
        $this->addSql('ALTER TABLE payment_purchase DROP FOREIGN KEY FK_21D19353558FBEB9');
        $this->addSql('ALTER TABLE staff_calendar DROP FOREIGN KEY FK_4CF701E8A40A2C8');
        $this->addSql('ALTER TABLE staff_calendar DROP FOREIGN KEY FK_4CF701E8D4D57CD');
        $this->addSql('DROP TABLE staff');
        $this->addSql('DROP TABLE payment');
        $this->addSql('DROP TABLE calendar_staff');
        $this->addSql('DROP TABLE calendar_user');
        $this->addSql('DROP TABLE category_color_setting');
        $this->addSql('DROP TABLE payment_purchase');
        $this->addSql('DROP TABLE contact');
        $this->addSql('DROP TABLE staff_calendar');
        $this->addSql('ALTER TABLE calendar ADD background_color VARCHAR(7) NOT NULL, ADD border_color VARCHAR(7) NOT NULL, ADD text_color VARCHAR(7) NOT NULL, DROP modified_price, CHANGE stock stock INT NOT NULL, CHANGE price price INT NOT NULL');
        $this->addSql('ALTER TABLE category ADD slug VARCHAR(150) NOT NULL, DROP activitie');
        $this->addSql('ALTER TABLE purchase ADD full_name VARCHAR(255) NOT NULL, ADD address VARCHAR(255) NOT NULL, ADD postal_code VARCHAR(255) NOT NULL, ADD city VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user DROP reset_token, DROP phone');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE staff (id INT AUTO_INCREMENT NOT NULL, full_name VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE payment (id INT AUTO_INCREMENT NOT NULL, partial_amount NUMERIC(10, 2) DEFAULT NULL, relation VARCHAR(255) CHARACTER SET utf8mb3 DEFAULT NULL COLLATE `utf8mb3_unicode_ci`, installment_number INT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE calendar_staff (calendar_id INT NOT NULL, staff_id INT NOT NULL, INDEX IDX_2E3AF0FCA40A2C8 (calendar_id), INDEX IDX_2E3AF0FCD4D57CD (staff_id), PRIMARY KEY(calendar_id, staff_id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE calendar_user (calendar_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_DF05551DA40A2C8 (calendar_id), INDEX IDX_DF05551DA76ED395 (user_id), PRIMARY KEY(calendar_id, user_id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE category_color_setting (id INT AUTO_INCREMENT NOT NULL, color_setting_id INT NOT NULL, title VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, text_color VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, back_ground_color VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, border_color VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, price INT DEFAULT NULL, picture VARCHAR(255) CHARACTER SET utf8mb3 DEFAULT NULL COLLATE `utf8mb3_unicode_ci`, INDEX IDX_D23910FD4BA706BC (color_setting_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE payment_purchase (payment_id INT NOT NULL, purchase_id INT NOT NULL, INDEX IDX_21D193534C3A3BB (payment_id), INDEX IDX_21D19353558FBEB9 (purchase_id), PRIMARY KEY(payment_id, purchase_id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE contact (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, email VARCHAR(255) CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, message LONGTEXT CHARACTER SET utf8mb3 NOT NULL COLLATE `utf8mb3_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE staff_calendar (staff_id INT NOT NULL, calendar_id INT NOT NULL, INDEX IDX_4CF701E8A40A2C8 (calendar_id), INDEX IDX_4CF701E8D4D57CD (staff_id), PRIMARY KEY(staff_id, calendar_id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8mb3_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE calendar_staff ADD CONSTRAINT FK_2E3AF0FCA40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE calendar_staff ADD CONSTRAINT FK_2E3AF0FCD4D57CD FOREIGN KEY (staff_id) REFERENCES staff (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE calendar_user ADD CONSTRAINT FK_DF05551DA40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE calendar_user ADD CONSTRAINT FK_DF05551DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE category_color_setting ADD CONSTRAINT FK_D23910FD4BA706BC FOREIGN KEY (color_setting_id) REFERENCES category (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE payment_purchase ADD CONSTRAINT FK_21D193534C3A3BB FOREIGN KEY (payment_id) REFERENCES payment (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE payment_purchase ADD CONSTRAINT FK_21D19353558FBEB9 FOREIGN KEY (purchase_id) REFERENCES purchase (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE staff_calendar ADD CONSTRAINT FK_4CF701E8A40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE staff_calendar ADD CONSTRAINT FK_4CF701E8D4D57CD FOREIGN KEY (staff_id) REFERENCES staff (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE calendar ADD modified_price INT DEFAULT NULL, DROP background_color, DROP border_color, DROP text_color, CHANGE stock stock INT DEFAULT NULL, CHANGE price price INT DEFAULT NULL');
        $this->addSql('ALTER TABLE category ADD activitie TINYINT(1) NOT NULL, DROP slug');
        $this->addSql('ALTER TABLE purchase DROP full_name, DROP address, DROP postal_code, DROP city');
        $this->addSql('ALTER TABLE user ADD reset_token VARCHAR(100) DEFAULT NULL, ADD phone VARCHAR(255) NOT NULL');
    }
}
