import { Args, ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantDto {
  @Field((type) => Number)
  id: number; // we need this one because it's requared field
  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType; //this guy is optional because of Partial Type (above), so we can use any property from the object
}
