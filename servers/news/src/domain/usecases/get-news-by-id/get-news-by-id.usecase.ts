import { Id, NewsEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, throwError } from 'rxjs';
import { NewsContract } from '../../news.contract';
import { mergeMap } from 'rxjs/operators';

export class NewsNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'NewsNotFoundError';
    this.message = `The news was not found.`;
  }
}

export class GetNewsByIdUsecase extends Usecase<Id, NewsEntity> {
  constructor(private newsContract: NewsContract) {
    super();
  }

  call(id: Id): Observable<NewsEntity> {
    return this.newsContract.getById(id).pipe(
      mergeMap((news: NewsEntity | undefined) => {
        if (!news) {
          return throwError(new NewsNotFoundError());
        }
        return of(news);
      })
    );
  }
}
