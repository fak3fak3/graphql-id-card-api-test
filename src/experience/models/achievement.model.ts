import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Something accomplished at a place of work.' })
export class Achievement {
  @Field(() => ID)
  id!: string;

  @Field()
  text!: string;
}
