import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from './../../common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

@ObjectType() //GraphQL takes it to build schema
@Entity() //Entity for TypeORM, maps to database table
export class Category extends CoreEntity {
  @Field((is) => String) //GraphQl
  @Column() //TypeOrm
  @IsString()
  @Length(5) //validator
  name: string;
  @Field((is) => String)
  @IsString()
  @Column()
  bgImage: string;

  @Field(() => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
