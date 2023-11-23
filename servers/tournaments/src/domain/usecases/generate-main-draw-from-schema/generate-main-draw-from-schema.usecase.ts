import { GroupEntity, Id, NodeMatchEntity, TournamentEntity } from '@deporty-org/entities';
import { FixtureStageConfiguration, TournamentLayoutSchema } from '@deporty-org/entities/organizations';
import { Observable, of, throwError, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { GetGroupsByTournamentIdUsecase, Result } from '../groups/get-groups-by-tournament-id/get-groups-by-tournament-id.usecase';
import { CreateNodeMatchUsecase } from '../main-draw/create-node-match/create-node-match.usecase';
import { createTree } from './matches-creator';
import { GetMainDrawNodeMatchesoverviewUsecase } from '../get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase';

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
    this.message = `The group ammount and the schema does not match.`;
    this.name = 'GroupsAndSchemaDontMatchError';
  }
}
export class TeamsAmmountInClasificationError extends Error {
  constructor() {
    super();
    this.message = `The amount of temas inside the position table does not match withe the passed teams configuration.`;
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
export class ExistNodeMatchesError extends Error {
  constructor() {
    super();
    this.message = `There are matches previusly. You have to clear the matches collection before.`;
    this.name = 'ExistNodeMatchesError';
  }
}

export class GenerateMainDrawFromSchemaUsecase extends Usecase<Id, NodeMatchEntity[]> {
  constructor(
    private getGroupsByTournamentIdUsecase: GetGroupsByTournamentIdUsecase,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private createNodeMatchUsecase: CreateNodeMatchUsecase,
    private getMainDrawNodeMatchesoverviewUsecase: GetMainDrawNodeMatchesoverviewUsecase
  ) {
    super();
  }

  call(tournamentId: Id): Observable<NodeMatchEntity[]> {
    const $tournament = this.getTournamentByIdUsecase.call(tournamentId);
    const $nodeMatches = this.getMainDrawNodeMatchesoverviewUsecase.call({
      tournamentId,
      status: ['completed', 'editing', 'in-review', 'published', 'running'],
    });
    return $nodeMatches.pipe(
      mergeMap((nodeMatches: NodeMatchEntity[]) => {
        if (nodeMatches.length > 0) {
          return throwError(new ExistNodeMatchesError());
        }
        return $tournament;
      }),
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
        let teamsIdentifiers = [];

        try {
          teamsIdentifiers = this.getTeamIdentifiers(lastSchema, groupsInFixtureStage);
        } catch (error) {
          return throwError(error);
        }
        const simpleMatches = createTree(teamsIdentifiers);
        return zip(of(simpleMatches), of(tournament));
      }),
      mergeMap(([simpleMatches, tournament]) => {
        if (!simpleMatches) {
          return throwError(new MatchesCreationError());
        }

        const $matches: Observable<NodeMatchEntity>[] = [];

        for (const simpleMatch of simpleMatches) {
          $matches.push(
            this.createNodeMatchUsecase.call({
              key: simpleMatch.key,
              level: simpleMatch.level,
              teamAId: simpleMatch.match.teamAId,
              teamBId: simpleMatch.match.teamBId,
              tournamentId: tournament.id!,
            })
          );
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

  private getTeamIdentifiers(lastSchema: FixtureStageConfiguration, groupsInFixtureStage: GroupEntity[]): string[][] {
    const teamsIdentifiers: string[][] = [];
    for (let i = 0; i < lastSchema.groupCount; i++) {
      const passedTeamsCount: number = lastSchema.passedTeamsCount[i];

      const group: GroupEntity = groupsInFixtureStage[i];

      const passedTeamIds: Id[] | undefined = group.positionsTable?.table.slice(0, passedTeamsCount).map((stadistic) => {
        return stadistic.teamId;
      });

      if (!passedTeamIds) {
        throw new TeamsAmmountInClasificationError();
      }

      teamsIdentifiers.push(passedTeamIds);
    }
    return teamsIdentifiers;
  }
}
