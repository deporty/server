import { TeamEntity } from '@deporty-org/entities';
import { OrganizationEntity, TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { MatchEntity, StadisticSpecification, TournamentEntity } from '@deporty-org/entities/tournaments';
import { Observable, from, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { OrganizationContract } from '../../contracts/organization.contract';
import { TeamContract } from '../../contracts/team.contract';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { FileAdapter } from '@scifamek-open-source/iraca/infrastructure';
import { downloadImageFromURL } from '@scifamek-open-source/iraca/helpers';

const pdfmake = require('pdfmake');
const moment = require('moment');

const background = '#ccc';

export class CreateMatchSheetUsecase extends Usecase<MatchEntity, any> {
  constructor(
    private fileAdapter: FileAdapter,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private organizationContract: OrganizationContract,
    private teamContract: TeamContract
  ) {
    super();
  }
  call(param: any): Observable<any> {
    const match = param.match;

    return this.getTournamentByIdUsecase.call(param.tournamentId).pipe(
      mergeMap((tournament: TournamentEntity) => {
        const $organization = this.organizationContract.getOrganizationById(tournament.organizationId);

        const $teamA = this.teamContract.getTeamById(match.teamAId);
        const $teamB = this.teamContract.getTeamById(match.teamBId);
        const $tournamentLayout = this.organizationContract.getTournamentLayoutByIdUsecase(
          tournament.organizationId,
          tournament.tournamentLayoutId
        );

        const $fullMembers = this.getFullMembers(match);

        return zip($organization, $teamA, $teamB, of(tournament), $tournamentLayout, $fullMembers);
      }),
      mergeMap(([organization, teamA, teamB, tournament, tournamentLayout, fullMembers]) => {
        return this.createDocDefinition({
          match,
          teamA,
          teamB,
          tournament,
          organization,
          tournamentLayout,
          fullMembers,
        }).pipe(
          mergeMap((docDefinition) => {
            return this.createDoc(docDefinition);
          })
        );
      })
    );
  }

  getImage(url: string | undefined, direct: boolean = false) {
    if (direct) {
      return !!url && url !== '' ? downloadImageFromURL(url) : of('');
    }
    return !!url && url !== ''
      ? this.fileAdapter.getAbsoluteHTTPUrl(url).pipe(
          mergeMap((x) => {
            return downloadImageFromURL(x || url);
          })
        )
      : of('');
  }

  getSignatures(match: MatchEntity) {
    const $captainASignature = this.getImage(match.captainASignature);
    const $captainBSignature = this.getImage(match.captainBSignature);
    const $judgeSignature = this.getImage(match.judgeSignature);

    return zip($captainASignature, $captainBSignature, $judgeSignature);
  }

  makeStyles() {
    return {
      shadow: {
        background: '#aaa',
      },
    };
  }

  getFullMembers(match: MatchEntity) {
    const $teamA =
      match.playerForm?.teamA && match.playerForm?.teamA.length > 0
        ? zip(
            ...match.playerForm?.teamA.map((id) => {
              return this.teamContract.getMemberById(match.teamAId, id);
            })
          )
        : of([]);
    const $teamB =
      match.playerForm?.teamB && match.playerForm?.teamB.length > 0
        ? zip(
            ...match.playerForm?.teamB.map((id) => {
              return this.teamContract.getMemberById(match.teamBId, id);
            })
          )
        : of([]);

    return zip($teamA, $teamB).pipe(
      map(([teamA, teamB]) => {
        const members = {
          teamA: teamA.reduce((prev: any, curr) => {
            prev[curr.member.id!] = curr;
            return prev;
          }, {}),
          teamB: teamB.reduce((prev: any, curr) => {
            prev[curr.member.id!] = curr;
            return prev;
          }, {}),
        };
        return members;
      })
    );
  }
  createDocDefinition(param: {
    match: MatchEntity;
    teamA: TeamEntity;
    teamB: TeamEntity;
    tournament: TournamentEntity;
    organization: OrganizationEntity;
    tournamentLayout: TournamentLayoutEntity;
    fullMembers: {
      teamA: any;
      teamB: any;
    };
  }) {
    const { match, tournament, organization, teamA, teamB, tournamentLayout, fullMembers } = param;

    const { $shieldA, $shieldB, $brandIso, $organizationIso } = this.getPhotosFromMatch({
      match,
      tournament,
      organization,
      teamA,
      teamB,
    });

    const $shields = zip($shieldA, $shieldB, $brandIso, $organizationIso);
    const $signatures = this.getSignatures(match);

    return zip($shields, $signatures).pipe(
      map(([shields, signatures]) => {
        const shield64A = shields[0];
        const shield64B = shields[1];

        const brand64 = shields[2];
        const organization64 = shields[3];

        const signatureA = signatures[0];
        const signatureB = signatures[1];
        const signatureJudge = signatures[2];

        return {
          styles: this.makeStyles(),
          defaultStyle: {
            fontSize: 9,
            alignment: 'center',
            font: 'Helvetica',
          },
          content: [
            this.createHeaderDefinition(brand64, organization64, tournamentLayout),
            this.createGeneralMatchInformation(match, tournament),
            this.createTeamsHeaders({ shield64A, shield64B, teamA, teamB }),
            {
              columns: [this.extractPlayerForm(match, 'teamA', fullMembers), this.extractPlayerForm(match, 'teamB', fullMembers)],
            },

            this.getExtraGoles(match),
            this.getConsolidatedResults(match),

            this.createTechnicalDirector(match),
            {
              margin: [0, 10, 0, 10],
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      text: 'Observaciones',
                      fillColor: background,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: match.observations,
                    },
                  ],
                ],
              },
            },
            {
              style: 'w-100',
              table: {
                widths: ['*', '*', '*'],

                body: [
                  [
                    {
                      text: 'Firma del Capitán A',
                      alignment: 'center',
                      fillColor: background,
                      bold: true,
                    },
                    {
                      text: 'Firma del Juez Principal',
                      alignment: 'center',
                      fillColor: background,
                      bold: true,
                    },
                    {
                      text: 'Firma del Capitán B',
                      alignment: 'center',
                      fillColor: background,
                      bold: true,
                    },
                  ],
                  [this.createSignature(signatureA), this.createSignature(signatureJudge), this.createSignature(signatureB)],
                ],
              },
            },
          ],
        };
      })
    );
  }

  createSignature(signature: string) {
    return signature != ''
      ? {
          image: signature,
          alignment: 'center',
          width: 100,
        }
      : {
          text: signature,
          alignment: 'center',
          width: 100,
        };
  }
  getConsolidatedResults(match: MatchEntity): any {
    return {
      table: {
        widths: ['*', 10, 10, 10, '*', 10, 10, 10],

        body: [
          [
            { text: 'TOTAL', fillColor: background, bold: true },
            match.stadistics?.teamA?.reduce((x, y) => {
              return x + y.totalYellowCards;
            }, 0) || 0,
            match.stadistics?.teamA?.reduce((x, y) => {
              return x + y.totalRedCards;
            }, 0) || 0,
            match.score?.teamA || 0,
            { text: 'TOTAL', fillColor: background, bold: true },
            match.stadistics?.teamB?.reduce((x, y) => {
              return x + y.totalYellowCards;
            }, 0) || 0,
            match.stadistics?.teamB?.reduce((x, y) => {
              return x + y.totalRedCards;
            }, 0) || 0,
            match.score?.teamB || 0,
          ],
        ],
      },
    };
  }

  getExtraGoles(match: MatchEntity): any {
    return {
      margin: [0, 10, 0, 10],

      columns: [
        {
          table: {
            widths: ['auto', 10],

            body: [[{ text: 'Goles extra', fillColor: background, bold: true }]],
          },
        },
        {
          table: {
            widths: ['auto', 10],

            body: [[{ text: 'Goles extra', fillColor: background, bold: true }]],
          },
        },
      ],
    };
  }
  private getPhotosFromMatch(param: {
    match: MatchEntity;
    teamA: TeamEntity;
    teamB: TeamEntity;
    tournament: TournamentEntity;
    organization: OrganizationEntity;
  }) {
    const { teamA, teamB, organization } = param;
    const $shieldA = this.getImage(teamA.shield || '', true);
    const $shieldB = this.getImage(teamB.shield || '', true);

    const $brandIso = this.getImage('deporty/brand/iso.jpg');
    const $organizationIso = this.getImage(organization.iso, true);

    return { $shieldA, $shieldB, $brandIso, $organizationIso };
  }

  createTeamsHeaders(param: { shield64A: string; shield64B: string; teamA: TeamEntity; teamB: TeamEntity }): any {
    const { shield64A, teamA, teamB, shield64B } = param;
    return {
      table: {
        widths: [30, '*', 30, '*'],
        body: [
          [
            {
              image: shield64A,
              width: 30,
              height: 30,
            },
            { text: teamA.name, margin: [0, 10, 0, 0] },
            {
              image: shield64B,
              width: 30,
              height: 30,
            },
            { text: teamB.name, margin: [0, 10, 0, 0] },
          ],
        ],
      },
    };
  }
  createGeneralMatchInformation(match: MatchEntity, tournament: TournamentEntity): any {
    const date = match.date ? moment(match.date as any).toDate() : '';

    return {
      style: 'w-100',

      table: {
        widths: ['*', 100, 100, 100],

        body: [
          [
            {
              text: 'Sede',
              fillColor: background,
              alignment: 'center',
              bold: true,
            },
            {
              text: 'Fecha',
              fillColor: background,
              alignment: 'center',
              bold: true,
            },
            {
              text: 'Hora',
              fillColor: background,
              alignment: 'center',
              bold: true,
            },
            {
              text: 'Categoría',
              fillColor: background,
              bold: true,
            },
          ],
          [
            {
              text: `${match.locationId || ''} ${match.playground?.name || ''}`,
              alignment: 'center',
            },
            {
              text: date != '' ? moment(date).format('DD/MM/YYYY') : '',
              alignment: 'center',
            },
            {
              text: date != '' ? moment(date).format('HH:mm') : '',
              alignment: 'center',
            },
            { text: tournament.category, alignment: 'center' },
          ],
        ],
      },
    };
  }
  createHeaderDefinition(brand64: string, organization64: string, tournamentLayout: TournamentLayoutEntity): any {
    return {
      margin: [0, 0, 0, 20],
      layout: 'noBorders',
      table: {
        widths: [60, '*', 60],
        body: [
          [
            {
              image: brand64,
              width: 60,
              height: 60,
            },
            {
              text: tournamentLayout.name,
              alignment: 'center',
              fontSize: 17,
              // color: '#e84c40',
              margin: [0, 30, 0, 20],
            },
            {
              image: organization64,
              width: 60,
              height: 60,
            },
          ],
        ],
      },
    };
  }

  private extractPlayerForm(
    match: MatchEntity,
    team: 'teamA' | 'teamB',
    fullMembers: {
      teamA: any;
      teamB: any;
    }
  ) {
    if (!match.stadistics) {
      return [];
    }

    const response = {
      margin: [0, 10, 0, 10],
      alignment: 'right',

      table: {
        alignment: 'center',

        widths: [30, 'auto', 10, 10, 10],

        body: [
          [
            { text: '#', alignment: 'center', fillColor: background },
            {
              text: 'Nombre Completo',
              alignment: 'center',
              fillColor: background,
              bold: true,
            },
            {
              text: 'A',
              alignment: 'center',
              fillColor: '#F3F30C',
              bold: true,
            },
            {
              text: 'R',
              alignment: 'center',
              fillColor: '#F00',
              bold: true,
            },
            {
              text: 'G',
              alignment: 'center',
              fillColor: '#008000',
              color: '#FFFFFF',
              bold: true,
            },
          ],
          ...(match.playerForm
            ? match.playerForm[team]?.map((memberId: string) => {
                const user = fullMembers[team][memberId].user;
                const stadistics = match.stadistics
                  ? match.stadistics[team]
                      ?.filter((s) => {
                        return s.memberId == memberId;
                      })
                      .pop() || {
                      totalYellowCards: 0,
                      totalRedCards: 0,
                      totalGoals: 0,
                    }
                  : {
                      totalYellowCards: 0,
                      totalRedCards: 0,
                      totalGoals: 0,
                    };
                return [
                  {
                    text: fullMembers[team][memberId].member.number || '',
                    alignment: 'center',
                  },
                  {
                    text: `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`,
                    alignment: 'left',
                    decoration: match.playerForm ? '' : 'lineThrough',
                  },
                  {
                    text: stadistics.totalYellowCards > 0 ? stadistics?.totalYellowCards : '',
                    alignment: 'center',
                  },
                  {
                    text: stadistics.totalRedCards > 0 ? stadistics?.totalRedCards : '',
                    alignment: 'center',
                  },
                  {
                    text: stadistics.totalGoals > 0 ? stadistics?.totalGoals : '',
                    alignment: 'center',
                  },
                ];
              }) || [['', '', '', '', '']]
            : []),
        ],
      },
    };

    return response;
  }

  createTechnicalDirector(match: MatchEntity) {
    return {
      margin: [0, 10, 0, 10],
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'Cuerpo Técnico',
              fillColor: background,
              alignment: 'center',
              bold: true,
            },
            {
              text: 'Cuerpo Técnico',
              fillColor: background,
              alignment: 'center',
              bold: true,
            },
          ],
          [
            '',
            '',
            // (match.teamA.technicalDirector?.user.name || '') +
            //   ' ' +
            //   (match.teamA.technicalDirector?.user.lastName || ''),
            // (match.teamB.technicalDirector?.user.name || '') +
            //   ' ' +
            //   (match.teamB.technicalDirector?.user.lastName || ''),
          ],
        ],
      },
    };
  }

  getMember(match: MatchEntity, b: StadisticSpecification, team: 'teamB' | 'teamA') {
    return {
      number: 8,
      player: {
        name: '4',
        lastName: 'Ospina',
      },
    };
    // return match[team].members?.filter((_) => _.player.id == b.player.id).pop();
  }
  createDoc(docDefinition: any) {
    // var fonts = {
    //   Roboto: {
    //     normal: `${__dirname}/fonts/Roboto-Regular.ttf`,
    //     bold: `${__dirname}/fonts/Roboto-Medium.ttf`,
    //     italics: `${__dirname}/fonts/Roboto-Italic.ttf`,
    //     bolditalics: `${__dirname}/fonts/Roboto-MediumItalic.ttf`,
    //   },
    // };

    var fonts = {
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic',
      },
      Symbol: {
        normal: 'Symbol',
      },
      ZapfDingbats: {
        normal: 'ZapfDingbats',
      },
    };

    return from(
      new Promise((resolve, reject) => {
        var printer = new pdfmake(fonts);
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        var chunks: any[] = [];
        pdfDoc.on('data', function (chunk: any) {
          chunks.push(chunk);
        });
        pdfDoc.on('end', function () {
          const result = Buffer.concat(chunks);
          const data = 'data:application/pdf;base64,' + result.toString('base64');
          resolve(data);
        });
        pdfDoc.end();
      })
    );
  }
}
