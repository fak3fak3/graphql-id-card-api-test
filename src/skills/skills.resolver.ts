import { Query, Resolver } from '@nestjs/graphql';
import { Skill } from './models/skill.model.js';
import { SkillsService } from './skills.service.js';

@Resolver(() => Skill)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @Query(() => [Skill], { description: 'All skills, in display order.' })
  skills(): Promise<Skill[]> {
    return this.skillsService.getSkills();
  }
}
