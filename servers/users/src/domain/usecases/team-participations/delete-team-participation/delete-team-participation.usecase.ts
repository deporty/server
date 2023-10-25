import { TeamParticipationEntity, UserEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { TeamParticipationContract } from '../../../contracts/team-participation.contract';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GetTeamsThatIBelongUsecase } from '../get-teams-that-i-belong/get-teams-that-i-belong.usecase';
import { GetUserByIdUsecase } from '../../get-user-by-id/get-user-by-id.usecase';
import { DeleteUserUsecase } from '../../delete-user/delete-user.usecase';
import { DEFAULT_OWNER_ROLES_ID } from '../../../../infrastructure/users.constants';

export interface Param {
  userId: string;
  teamId: string;
}

export class DeleteTeamParticipationUsecase extends Usecase<Param, boolean> {
  constructor(
    private teamParticipationContract: TeamParticipationContract,
    private getTeamsThatIBelongUsecase: GetTeamsThatIBelongUsecase,
    private getUserByIdUsecase: GetUserByIdUsecase,
    private deleteUserUsecase: DeleteUserUsecase
  ) {
    super();
  }

  call(param: Param): Observable<boolean> {
    return this.teamParticipationContract
      .filter(
        {
          userId: param.userId,
        },
        {
          teamId: {
            operator: '==',
            value: param.teamId,
          },
        }
      )
      .pipe(
        map((f: TeamParticipationEntity[]) => {
          return f.filter((x) => {
            return !x.retirementDate;
          });
        }),
        mergeMap((toDelete: TeamParticipationEntity[]) => {
          if (toDelete.length == 0) {
            return of([]);
          }
          const $response: Observable<void>[] = [];
          for (const item of toDelete) {
            $response.push(
              this.teamParticipationContract.delete(
                {
                  userId: param.userId,
                },
                item.id!
              )
            );
          }
          return zip(...$response);
        }),
        mergeMap((g) => {
          return this.getTeamsThatIBelongUsecase.call(param.userId);
        }),
        mergeMap((h: any[]) => {
          if (h.length === 0) {
            return this.getUserByIdUsecase.call(param.userId).pipe(
              map((user: UserEntity) => {
                const kind = user.roles.filter((R) => {
                  return DEFAULT_OWNER_ROLES_ID.includes(R);
                });

                return (user.administrationMode === 'delegated' || true) && kind.length == 0;
              })
            );
          }
          return of(false);
        }),
        mergeMap((toDelete: boolean) => {
          if (toDelete) {
            return this.deleteUserUsecase.call(param.userId).pipe(catchError(() => of(true)));
          }
          return of(true);
        })
      );
  }
}
