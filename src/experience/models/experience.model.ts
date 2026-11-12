import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { DateScalar } from '../../graphql/scalars/date.scalar.js';

@ObjectType({ description: 'A place of work.' })
export class Experience {
  @Field(() => ID)
  id!: string;

  @Field()
  company!: string;

  @Field(() => String, { nullable: true })
  companyUrl!: string | null;

  @Field({ description: 'Job title.' })
  position!: string;

  @Field(() => DateScalar)
  startDate!: Date;

  @Field(() => DateScalar, {
    nullable: true,
    description: 'Null while the job is current.',
  })
  endDate!: Date | null;

  @Field({ description: 'True while the job has no end date.' })
  isCurrent!: boolean;

  @Field({
    description: 'Human-readable period, e.g. "декабрь 2022 — декабрь 2024".',
  })
  period!: string;

  @Field(() => Int, {
    description:
      'Length in months, counting both the first and the last month. ' +
      'A current job is counted up to the moment of the request.',
  })
  durationMonths!: number;
}
