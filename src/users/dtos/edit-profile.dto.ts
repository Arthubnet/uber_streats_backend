import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType() // with InputType we should use 'input' in resolver.
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}
