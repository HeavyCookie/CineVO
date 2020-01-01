import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsAdminToUser1577892913134 implements MigrationInterface {
    name = 'AddIsAdminToUser1577892913134'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAdmin" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`, undefined);
    }

}
