import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';
import { User } from './../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType() // with InputType we should use 'input' in resolver. With @ArgsType we don't use 'input"
export class EditProfileInput extends PartialType(
  // the reason we use PartialType here is because the user will be able to edit either one or all the properties. With PickType, it will be mandate to use(edit) all the specified properties
  PickType(User, ['email', 'password']),
) {}
