import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SkillCategory } from './skill-category.enum.js';

@ObjectType({
  description: 'A technology or tool the profile owner works with.',
})
export class Skill {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => SkillCategory)
  category!: SkillCategory;
}
