import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673554984122 implements MigrationInterface {
    name = 'migration1673554984122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appreciated-comments" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "comment_id" integer, "user_id" integer, CONSTRAINT "PK_bc2e13f62a4c496536c774016e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "text" text NOT NULL, "likes" bigint NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, "user_id" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "text" text NOT NULL, "likes" bigint NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appreciated-posts" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, "user_id" integer, CONSTRAINT "PK_1369d0e57cd464a25dd34b52c4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appreciated-comments" ADD CONSTRAINT "FK_0b2da326bb507ab17b150276139" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appreciated-comments" ADD CONSTRAINT "FK_2bddb16fee18d9ea30483328472" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appreciated-posts" ADD CONSTRAINT "FK_c964ea91f3c627c901a9c720134" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appreciated-posts" ADD CONSTRAINT "FK_787533b868029da8a25b025ea82" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appreciated-posts" DROP CONSTRAINT "FK_787533b868029da8a25b025ea82"`);
        await queryRunner.query(`ALTER TABLE "appreciated-posts" DROP CONSTRAINT "FK_c964ea91f3c627c901a9c720134"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "appreciated-comments" DROP CONSTRAINT "FK_2bddb16fee18d9ea30483328472"`);
        await queryRunner.query(`ALTER TABLE "appreciated-comments" DROP CONSTRAINT "FK_0b2da326bb507ab17b150276139"`);
        await queryRunner.query(`DROP TABLE "appreciated-posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "appreciated-comments"`);
    }

}
