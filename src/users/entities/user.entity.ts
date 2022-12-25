import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt'; //importing everything
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

enum UserRole {
  Client,
  Owner,
  Delivery,
}
registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true }) //this one for User dto
@ObjectType() //GraphQl
@Entity() //TypeORM
export class User extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;
  @Column({ select: false }) //when we verify the user, password won't be passed in an object, so we don't hash it again
  @Field(() => String)
  password: string;
  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;
  @Column({ default: false }) //for TypeORM(DB), means that by default it's going to be false
  @IsOptional() //for DTO, we are not requared to use this property
  @Field(() => Boolean, { defaultValue: false }) // if we won't specify this property, it will be false in DB. We can do nullable here too, it will mean we can just skip the property
  verified: boolean;
  @Column()
  @Field(() => Number)
  age: number;

  @BeforeInsert() //TypeORM listener. Triggers when something happens to the Entity. In out case hashes the password before storing it in DB
  @BeforeUpdate() // Triggers after updating the user("editProfile" method in service). Hashing the password before updating it in DB
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
