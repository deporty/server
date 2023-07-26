"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMatchSheetUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../../core/helpers");
const usecase_1 = require("../../../../core/usecase");
const pdfmake = require('pdfmake');
const moment = require('moment');
const background = '#ccc';
class CreateMatchSheetUsecase extends usecase_1.Usecase {
    constructor(fileAdapter, getTournamentByIdUsecase, organizationContract, teamContract) {
        super();
        this.fileAdapter = fileAdapter;
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.organizationContract = organizationContract;
        this.teamContract = teamContract;
    }
    call(param) {
        const match = param.match;
        return this.getTournamentByIdUsecase.call(param.tournamentId).pipe((0, operators_1.mergeMap)((tournament) => {
            const $organization = this.organizationContract.getOrganizationById(tournament.organizationId);
            const $teamA = this.teamContract.getTeamById(match.teamAId);
            const $teamB = this.teamContract.getTeamById(match.teamBId);
            const $tournamentLayout = this.organizationContract.getTournamentLayoutByIdUsecase(tournament.organizationId, tournament.tournamentLayoutId);
            const $fullMembers = this.getFullMembers(match);
            return (0, rxjs_1.zip)($organization, $teamA, $teamB, (0, rxjs_1.of)(tournament), $tournamentLayout, $fullMembers);
        }), (0, operators_1.mergeMap)(([organization, teamA, teamB, tournament, tournamentLayout, fullMembers,]) => {
            return this.createDocDefinition({
                match,
                teamA,
                teamB,
                tournament,
                organization,
                tournamentLayout,
                fullMembers,
            }).pipe((0, operators_1.mergeMap)((docDefinition) => {
                return this.createDoc(docDefinition);
            }));
        }));
    }
    getImage(url, direct = false) {
        if (direct) {
            return !!url && url !== '' ? (0, helpers_1.downloadImageFromURL)(url) : (0, rxjs_1.of)('');
        }
        return !!url && url !== ''
            ? this.fileAdapter.getAbsoluteHTTPUrl(url).pipe((0, operators_1.mergeMap)((x) => {
                return (0, helpers_1.downloadImageFromURL)(x || url);
            }))
            : (0, rxjs_1.of)('');
    }
    getSignatures(match) {
        const $captainASignature = this.getImage(match.captainASignature);
        const $captainBSignature = this.getImage(match.captainBSignature);
        const $judgeSignature = this.getImage(match.judgeSignature);
        return (0, rxjs_1.zip)($captainASignature, $captainBSignature, $judgeSignature);
    }
    makeStyles() {
        return {
            shadow: {
                background: '#aaa',
            },
        };
    }
    getFullMembers(match) {
        var _a, _b, _c, _d, _e, _f;
        const $teamA = ((_a = match.playerForm) === null || _a === void 0 ? void 0 : _a.teamA) && ((_b = match.playerForm) === null || _b === void 0 ? void 0 : _b.teamA.length) > 0
            ? (0, rxjs_1.zip)(...(_c = match.playerForm) === null || _c === void 0 ? void 0 : _c.teamA.map((id) => {
                return this.teamContract.getMemberById(match.teamAId, id);
            }))
            : (0, rxjs_1.of)([]);
        const $teamB = ((_d = match.playerForm) === null || _d === void 0 ? void 0 : _d.teamB) && ((_e = match.playerForm) === null || _e === void 0 ? void 0 : _e.teamB.length) > 0
            ? (0, rxjs_1.zip)(...(_f = match.playerForm) === null || _f === void 0 ? void 0 : _f.teamB.map((id) => {
                return this.teamContract.getMemberById(match.teamBId, id);
            }))
            : (0, rxjs_1.of)([]);
        return (0, rxjs_1.zip)($teamA, $teamB).pipe((0, operators_1.map)(([teamA, teamB]) => {
            const members = {
                teamA: teamA.reduce((prev, curr) => {
                    prev[curr.member.id] = curr;
                    return prev;
                }, {}),
                teamB: teamB.reduce((prev, curr) => {
                    prev[curr.member.id] = curr;
                    return prev;
                }, {}),
            };
            return members;
        }));
    }
    createDocDefinition(param) {
        const { match, tournament, organization, teamA, teamB, tournamentLayout, fullMembers, } = param;
        const { $shieldA, $shieldB, $brandIso, $organizationIso } = this.getPhotosFromMatch({
            match,
            tournament,
            organization,
            teamA,
            teamB,
        });
        const $shields = (0, rxjs_1.zip)($shieldA, $shieldB, $brandIso, $organizationIso);
        const $signatures = this.getSignatures(match);
        return (0, rxjs_1.zip)($shields, $signatures).pipe((0, operators_1.map)(([shields, signatures]) => {
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
                        columns: [
                            this.extractPlayerForm(match, 'teamA', fullMembers),
                            this.extractPlayerForm(match, 'teamB', fullMembers),
                        ],
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
                                [
                                    this.createSignature(signatureA),
                                    this.createSignature(signatureJudge),
                                    this.createSignature(signatureB),
                                ],
                            ],
                        },
                    },
                ],
            };
        }));
    }
    createSignature(signature) {
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
    getConsolidatedResults(match) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
            table: {
                widths: ['*', 10, 10, 10, '*', 10, 10, 10],
                body: [
                    [
                        { text: 'TOTAL', fillColor: background, bold: true },
                        ((_b = (_a = match.stadistics) === null || _a === void 0 ? void 0 : _a.teamA) === null || _b === void 0 ? void 0 : _b.reduce((x, y) => {
                            return x + y.totalYellowCards;
                        }, 0)) || 0,
                        ((_d = (_c = match.stadistics) === null || _c === void 0 ? void 0 : _c.teamA) === null || _d === void 0 ? void 0 : _d.reduce((x, y) => {
                            return x + y.totalRedCards;
                        }, 0)) || 0,
                        ((_e = match.score) === null || _e === void 0 ? void 0 : _e.teamA) || 0,
                        { text: 'TOTAL', fillColor: background, bold: true },
                        ((_g = (_f = match.stadistics) === null || _f === void 0 ? void 0 : _f.teamB) === null || _g === void 0 ? void 0 : _g.reduce((x, y) => {
                            return x + y.totalYellowCards;
                        }, 0)) || 0,
                        ((_j = (_h = match.stadistics) === null || _h === void 0 ? void 0 : _h.teamB) === null || _j === void 0 ? void 0 : _j.reduce((x, y) => {
                            return x + y.totalRedCards;
                        }, 0)) || 0,
                        ((_k = match.score) === null || _k === void 0 ? void 0 : _k.teamB) || 0,
                    ],
                ],
            },
        };
    }
    getExtraGoles(match) {
        return {
            margin: [0, 10, 0, 10],
            columns: [
                {
                    table: {
                        widths: ['auto', 10],
                        body: [
                            [{ text: 'Goles extra', fillColor: background, bold: true }],
                        ],
                    },
                },
                {
                    table: {
                        widths: ['auto', 10],
                        body: [
                            [{ text: 'Goles extra', fillColor: background, bold: true }],
                        ],
                    },
                },
            ],
        };
    }
    getPhotosFromMatch(param) {
        const { teamA, teamB, organization } = param;
        const $shieldA = this.getImage(teamA.shield || '', true);
        const $shieldB = this.getImage(teamB.shield || '', true);
        const $brandIso = this.getImage('deporty/brand/iso.jpg');
        const $organizationIso = this.getImage(organization.iso, true);
        return { $shieldA, $shieldB, $brandIso, $organizationIso };
    }
    createTeamsHeaders(param) {
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
    createGeneralMatchInformation(match, tournament) {
        var _a;
        const date = match.date ? moment(match.date).toDate() : '';
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
                            text: `${match.locationId || ''} ${((_a = match.playground) === null || _a === void 0 ? void 0 : _a.name) || ''}`,
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
    createHeaderDefinition(brand64, organization64, tournamentLayout) {
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
    extractPlayerForm(match, team, fullMembers) {
        var _a;
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
                        ? ((_a = match.playerForm[team]) === null || _a === void 0 ? void 0 : _a.map((memberId) => {
                            var _a;
                            const user = fullMembers[team][memberId].user;
                            const stadistics = match.stadistics
                                ? ((_a = match.stadistics[team]) === null || _a === void 0 ? void 0 : _a.filter((s) => {
                                    return s.memberId == memberId;
                                }).pop()) || {
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
                                    text: stadistics.totalYellowCards > 0
                                        ? stadistics === null || stadistics === void 0 ? void 0 : stadistics.totalYellowCards
                                        : '',
                                    alignment: 'center',
                                },
                                {
                                    text: stadistics.totalRedCards > 0
                                        ? stadistics === null || stadistics === void 0 ? void 0 : stadistics.totalRedCards
                                        : '',
                                    alignment: 'center',
                                },
                                {
                                    text: stadistics.totalGoals > 0 ? stadistics === null || stadistics === void 0 ? void 0 : stadistics.totalGoals : '',
                                    alignment: 'center',
                                },
                            ];
                        })) || [['', '', '', '', '']]
                        : []),
                ],
            },
        };
        return response;
    }
    createTechnicalDirector(match) {
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
    getMember(match, b, team) {
        return {
            number: 8,
            player: {
                name: '4',
                lastName: 'Ospina',
            },
        };
        // return match[team].members?.filter((_) => _.player.id == b.player.id).pop();
    }
    createDoc(docDefinition) {
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
        return (0, rxjs_1.from)(new Promise((resolve, reject) => {
            var printer = new pdfmake(fonts);
            var pdfDoc = printer.createPdfKitDocument(docDefinition);
            var chunks = [];
            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk);
            });
            pdfDoc.on('end', function () {
                const result = Buffer.concat(chunks);
                const data = 'data:application/pdf;base64,' + result.toString('base64');
                resolve(data);
            });
            pdfDoc.end();
        }));
    }
}
exports.CreateMatchSheetUsecase = CreateMatchSheetUsecase;
