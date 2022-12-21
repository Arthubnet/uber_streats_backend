import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@ObjectType() //GraphQL takes it to build schema
@Entity() //Entity for TypeORM, maps to database table
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((is) => Number)
  id: number;
  @Field((is) => String) //GraphQl
  @Column() //TypeOrm
  @IsString()
  @Length(5) //validator
  name: string;
  @Field((is) => Boolean, { defaultValue: true }) // default for GraphQL scheema
  @Column({ default: true }) //default for DB
  @IsOptional() //for validation, in this case it's optional
  @IsBoolean()
  isVegan: boolean;
  @Field((is) => String)
  @IsString()
  @Column()
  address: string;
  @Field((is) => String)
  @IsString()
  @Column()
  ownersName: string;
  @Field((is) => String)
  @IsString()
  @Column()
  categoryName: string;
}
