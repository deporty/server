import { Observable, of } from 'rxjs';
import { Usecase } from '../../../../core/usecase';
import { MemberEntity, TeamEntity } from '@deporty-org/entities';

export class GetTeamsThatIBelongUsecase extends Usecase<string, any> {
  call(email: string): Observable<any> {
    return of([
      {
        team: {
          name: 'Once Caldas A',
          category: 'Sub 15',
          id: 'aT83kzfkTA1V81EyXNgk',
          miniShield: 'teams/aT83kzfkTA1V81EyXNgk/brand/mini-shield.png',
          shield: 'teams/aT83kzfkTA1V81EyXNgk/brand/shield.png',
        } as TeamEntity,
        member: {
          id: '590ae4eb023b40debb36',
          kindMember: 'technical-director',
          teamId: 'aT83kzfkTA1V81EyXNgk',
          userId: 'FEp8Iizh74DqM01o58tV',
        } as MemberEntity,
      },
    ]);
  }
}
