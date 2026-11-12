import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LinkKind } from './link-kind.enum.js';

@ObjectType({ description: 'A link to a professional resource.' })
export class ProfileLink {
  @Field(() => ID)
  id!: string;

  @Field(() => LinkKind)
  kind!: LinkKind;

  @Field({ description: 'Human-readable name of the resource.' })
  label!: string;

  @Field()
  url!: string;
}
