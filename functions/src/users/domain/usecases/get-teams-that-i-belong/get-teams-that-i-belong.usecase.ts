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
          miniShield: 'https://firebasestorage.googleapis.com/v0/b/deporty-dev.appspot.com/o/teams%2FaT83kzfkTA1V81EyXNgk%2Fbrand%2Fshield.png?alt=media&token=58ba4343-c8f4-49ce-bfc7-7d3b2c042445',
          shield: 'https://firebasestorage.googleapis.com/v0/b/deporty-dev.appspot.com/o/teams%2FaT83kzfkTA1V81EyXNgk%2Fbrand%2Fshield.png?alt=media&token=58ba4343-c8f4-49ce-bfc7-7d3b2c042445',
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
