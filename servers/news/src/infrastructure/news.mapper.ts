import { NewsBody, NewsEntity, NewsNode } from '@deporty-org/entities';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class NewsNodeMapper extends Mapper<NewsNode> {
  constructor() {
    super();
    this.attributesMapper = {
      children: {
        name: 'children',
        from: (value) => {
          return value.map((x: any) => this.fromJson(x));
        },
      },
      component: {
        name: 'component',
      },
      data: {
        name: 'data',
      },
    };
  }
}
export class NewsBodyMapper extends Mapper<NewsBody> {
  constructor(private newsNodeMapper: NewsNodeMapper) {
    super();
    this.attributesMapper = {
      children: {
        name: 'children',
        from: (value) => {
          return value.map((x: any) => this.newsNodeMapper.fromJson(x));
        },
      },
    };
  }
}

export class NewsMapper extends Mapper<NewsEntity> {
  constructor(private newsBodyMapper: NewsBodyMapper) {
    super();
    this.attributesMapper = {
      abstract: {
        name: 'abstract',
      },
      publicationDate: {
        name: 'publication-date',
      },
      title: {
        name: 'abstract',
      },
      body: {
        name: 'abstract',
        from: (value) => {
          return this.newsBodyMapper.fromJson(value);
        },
      },
    };
  }
}
