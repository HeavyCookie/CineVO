import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSubscriptions1577458510514 implements MigrationInterface {
  name = 'CreateSubscriptions1577458510514'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "subscriber" RENAME TO "user"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordHash" character varying NOT NULL`
    )
    await queryRunner.query(
      `CREATE TABLE "subscription" ("userId" uuid NOT NULL, "theaterId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5e410e5940c19e881d4a4c03d2e" PRIMARY KEY ("userId", "theaterId"))`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_42c2f8455f8bd8987f5ff2f3dd7" FOREIGN KEY ("theaterId") REFERENCES "theater"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_42c2f8455f8bd8987f5ff2f3dd7"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`,
      undefined
    )
    await queryRunner.query(`DROP TABLE "subscription"`, undefined)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordHash"`)
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "subscriber"`)
  }
}
