import { NewsEntity } from '@deporty-org/entities';
import { DataSource } from '../../core/datasource';
import { NewsContract } from '../domain/news.contract';
import { NewsMapper } from './news.mapper';

export class NewsRepository extends NewsContract {
  constructor(protected dataSource: DataSource<NewsEntity>, protected newsMapper: NewsMapper) {
    super(dataSource, newsMapper);
  }
}
