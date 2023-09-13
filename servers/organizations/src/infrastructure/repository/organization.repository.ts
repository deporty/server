import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { OrganizationContract } from '../../domain/contracts/organization.contract';
import { ORGANIZATIONS_ENTITY } from '../organizations.constants';
import { OrganizationMapper } from '../mappers/organization.mapper';
import { DataSource } from '@scifamek-open-source/iraca/infrastructure';

export class OrganizationRepository extends OrganizationContract {
  static entity = ORGANIZATIONS_ENTITY;
  constructor(
    protected datasource: DataSource<OrganizationEntity>,
    protected organizationMapper: OrganizationMapper
  ) {
    super(datasource, organizationMapper);
    this.entity = OrganizationRepository.entity;
  }
}
