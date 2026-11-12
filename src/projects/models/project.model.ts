import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Something the profile owner has built.' })
export class Project {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Public address of the project, if it has one.',
  })
  url!: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Source code, if it is public.',
  })
  repositoryUrl!: string | null;
}
