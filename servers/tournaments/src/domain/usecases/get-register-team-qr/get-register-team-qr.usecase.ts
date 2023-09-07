import { Id } from '@deporty-org/entities';
import { imageSync } from 'qr-image';
import { Observable, of } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class GetRegisterTeamQRUsecase extends Usecase<Id, string> {
  constructor() {
    super();
  }
  call(param?: string | undefined): Observable<string> {
    const qrCode = imageSync('https://www.example.com', { type: 'png' });
    const base64Image = qrCode.toString('base64');
    return of(base64Image);
  }
}
