import { GenerateMainDrawFromSchemaUsecase } from './generate-main-draw-from-schema.usecase';
import { of } from 'rxjs';
import { DEFAULT_GROUP_SIZE_LABELS, GroupEntity, Id, NodeMatchEntity, TournamentEntity } from '@deporty-org/entities';
describe('GenerateMainDrawFromSchemaUsecase', () => {
  let generateMainDrawFromSchemaUsecase: GenerateMainDrawFromSchemaUsecase;
  beforeAll(() => {});

  function generateGroupsByConfig(groups: number, groupLengh: number) {
    const response: GroupEntity[] = [];
    for (let index = 0; index < groups; index++) {
      const label = DEFAULT_GROUP_SIZE_LABELS[index];
      const numeros = Array.from({ length: groupLengh }, (_, index) => {
        return {
          teamId: `${index + 1}${label}`,
        };
      });

      response.push({
        label: label,
        positionsTable: {
          table: numeros,
        },
      } as GroupEntity);
    }
    return response;
  }

  function generateStagesConfig(groupCount: number, groupLength: number, passedTeamsCount: number) {
    return {
      groupCount,
      groupSize: Array.from({ length: groupCount }, (_, index) => groupLength),
      passedTeamsCount: Array.from({ length: groupCount }, (_, index) => passedTeamsCount),
    };
  }

  function generateUsecase(groups: number, groupLengh: number, passedTeamsCount: number) {
    return new GenerateMainDrawFromSchemaUsecase(
      {
        call: (tournamentId: Id) => {
          return of({
            aksjf: {
              fixtureStage: {
                order: 0,
                tournamentId,
              },
              groups: [...generateGroupsByConfig(groups, groupLengh)],
            },
          });
        },
      } as any,
      {
        call: (tournamentId: Id) => {
          return of({
            id: tournamentId,
            category: 'Open',
            financialStatements: {
              amount: 1,
              numOfInvoices: 1,
              status: 'pending',
            },
            locations: [],
            organizationId: '',
            startsDate: new Date(),
            status: 'running',
            tournamentLayoutId: '',
            version: '',
            year: 2023,

            schema: {
              name: 'default',
              stages: [generateStagesConfig(groups, groupLengh, passedTeamsCount)],
            },
          } as TournamentEntity);
        },
      } as any,
      {
        call: (param: { tournamentId: Id; key: number; level: number; teamAId: Id; teamBId: Id }) => {
          return of({
            key: param.key,
            level: param.level,
            match: {
              teamAId: param.teamAId,
              teamBId: param.teamBId,
            },
            tournamentId: param.tournamentId,
          } as NodeMatchEntity);
        },
      } as any
    );
  }
  it('should generate', (done) => {
    generateMainDrawFromSchemaUsecase = generateUsecase(6, 4, 2);
    const res = generateMainDrawFromSchemaUsecase.call('tournamentId');
    res.subscribe((nodeMatches) => {
      for (const node of nodeMatches) {
        expect(node.level).toBe(2);
      }

      done();
    });
  });
});
