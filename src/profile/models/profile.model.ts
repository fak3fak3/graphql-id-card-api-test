import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Only the profile's own fields are declared here. Related data (links and,
 * later, skills, experience, projects) is attached by @ResolveField in the
 * module that owns it, so it is loaded only when a query asks for it.
 */
@ObjectType({ description: 'The owner of the business card.' })
export class Profile {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ description: 'Short professional title.' })
  headline!: string;

  @Field()
  description!: string;
}
