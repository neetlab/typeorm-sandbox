import { createConnection, Entity, Column, OneToOne, PrimaryColumn, JoinTable, BaseEntity } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

@Entity()
class A {
	@PrimaryColumn()
	id!: string;

	@OneToOne(() => B)
	@JoinTable()
	b!: B;
}

@Entity()
class B {
	@PrimaryColumn()
	id!: string;

	@Column()
	field!: string;
}

const main = async () => {
	const connection = await createConnection({
		type: 'postgres',
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		synchronize: false,
		entities: [A, B],
	});

	const a = new A();
	const b = new B();
	a.id = '123';
	b.id = '123';
	a.b = b;

	connection.manager.save(a)

	const res = connection
		.createQueryBuilder()
		.insert()
		.into(A)
		.values(a)
		.getQueryAndParameters();

	console.log(res);
	await connection.close();
}

main();
