import {
  StadisticSpecification,
  Stadistics,
} from '@deporty-org/entities/tournaments';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';
import { of, zip } from 'rxjs';

export class StadisticsMapper extends Mapper<Stadistics> {
  constructor(
    private stadisticSpecificationMapper: StadisticSpecificationMapper
  ) {
    super();

    this.attributesMapper = {
      teamA: {
        name: 'team-a',
        to: (values: StadisticSpecification[]) => {
          return values
            ? values.map((val: StadisticSpecification) => {
                return this.stadisticSpecificationMapper.toJson(val);
              })
            : undefined;
        },
        from: (value: any[]) => {
          return value && value.length > 0
            ? zip(
                ...value.map((val) => {
                  return this.stadisticSpecificationMapper.fromJson(val);
                })
              )
            : of([]);
        },
      },
      teamB: {
        name: 'team-b',
        to: (values: StadisticSpecification[]) => {
          return values
            ? values.map((val: StadisticSpecification) => {
                return this.stadisticSpecificationMapper.toJson(val);
              })
            : undefined;
        },
        from: (value: any[]) => {
          return value && value.length > 0
            ? zip(
                ...value.map((val) => {
                  return this.stadisticSpecificationMapper.fromJson(val);
                })
              )
            : of([]);
        },
      },
      extraGoalsTeamA: { name: 'extra-goals-team-a' },
      extraGoalsTeamB: { name: 'extra-goals-team-b' },
    };
  }
}
export class StadisticSpecificationMapper extends Mapper<StadisticSpecification> {
  constructor() {
    super();

    this.attributesMapper = {
      memberId: { name: 'member-id' },
      goals: {
        name: 'goals',
      },
      totalGoals: { name: 'total-goals' },

      redCards: { name: 'red-cards' },
      totalRedCards: { name: 'total-red-cards' },

      yellowCards: { name: 'yellow-cards' },
      totalYellowCards: { name: 'total-yellow-cards' },
    };
  }
}
