import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from './../../common/entities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';

@InputType('RestaurantInputType', { isAbstract: true })
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
  coverImage: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.restaurants)
  owner: User;
}
