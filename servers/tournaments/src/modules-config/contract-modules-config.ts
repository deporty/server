import { Container } from "@scifamek-open-source/iraca/dependency-injection";
import { AuthorizationContract } from "../domain/contracts/authorization.contract";
import { FixtureStageContract } from "../domain/contracts/fixture-stage.contract";
import { GroupContract } from "../domain/contracts/group.contract";
import { IntergroupMatchContract } from "../domain/contracts/intergroup-match.contract";
import { LocationContract } from "../domain/contracts/location.contract";
import { MatchContract } from "../domain/contracts/match.contract";
import { MatchesByRefereeIdContract } from "../domain/contracts/matches-by-referee-id.contract";
import { NodeMatchContract } from "../domain/contracts/node-match.contract";
import { OrganizationContract } from "../domain/contracts/organization.contract";
import { RegisteredTeamsContract } from "../domain/contracts/registered-teams.contract";
import { TeamContract } from "../domain/contracts/team.contract";
import { TournamentContract } from "../domain/contracts/tournament.contract";
import { AuthorizationRepository } from "../infrastructure/repositories/authorization.repository";
import { FixtureStageRepository } from "../infrastructure/repositories/fixture-stage.repository";
import { GroupRepository } from "../infrastructure/repositories/group.repository";
import { IntergroupMatchRepository } from "../infrastructure/repositories/intergroup-match.repository";
import { LocationRepository } from "../infrastructure/repositories/location.repository";
import { MatchRepository } from "../infrastructure/repositories/match.repository";
import { MatchesByRefereeIdRepository } from "../infrastructure/repositories/matches-by-referee-id.repository";
import { NodeMatchRepository } from "../infrastructure/repositories/node-match.repository";
import { OrganizationRepository } from "../infrastructure/repositories/organization.repository";
import { RegisteredTeamsRepository } from "../infrastructure/repositories/registered-teams.repository";
import { TeamRepository } from "../infrastructure/repositories/team.repository";
import { TournamentRepository } from "../infrastructure/repositories/tournament.repository";


export class ContractModulesConfig {
  static config(container: Container) {
  
    container.add({
      id: 'LocationContract',
      kind: LocationContract,
      override: LocationRepository,
      strategy: 'singleton',
    });

    container.add({
      id: 'GroupContract',
      kind: GroupContract,
      override: GroupRepository,
      dependencies: ['Firestore', 'GroupMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'TournamentContract',
      kind: TournamentContract,
      override: TournamentRepository,
      dependencies: ['DataSource', 'TournamentMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'FixtureStageContract',
      kind: FixtureStageContract,
      override: FixtureStageRepository,
      dependencies: ['Firestore', 'FixtureStageMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'IntergroupMatchContract',
      kind: IntergroupMatchContract,
      override: IntergroupMatchRepository,
      dependencies: ['Firestore', 'IntergroupMatchMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'MatchesByRefereeIdContract',
      kind: MatchesByRefereeIdContract,
      override: MatchesByRefereeIdRepository,
      dependencies: ['DataSource', 'MatchesByRefereeIdMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'MatchContract',
      kind: MatchContract,
      override: MatchRepository,
      dependencies: ['Firestore', 'MatchMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'NodeMatchContract',
      kind: NodeMatchContract,
      override: NodeMatchRepository,
      dependencies: ['Firestore', 'NodeMatchMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'RegisteredTeamsContract',
      kind: RegisteredTeamsContract,
      override: RegisteredTeamsRepository,
      dependencies: ['Firestore', 'RegisteredTeamMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'OrganizationContract',
      kind: OrganizationContract,
      override: OrganizationRepository,
      dependencies: [],
      strategy: 'singleton',
    });
    container.add({
      id: 'AuthorizationContract',
      kind: AuthorizationContract,
      override: AuthorizationRepository,
      dependencies: [],
      strategy: 'singleton',
    });

    container.add({
      id: 'TeamContract',
      kind: TeamContract,
      override: TeamRepository,
      strategy: 'singleton',
    });
    
  }
}
