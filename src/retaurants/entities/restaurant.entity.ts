import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from './../../common/entities/core.entity';
import { Category } from './category.entity';

@ObjectType() //GraphQL takes it to build schema
@Entity() //Entity for TypeORM, maps to database table
export class Restaurant extends CoreEntity {
  @Field((is) => String) //GraphQl
  @Column() //TypeOrm
  @IsString()
  @Length(5) //validator
  name: string;
  @Field((is) => String)
  @IsString()
  @Column()
  address: string;
  @Field((is) => String)
  @IsString()
  @Column()
  bgImage: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;
}
