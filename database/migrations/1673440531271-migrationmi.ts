import {MigrationInterface, QueryRunner} from "typeorm"

export class migrationmi1673440531271 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE TABLE "users"("id" INT PRIMARY KEY,"name" VARCHAR NOT NULL)`
        await queryRunner.query(sql)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users', true)
    }

}
