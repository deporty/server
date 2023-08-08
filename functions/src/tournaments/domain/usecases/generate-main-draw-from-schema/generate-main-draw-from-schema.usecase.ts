import { GroupEntity, Id, NodeMatchEntity, TournamentEntity } from '@deporty-org/entities';
import { FixtureStageConfiguration, TournamentLayoutSchema } from '@deporty-org/entities/organizations';
import { Observable, of, throwError, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { GetGroupsByTournamentIdUsecase, Result } from '../groups/get-groups-by-tournament-id/get-groups-by-tournament-id.usecase';
import { CreateNodeMatchUsecase } from '../main-draw/create-node-match/create-node-match.usecase';
import { createTree } from './matches-creator';

export class SchemaNoSelectedError extends Error {
  constructor() {
    super();
    this.message = `The tournament does not have a schema selected.`;
    this.name = 'SchemaNoSelectedError';
  }
}
export class GroupsAndSchemaDontMatchError extends Error {
  constructor() {
    super();
    this.message = `The tournament does not have a schema selected.`;
    this.name = 'GroupsAndSchemaDontMatchError';
  }
}
export class TeamsAmmountInClasificationError extends Error {
  constructor() {
    super();
    this.message = `The tournament does not have a schema selected.`;
    this.name = 'TeamsAmmountInClasificationError';
  }
}
export class MatchesCreationError extends Error {
  constructor() {
    super();
    this.message = `The tournament does not have a schema selected.`;
    this.name = 'MatchesCreationError';
  }
}

export class GenerateMainDrawFromSchemaUsecase extends Usecase<Id, NodeMatchEntity[]> {
  constructor(
    private getGroupsByTournamentIdUsecase: GetGroupsByTournamentIdUsecase,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private createNodeMatchUsecase: CreateNodeMatchUsecase
  ) {
    super();
  }

  call(tournamentId: Id): Observable<NodeMatchEntity[]> {
    const $tournament = this.getTournamentByIdUsecase.call(tournamentId);

    return $tournament.pipe(
      mergeMap((tournament: TournamentEntity) => {
        if (!tournament.schema) {
          return throwError(new SchemaNoSelectedError());
        }

        const $groups = this.getGroupsByTournamentIdUsecase.call(tournamentId);
        return zip($groups, of(tournament));
      }),
      mergeMap(([data, tournament]) => {
        const lastFixture = this.getLastFixture(data);
        const groupsInFixtureStage = lastFixture?.groups;

        const schema: TournamentLayoutSchema = tournament.schema!;

        const lastSchema: FixtureStageConfiguration = [...schema.stages].pop()!;

        if (lastSchema.groupCount != groupsInFixtureStage?.length) {
          return throwError(new GroupsAndSchemaDontMatchError());
        }
        const teamsIdentifiers = [];
        for (let i = 0; i < lastSchema.groupCount; i++) {
          const passedTeamsCount: number = lastSchema.passedTeamsCount[i];

          const group: GroupEntity = groupsInFixtureStage[i];

          const passedTeamIds: Id[] | undefined = group.positionsTable?.table.slice(0, passedTeamsCount).map((stadistic) => {
            return stadistic.teamId;
          });

          if (!passedTeamIds) {
            return throwError(new TeamsAmmountInClasificationError());
          }

          teamsIdentifiers.push(passedTeamIds);
        }
        const matches = createTree(teamsIdentifiers);
        return zip(of(matches), of(tournament));
      }),
      mergeMap(([simpleMatches, tournament]) => {
        if (!simpleMatches) {
          return throwError(new MatchesCreationError());
        }
        const ammountOfMatches = simpleMatches?.length || 0;

        const level = Math.ceil(Math.log(ammountOfMatches) / Math.log(2) );

        const $matches: Observable<NodeMatchEntity>[] = [];

        let key = 0;
        for (const simpleMatch of simpleMatches) {
          $matches.push(
            this.createNodeMatchUsecase.call({
              key,
              level,
              teamAId: simpleMatch[0],
              teamBId: simpleMatch[1],
              tournamentId: tournament.id!,
            })
          );
          key++;
        }
        return zip(...$matches);
      })
    );
  }

  private getLastFixture(data: Result) {
    let lastFixture = null;

    for (const fixtureStageId in data) {
      const element = data[fixtureStageId];

      if (lastFixture === null) {
        lastFixture = element;
      } else {
        if (element.fixtureStage.order > lastFixture.fixtureStage.order) {
          lastFixture = element;
        }
      }
    }
    return lastFixture;
  }
}
