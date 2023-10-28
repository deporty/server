import { Container } from '@scifamek-open-source/iraca/dependency-injection';
import { AuthorizationContract } from './domain/contracts/authorization.contract';
import { MemberContract } from './domain/contracts/member.contract';
import { SportContract } from './domain/contracts/sport.contract';
import { TeamContract } from './domain/contracts/team.contract';
import { UserContract } from './domain/contracts/user.constract';
import { CreateTeamUsecase } from './domain/usecases/create-team/create-team.usecase';
import { DeleteTeamUsecase } from './domain/usecases/delete-team/delete-team.usecase';
import { EditTeamUsecase } from './domain/usecases/edit-team/edit-team.usecase';
import { GetMemberByIdUsecase } from './domain/usecases/get-member-by-id/get-member-by-id.usecase';
import { GetMembersByTeamUsecase } from './domain/usecases/get-members-by-team/get-members-by-team.usecase';
import { GetSportByIdUsecase } from './domain/usecases/get-sport-by-id/get-sport-by-id.usecase';
import { GetTeamByIdUsecase } from './domain/usecases/get-team-by-id/get-team-by-id.usecase';
import { GetTeamByNameUsecase } from './domain/usecases/get-team-by-name/get-team-by-name.usecase';
import { GetTeamByAdvancedFiltersUsecase } from './domain/usecases/get-teams-by-advanced-filters/get-teams-by-advanced-filters.usecase';
import { GetTeamByFiltersUsecase } from './domain/usecases/get-teams-by-filters/get-teams-by-filters.usecase';
import { GetTeamsUsecase } from './domain/usecases/get-teams/get-teams.usecase';
import { MemberMapper } from './infrastructure/member.mapper';
import { AuthorizationRepository } from './infrastructure/repository/authorization.repository';
import { MemberRepository } from './infrastructure/repository/member.repository';
import { SportRepository } from './infrastructure/repository/sport.repository';
import { TeamRepository } from './infrastructure/repository/team.repository';
import { UserRepository } from './infrastructure/repository/user.repository';
import { SportMapper } from './infrastructure/sport.mapper';
import { TeamMapper } from './infrastructure/team.mapper';
import { TournamentInscriptionMapper } from './infrastructure/mappers/tournament-inscription.mapper';
import { TournamentInscriptionContract } from './domain/contracts/tournament-inscription.contract';
import { TournamentInscriptionRepository } from './infrastructure/repository/tournament-inscription.repository';
import { GetTournamentInscriptionsByTeamIdUsecase } from './domain/usecases/get-tournament-inscriptions-by-team-id/get-tournament-inscriptions-by-team-id.usecase';
import { OrganizationContract } from './domain/contracts/organization.contract';
import { OrganizationRepository } from './infrastructure/repository/organization.repository';
import { AsignNewMemberToTeamUsecase } from './domain/usecases/asign-new-member-to-team/asign-new-member-to-team.usecase';
import { EditMemberByIdUsecase } from './domain/usecases/edit-member-by-id/edit-member-by-id.usecase';
import { CreateUserAndAsignNewMemberToTeamUsecase } from './domain/usecases/create-user-and-asign-new-member-to-team/create-user-and-asign-new-member-to-team.usecase';
import { DeleteMemberByIdUsecase } from './domain/usecases/delete-member-by-id/delete-member-by-id.usecase';
import { DeleteMembersFromTeamUsecase } from './domain/usecases/delete-members-from-team/delete-members-from-team.usecase';
import { GetOnlyMemberByIdUsecase } from './domain/usecases/get-only-member-by-id/get-only-member-by-id.usecase';
import { GetTeamByUniqueAttributesUsecase } from './domain/usecases/get-team-by-unique-attributes/get-team-by-unique-attributes.usecase';
import { SaveTournamentInscriptionsByTeamUsecase } from './domain/usecases/save-tournament-inscriptions-by-team/save-tournament-inscriptions-by-team.usecase';
import { GetOnlyMembersByTeamUsecase } from './domain/usecases/get-only-members-by-team/get-only-members-by-team.usecase';
import { CreateTeamAndMembersFromFileUsecase } from './domain/usecases/create-team-and-members-from-file/create-team-and-members-from-file.usecase';
import { EndMemberParticipationUsecase } from './domain/usecases/end-member-participation/end-member-participation.usecase';

export class TeamsModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'SportMapper',
      kind: SportMapper,
      strategy: 'singleton',
      dependencies: [],
    });

    container.add({
      id: 'MemberMapper',
      kind: MemberMapper,
      dependencies: ['FileAdapter'],
      strategy: 'singleton',
    });

    container.add({
      id: 'TournamentInscriptionMapper',
      kind: TournamentInscriptionMapper,
      dependencies: ['MemberMapper'],
      strategy: 'singleton',
    });

    container.add({
      id: 'SportContract',
      kind: SportContract,
      override: SportRepository,
      strategy: 'singleton',
      dependencies: ['DataSource', 'SportMapper'],
    });
    container.add({
      id: 'UserContract',
      kind: UserContract,
      override: UserRepository,
      strategy: 'singleton',
    });
    container.add({
      id: 'AuthorizationContract',
      kind: AuthorizationContract,
      override: AuthorizationRepository,
      strategy: 'singleton',
    });
    container.add({
      id: 'OrganizationContract',
      kind: OrganizationContract,
      override: OrganizationRepository,

      strategy: 'singleton',
    });
    container.add({
      id: 'TournamentInscriptionContract',
      kind: TournamentInscriptionContract,
      override: TournamentInscriptionRepository,
      dependencies: ['Firestore', 'TournamentInscriptionMapper'],

      strategy: 'singleton',
    });

    container.add({
      id: 'TeamMapper',
      kind: TeamMapper,
      strategy: 'singleton',
      dependencies: ['FileAdapter'],
    });

    container.add({
      id: 'TeamContract',
      kind: TeamContract,
      override: TeamRepository,
      dependencies: ['DataSource', 'TeamMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'MemberContract',
      kind: MemberContract,
      override: MemberRepository,
      dependencies: ['Firestore', 'MemberMapper'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetSportByIdUsecase',
      kind: GetSportByIdUsecase,
      strategy: 'singleton',
      dependencies: ['SportContract'],
    });

    container.add({
      id: 'GetTeamByNameUsecase',
      kind: GetTeamByNameUsecase,
      dependencies: ['TeamContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTeamByAdvancedFiltersUsecase',
      kind: GetTeamByAdvancedFiltersUsecase,
      dependencies: ['TeamContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTournamentInscriptionsByTeamIdUsecase',
      kind: GetTournamentInscriptionsByTeamIdUsecase,
      dependencies: ['TournamentInscriptionContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTeamByFiltersUsecase',
      kind: GetTeamByFiltersUsecase,
      dependencies: ['TeamContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetTeamsUsecase',
      kind: GetTeamsUsecase,
      dependencies: ['TeamContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'EndMemberParticipationUsecase',
      kind: EndMemberParticipationUsecase,
      dependencies: ['GetOnlyMemberByIdUsecase', 'MemberContract', 'FileAdapter', 'UserContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetMemberByIdUsecase',
      kind: GetMemberByIdUsecase,
      dependencies: ['MemberContract', 'UserContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetOnlyMemberByIdUsecase',
      kind: GetOnlyMemberByIdUsecase,
      dependencies: ['MemberContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetMembersByTeamUsecase',
      kind: GetMembersByTeamUsecase,
      dependencies: ['MemberContract', 'UserContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'DeleteTeamUsecase',
      kind: DeleteTeamUsecase,
      dependencies: [
        'TeamContract',
        'GetTeamByIdUsecase',
        'DeleteMembersFromTeamUsecase',
        'EditTeamUsecase',
        'GetTournamentInscriptionsByTeamIdUsecase',
        'FileAdapter',
      ],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetTeamByIdUsecase',
      kind: GetTeamByIdUsecase,
      dependencies: ['TeamContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'EditTeamUsecase',
      kind: EditTeamUsecase,
      dependencies: ['TeamContract', 'GetTeamByIdUsecase', 'FileAdapter', 'GetTeamByUniqueAttributesUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetTeamByUniqueAttributesUsecase',
      kind: GetTeamByUniqueAttributesUsecase,
      dependencies: ['TeamContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetOnlyMembersByTeamUsecase',
      kind: GetOnlyMembersByTeamUsecase,
      dependencies: ['MemberContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'CreateTeamAndMembersFromFileUsecase',
      kind: CreateTeamAndMembersFromFileUsecase,
      dependencies: ['CreateTeamUsecase', 'CreateUserAndAsignNewMemberToTeamUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'SaveTournamentInscriptionsByTeamUsecase',
      kind: SaveTournamentInscriptionsByTeamUsecase,
      dependencies: ['TournamentInscriptionContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'CreateTeamUsecase',
      kind: CreateTeamUsecase,
      dependencies: ['TeamContract', 'GetTeamByUniqueAttributesUsecase', 'EditTeamUsecase', 'FileAdapter', 'AsignNewMemberToTeamUsecase'],
      strategy: 'singleton',
    });

    container.add({
      id: 'AsignNewMemberToTeamUsecase',
      kind: AsignNewMemberToTeamUsecase,
      dependencies: ['TeamContract', 'GetTeamByIdUsecase', 'GetMembersByTeamUsecase', 'UserContract', 'MemberContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'EditMemberByIdUsecase',
      kind: EditMemberByIdUsecase,
      dependencies: ['GetOnlyMemberByIdUsecase', 'MemberContract', 'FileAdapter'],
      strategy: 'singleton',
    });
    container.add({
      id: 'CreateUserAndAsignNewMemberToTeamUsecase',
      kind: CreateUserAndAsignNewMemberToTeamUsecase,
      dependencies: ['UserContract', 'AsignNewMemberToTeamUsecase'],
      strategy: 'singleton',
    });
    container.add({
      id: 'DeleteMemberByIdUsecase',
      kind: DeleteMemberByIdUsecase,
      dependencies: ['GetMemberByIdUsecase', 'MemberContract', 'FileAdapter', 'UserContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'DeleteMembersFromTeamUsecase',
      kind: DeleteMembersFromTeamUsecase,
      dependencies: ['GetMembersByTeamUsecase', 'DeleteMemberByIdUsecase'],
      strategy: 'singleton',
    });
  }
}
