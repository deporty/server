import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of, zip } from 'rxjs';
import { read, WorkBook, WorkSheet } from 'xlsx';
import { CreateTeamUsecase } from '../create-team/create-team.usecase';
import { CreateUserAndAsignNewMemberToTeamUsecase } from '../create-user-and-asign-new-member-to-team/create-user-and-asign-new-member-to-team.usecase';
import { TeamEntity } from '@deporty-org/entities';
import { map, mergeMap } from 'rxjs/operators';
const moment = require('moment');
export interface Param {
  team: string;
  shield: string;
  userCreatorId: string;
}

const defaultSheetName = 'Datos';

export class CreateTeamAndMembersFromFileUsecase extends Usecase<Param, any> {
  constructor(
    private createTeamUsecase: CreateTeamUsecase,
    private createUserAndAsignNewMemberToTeamUsecase: CreateUserAndAsignNewMemberToTeamUsecase
  ) {
    super();
    this.createTeamUsecase;
    this.createUserAndAsignNewMemberToTeamUsecase;
  }

  call(param: Param): Observable<any> {
    const { team, shield } = param;

    const buffer = Buffer.from(team, 'base64');
    const workbook: WorkBook = read(buffer, { type: 'buffer' });
    const sheet = this.getDataSheet(workbook);

    const teamEntity = this.getTeamInformation(sheet, shield);
    const members = this.getMembersInformation(sheet);

    return this.createTeamUsecase
      .call({
        team: teamEntity,
        userCreatorId: param.userCreatorId,
      })
      .pipe(
        mergeMap((team) => {
          const $members = members.map((m) => {
            return this.createUserAndAsignNewMemberToTeamUsecase.call({
              kindMember: 'player',
              teamId: team.team.id!,
              user: m,
              number: m['number'],
            });
          });

          return zip(of(team), $members.length ? zip(...$members) : of([]));
        }),
        map(([team, members]) => {
          return {
            team,
            members,
          };
        })
      );
  }

  getDataSheet(workbook: WorkBook): WorkSheet {
    const namesInWorkbook = workbook.SheetNames;
    const name = namesInWorkbook.length ? namesInWorkbook[0] : defaultSheetName;
    return workbook.Sheets[name];
  }
  getTeamInformation(sheet: WorkSheet, shield: string) {
    const name = sheet['C2']['v'];
    const category = sheet['C3']['v'];
    const city = sheet['C4']['v'];

    return {
      category,
      name,
      city,
      shield,
    } as TeamEntity;
  }
  getMembersInformation(sheet: WorkSheet) {
    const infoMap = {
      firstName: { key: 'B', default: '', parser: undefined },
      secondName: { key: 'C', default: '', parser: undefined },
      firstLastName: { key: 'D', default: '', parser: undefined },
      secondLastName: { key: 'E', default: '', parser: undefined },
      document: {
        key: 'F',
        default: '',
        parser: (doc: any) => {
          return doc.toString();
        },
      },
      birthDate: {
        key: 'G',
        default: '',
        parser: (date: any) => {
          const today = moment('01-01-1900', 'DD-MM-YYYY');
          const bornDate = today.add(date - 2, 'days');
          return bornDate.toDate();
        },
      },
      email: { key: 'H', default: '', parser: undefined },
      phone: {
        key: 'I',
        default: '',
        parser: (phone: any) => {
          return phone.toString();
        },
      },
      number: { key: 'J', default: undefined, parser: undefined },
    };

    const initRow = 10;

    let existInfo = true;
    let row = initRow;
    const entries = Object.entries(infoMap);
    const users = [];
    while (existInfo) {
      const user: any = {};
      for (const entry of entries) {
        const coord = entry[1].key + row;
        let value = sheet[coord];
        let parsedValue;
        if (!!value) {
          parsedValue = value['v'];
        } else {
          parsedValue = entry[1].default;
        }
        if (!!entry[1].parser) {
          parsedValue = entry[1].parser(parsedValue);
        }
        user[entry[0]] = parsedValue;
      }
      users.push(user);
      row++;
      existInfo = !!sheet['F' + row];
    }
    return users;
  }
}
