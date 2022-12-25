import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { CoreEntity } from './../../common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType() //GraphQL takes it to build schema
@Entity() //Entity for TypeORM, maps to database table
export class Category extends CoreEntity {
  @Field((is) => String) //GraphQl
  @Column()
  @IsString()
  name: string;

  @Field((is) => String)
  @IsString()
  @Column()
  coverImage: string;

  @Field(() => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
