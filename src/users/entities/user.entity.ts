import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt'; //importing everything
import { IsEmail, IsEnum } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { boolean } from 'joi';

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
  @Column()
  @Field(() => String)
  password: string;
  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;
  @Column({ default: false })
  @Field(() => Boolean)
  verified: boolean;

  @BeforeInsert() //TypeORM listener. Triggers when something happens to the Entity
  @BeforeUpdate() // Triggers after updating the user( calling "update" method in service)
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      console.log(ok);
      return ok;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
