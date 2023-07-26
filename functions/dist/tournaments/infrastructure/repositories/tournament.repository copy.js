"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentRepository = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../core/helpers");
const locations_constants_1 = require("../../../locations/infrastructure/locations.constants");
const team_constants_1 = require("../../../teams/infrastructure/team.constants");
const tournament_contract_1 = require("../../domain/tournament.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class TournamentRepository extends tournament_contract_1.TournamentContract {
    constructor(dataSource, tournamentMapper, fixtureStageMapper, registeredTeamMapper, groupMapper, nodeMatchMapper, firestore, teamContract, matchMapper, intergroupMatchMapper) {
        super();
        this.dataSource = dataSource;
        this.tournamentMapper = tournamentMapper;
        this.fixtureStageMapper = fixtureStageMapper;
        this.registeredTeamMapper = registeredTeamMapper;
        this.groupMapper = groupMapper;
        this.nodeMatchMapper = nodeMatchMapper;
        this.firestore = firestore;
        this.teamContract = teamContract;
        this.matchMapper = matchMapper;
        this.intergroupMatchMapper = intergroupMatchMapper;
        this.dataSource.entity = TournamentRepository.entity;
    }
    addIntergroupMatch(tournamentId, stageId, match) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .collection('intergroup-matches')
            .add(this.intergroupMatchMapper.toJson(match))).pipe((0, operators_1.map)((x) => { }));
    }
    editIntergroupMatch(tournamentId, stageId, match) {
        var _a;
        if (((_a = match.match) === null || _a === void 0 ? void 0 : _a.date) && typeof match.match.date == 'number') {
            match.match.date = (0, helpers_1.getDateFromSeconds)(match.match.date);
        }
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .collection('intergroup-matches')
            .doc(match.id)
            .update(this.intergroupMatchMapper.toJson(match))).pipe((0, operators_1.map)((x) => { }));
    }
    editNodeMatch(tournamentId, nodeMatch) {
        if (nodeMatch.match.date) {
            nodeMatch.match.date = (0, helpers_1.getDateFromSeconds)(nodeMatch.match.date);
        }
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('main-draw')
            .doc(nodeMatch.id)
            .update(this.nodeMatchMapper.toJson(nodeMatch))).pipe((0, operators_1.map)((x) => { }));
    }
    getIntergroupMatch(tournamentId, stageId, nodeMatchId) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .collection('intergroup-matches')
            .doc(nodeMatchId)
            .get()).pipe((0, operators_1.map)(helpers_1.unifyData), (0, operators_1.map)((x) => (0, helpers_1.mapInsideReferences)(x)), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
            return x ? this.intergroupMatchMapper.fromJson(x) : undefined;
        }));
    }
    getIntergroupMatches(tournamentId, stageId) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .collection('intergroup-matches')
            .get()).pipe((0, operators_1.map)((x) => {
            return x.docs
                .map((y) => (0, helpers_1.unifyData)(y))
                .map(async (y) => {
                return Object.assign(Object.assign({}, y), { match: Object.assign(Object.assign({}, y.match), { location: y.match.location
                            ? await (0, rxjs_1.from)(y.match.location.get())
                                .pipe((0, operators_1.map)(helpers_1.unifyData))
                                .toPromise()
                            : undefined, 'team-a': await (0, rxjs_1.from)(y.match['team-a'].get())
                            .pipe((0, operators_1.map)(helpers_1.unifyData))
                            .toPromise(), 'team-b': await (0, rxjs_1.from)(y.match['team-b'].get())
                            .pipe((0, operators_1.map)(helpers_1.unifyData))
                            .toPromise() }) });
            });
        }), (0, operators_1.map)((x) => {
            return (0, rxjs_1.from)(Promise.all(x));
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
            if (x) {
                return x.map((y) => this.intergroupMatchMapper.fromJson(y));
            }
            return [];
        }));
    }
    saveTeamsIntoGroup(tournamentId, stageId, groupLabel, teams) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .get()).pipe((0, operators_1.map)(helpers_1.unifyData), (0, operators_1.map)((x) => (0, helpers_1.mapInsideReferences)(x)), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => this.fixtureStageMapper.fromJson(x)), (0, operators_1.map)((x) => {
            if (x) {
                const group = x.groups.filter((t) => t.label == groupLabel);
                const otherGroups = x.groups.filter((t) => t.label !== groupLabel);
                if (group) {
                    group[0].teams.push(...teams);
                }
                x.groups = [...group, ...otherGroups];
                return x;
            }
            return undefined;
        }), (0, operators_1.map)((x) => {
            return this.firestore
                .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
                .doc(tournamentId)
                .collection('fixture-stages')
                .doc(stageId)
                .update(this.fixtureStageMapper.toJson(x));
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => { }));
    }
    getGroupOverview(tournamentId, stageId, groupLabel) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .get()).pipe((0, operators_1.map)(helpers_1.unifyData), (0, operators_1.map)((stage) => {
            if (stage && stage.groups) {
                const currentGroup = stage.groups.filter((x) => {
                    return x.label == groupLabel;
                });
                if (currentGroup.length > 0) {
                    return this.groupMapper.fromJsonOverview(currentGroup[0]);
                }
            }
            return undefined;
        }));
    }
    getNodeMatch(tournamentId, nodeMatchId) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('main-draw')
            .doc(nodeMatchId)
            .get()).pipe((0, operators_1.map)((x) => {
            return Object.assign(Object.assign({}, x.data()), { id: x.id });
        }), (0, operators_1.map)((x) => {
            return x ? (0, helpers_1.mapInsideReferences)(x) : (0, rxjs_1.of)(undefined);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
            return x ? this.nodeMatchMapper.fromJson(x) : undefined;
        }));
    }
    getMainDrawMatches(tournamentId) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('main-draw')
            .get()).pipe((0, operators_1.map)((querySnapshot) => {
            const data = querySnapshot.docs;
            if (!!data) {
                return data.map((z) => {
                    return Object.assign(Object.assign({}, z.data()), { id: z.id });
                });
            }
            return undefined;
        }), (0, operators_1.map)((x) => {
            if (x) {
                this.dataSource.entity = team_constants_1.TEAMS_ENTITY;
                const mapped = x
                    .map(async (node) => {
                    return {
                        match: Object.assign(Object.assign({}, node['match']), { date: (0, helpers_1.getDateFromSeconds)(node['match']['date']), 'team-a': await this.dataSource
                                .getById(node['match']['team-a'].id)
                                .toPromise(), location: node['match']['location']
                                ? await (0, rxjs_1.from)(node['match']['location'].get())
                                    .pipe((0, operators_1.map)((t) => {
                                    return Object.assign(Object.assign({}, t.data()), { id: t.id });
                                }))
                                    .toPromise()
                                : undefined, 'team-b': await this.dataSource
                                .getById(node['match']['team-b'].id)
                                .toPromise() }),
                        key: node['key'],
                        level: node['level'],
                        id: node['id'],
                    };
                })
                    .map((x) => (0, rxjs_1.from)(x));
                return mapped.length > 0 ? (0, rxjs_1.zip)(...mapped) : (0, rxjs_1.of)([]);
            }
            return (0, rxjs_1.of)(undefined);
        }), (0, operators_1.mergeMap)((y) => y), (0, operators_1.map)((x) => {
            return x ? x.map((y) => this.matchMapper.fromJson(y.match)) : [];
        }));
    }
    getMainDrawNodeMatchesOverview(tournamentId) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('main-draw')
            .get()).pipe((0, operators_1.map)((querySnapshot) => {
            const data = querySnapshot.docs;
            if (!!data) {
                return data.map((z) => {
                    return Object.assign(Object.assign({}, z.data()), { id: z.id });
                });
            }
            return undefined;
        }), (0, operators_1.map)((x) => {
            if (x) {
                this.dataSource.entity = team_constants_1.TEAMS_ENTITY;
                const mapped = x.map((node) => {
                    const $teamA = (0, rxjs_1.from)(node['match']['team-a'].get()).pipe((0, operators_1.map)(helpers_1.unifyData));
                    const $teamB = (0, rxjs_1.from)(node['match']['team-b'].get()).pipe((0, operators_1.map)(helpers_1.unifyData));
                    const $location = node['match']['location']
                        ? (0, rxjs_1.from)(node['match']['location'].get()).pipe((0, operators_1.map)(helpers_1.unifyData))
                        : (0, rxjs_1.of)(undefined);
                    return (0, rxjs_1.zip)($teamA, $teamB, (0, rxjs_1.of)(node), $location).pipe((0, operators_1.map)((j) => {
                        const node = j[2];
                        return Object.assign(Object.assign({}, node), { match: Object.assign(Object.assign({}, node['match']), { 'team-a': j[0], 'team-b': j[1], location: j[3] }) });
                    }));
                });
                return mapped.length > 0 ? (0, rxjs_1.zip)(...mapped) : (0, rxjs_1.of)([]);
            }
            return (0, rxjs_1.of)(undefined);
        }), (0, operators_1.mergeMap)((y) => y), (0, operators_1.map)((x) => {
            return x ? x.map((node) => this.nodeMatchMapper.fromJson(node)) : [];
        }), (0, operators_1.map)((x) => {
            return x;
        }));
    }
    getAllMatchesWithTeams(tournamentId, stageId) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .get()).pipe((0, operators_1.map)((stage) => {
            const data = stage.data();
            if (!!data) {
                return (0, rxjs_1.of)(Object.assign(Object.assign({}, data), { id: stage.id }));
            }
            return (0, rxjs_1.of)(undefined);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)(async (stage) => {
            let response = {};
            if (!!stage) {
                const groups = stage.groups || [];
                for (const group of groups) {
                    if (!response[group.label]) {
                        response[group.label] = [];
                    }
                    const matches = group.matches || [];
                    for (const match of matches) {
                        const teamA = await match['team-a'].get();
                        const teamB = await match['team-b'].get();
                        const location = match['location']
                            ? await match['location'].get()
                            : null;
                        const mappedTeamA = Object.assign(Object.assign({}, teamA.data()), { id: teamA.id });
                        delete mappedTeamA['members'];
                        const mappedTeamB = Object.assign(Object.assign({}, teamB.data()), { id: teamB.id });
                        delete mappedTeamB['members'];
                        const mappedLocation = location
                            ? Object.assign(Object.assign({}, location.data()), { id: location.id }) : null;
                        response[group.label].push({
                            date: (0, helpers_1.getDateFromSeconds)(match.date),
                            score: match.score,
                            teamA: mappedTeamA,
                            teamB: mappedTeamB,
                            location: mappedLocation ? mappedLocation : null,
                            playground: match.playground,
                        });
                    }
                }
            }
            return response;
        }), (0, operators_1.map)((promise) => {
            return (0, rxjs_1.from)(promise);
        }), (0, operators_1.mergeMap)((x) => x));
    }
    get() {
        this.dataSource.entity = TournamentRepository.entity;
        return this.dataSource
            .getByFilter([])
            .pipe();
    }
    getById(id) {
        this.dataSource.entity = TournamentRepository.entity;
        return this.dataSource.getById(id).pipe((0, operators_1.map)((x) => {
            if (x.locations) {
                this.dataSource.entity = 'locations';
                const locations = x.locations.map((y) => this.dataSource.getById(y.id));
                return (0, rxjs_1.zip)((0, rxjs_1.of)(x), ...locations);
            }
            return (0, rxjs_1.zip)((0, rxjs_1.of)(x));
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((tournament) => {
            if (tournament) {
                const newTournament = Object.assign(Object.assign({}, tournament[0]), { locations: tournament.length > 1
                        ? tournament.splice(1, tournament.length)
                        : [] });
                return this.tournamentMapper.fromJsonOverview(newTournament);
            }
            return undefined;
        }));
    }
    getByIdPopulate(id) {
        this.dataSource.entity = TournamentRepository.entity;
        return this.dataSource.getByIdPopulate(id, ['fixture-stages']).pipe((0, operators_1.map)((tournament) => {
            return this.tournamentMapper.fromReferenceJson(tournament);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
            const temp = Object.assign(Object.assign({}, x), { fixture: {
                    'fixture-stages': x['fixture-stages'],
                } });
            return this.tournamentMapper.fromJson(temp);
        }));
    }
    getByFilter(filters) {
        const newFilters = filters.map((filter) => {
            if (filter.property === 'organization') {
                return {
                    property: filter.property,
                    equals: this.firestore.collection('organizations').doc(filter.equals),
                };
            }
            return filter;
        });
        return this.dataSource.getByFilter(newFilters).pipe((0, operators_1.map)((tournaments) => {
            return tournaments.map((tournament) => {
                return this.tournamentMapper.fromReferenceJson(tournament);
            });
        }), (0, operators_1.map)((tour) => {
            if (tour && tour.length > 0) {
                return (0, rxjs_1.zip)(...tour);
            }
            else {
                return (0, rxjs_1.of)([]);
            }
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((data) => {
            return data.map((x) => this.tournamentMapper.fromJson(x));
        }));
    }
    getRegisteredTeams(tournamentId) {
        return (0, rxjs_1.from)(this.firestore.collection(tournaments_constants_1.TOURNAMENTS_ENTITY).doc(tournamentId).get()).pipe((0, operators_1.map)((data) => {
            const allData = data.data();
            if (!!allData) {
                const items = allData['registered-teams'] || [];
                const newItems = [];
                for (const item of items) {
                    const response = this.teamContract.getById(item['team']['id']).pipe((0, operators_1.map)((d) => {
                        return {
                            team: {
                                name: d['name'],
                                id: d['id'],
                                'mini-shield': d['mini-shield'],
                            },
                            'enrollment-date': (0, helpers_1.getDateFromSeconds)(item['enrollment-date']),
                        };
                    }));
                    newItems.push(response);
                }
                return !!newItems.length ? (0, rxjs_1.zip)(...newItems) : (0, rxjs_1.of)([]);
            }
            return (0, rxjs_1.of)(undefined);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((allItems) => {
            if (allItems != undefined) {
                return allItems.map((x) => this.registeredTeamMapper.fromJson(x));
            }
            else {
                return undefined;
            }
        }));
    }
    getGroup(tournamentId, stageId, groupLabel) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .get()).pipe((0, operators_1.map)((stage) => {
            return Object.assign(Object.assign({}, stage.data()), { id: stage.id });
        }), (0, operators_1.map)((stage) => {
            const group = stage['groups']
                .filter((x) => {
                return x.label == groupLabel;
            })
                .pop();
            if (!!group) {
                return (0, rxjs_1.of)(group);
            }
            return (0, rxjs_1.of)(null);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((group) => {
            this.dataSource.entity = locations_constants_1.LOCATIONS_ENTITY;
            const matches = group['matches'].map((match) => {
                const tempMatch = Object.assign({}, match);
                return tempMatch.location
                    ? this.dataSource.getById(tempMatch.location.id).pipe((0, operators_1.map)((y) => {
                        return Object.assign(Object.assign({}, tempMatch), { location: y });
                    }))
                    : (0, rxjs_1.of)(tempMatch);
            });
            this.dataSource.entity = team_constants_1.TEAMS_ENTITY;
            const teams = group['teams'].map((team) => {
                return this.dataSource.getById(team.id).pipe((0, operators_1.map)((y) => {
                    return Object.assign({}, y);
                }));
            });
            const extract = (col) => col.length > 0 ? (0, rxjs_1.zip)(...col) : (0, rxjs_1.of)([]);
            const base = [(0, rxjs_1.of)(group)];
            base.push(extract(teams));
            base.push(extract(matches));
            return (0, rxjs_1.zip)(...base);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)(([group, teams, matches]) => {
            const newGroup = Object.assign(Object.assign({}, group), { teams,
                matches });
            return !!newGroup ? this.groupMapper.fromJson(newGroup) : undefined;
        }));
    }
    save(team) {
        throw new Error('Method not implemented.');
    }
    delete(id) {
        throw new Error('Method not implemented.');
    }
    update(id, tournament) {
        this.dataSource.entity = TournamentRepository.entity;
        // fs.writeFileSync('one-piece2.json', JSON.stringify(tournament, null, 2));
        const mappedTournament = this.tournamentMapper.toJson(tournament);
        // fs.writeFileSync(
        //   'one-piece.json',
        //   JSON.stringify(mappedTournament, null, 2)
        // );
        const relations = {
            'fixture-stages': {
                path: ['fixture', 'fixture-stages'],
                items: mappedTournament.fixture['fixture-stages'],
            },
        };
        return this.dataSource.update(id, mappedTournament, relations);
    }
    getFixtureOverviewByTournamentId(tournamentId) {
        const doc = this.firestore.collection(tournaments_constants_1.TOURNAMENTS_ENTITY).doc(tournamentId);
        return (0, helpers_1.mapFromSnapshot)(doc.collection('fixture-stages').get(), (x) => this.fixtureStageMapper.fromJson(x)).pipe((0, operators_1.map)((fixtureStages) => {
            return {
                stages: fixtureStages,
            };
        }));
    }
    getAllSummaryTournaments() {
        return (0, helpers_1.mapFromSnapshot)(this.firestore.collection(tournaments_constants_1.TOURNAMENTS_ENTITY).get(), (x) => this.tournamentMapper.fromJsonOverview(x));
    }
    getTournamentSummaryById(id) {
        throw new Error('');
        // const docReference: DocumentReference<DocumentData> = doc(
        //   this.collectionRef,
        //   id
        // );
        // const tournamentDoc: Promise<DocumentSnapshot<DocumentData>> =
        //   getDoc(docReference);
        // return from(tournamentDoc).pipe(
        //   map((doc: DocumentSnapshot) => {
        //     return { ...doc.data(), id: doc.id };
        //   }),
        //   map(this.tournamentMapper.fromJson)
        // );
    }
    getCurrentTournamentSummaryByLocation(location) {
        throw new Error('');
        // const tournamentDoc: Promise<QuerySnapshot<DocumentData>> = getDocs(
        //   query(this.collectionRef, where('location', '==', location), limit(1))
        // );
        // return from(tournamentDoc).pipe(
        //   map((doc: QuerySnapshot) => {
        //     return { ...doc.docs[0].data(), id: doc.docs[0].id };
        //   }),
        //   map(this.tournamentMapper.fromJson)
        // );
    }
    getTournamentFixtureStagesById(id) {
        throw new Error('');
        // const docReference1: DocumentReference<DocumentData> = doc(
        //   this.collectionRef,
        //   id
        // );
        // const a = collection(
        //   firestore,
        //   TournamentService.collection,
        //   id,
        //   'fixture-stages'
        // );
        // const docReference: Promise<QuerySnapshot<DocumentData>> = getDocs(a);
        // return from(docReference).pipe(
        //   map((snapshot: QuerySnapshot<DocumentData>) => {
        //     return snapshot.docs.map((doc) => {
        //       const data = { ...doc.data(), id: doc.id };
        //       return this.fixtureStageMapper.fromJson(data);
        //     });
        //   })
        // );
    }
    getGroupsMatchesByTournamentId(tournamentId, stageIndex, groupIndex) {
        throw new Error('Method not implemented.');
    }
    addTeamToGroupTournament(tournamentId, stageId, groupIndex, teams) {
        throw new Error('');
        // const stageDoc = doc(
        //   firestore,
        //   TournamentService.collection,
        //   tournamentId,
        //   'fixture-stages',
        //   stageId
        // );
        // return new Observable((observer) => {
        //   from(getDoc(stageDoc)).subscribe((data) => {
        //     const docu = { ...data.data() };
        //     if (!docu.groups[groupIndex].teams) {
        //       docu.groups[groupIndex].teams = [];
        //     }
        //     if (!docu.groups[groupIndex].matches) {
        //       docu.groups[groupIndex].matches = [];
        //     }
        //     for (const team of teams) {
        //       let isExists = false;
        //       for (const _team of docu.groups[groupIndex].teams) {
        //         isExists = _team['name'] == team['name'];
        //         if (isExists) {
        //           break;
        //         }
        //       }
        //       if (!isExists) {
        //         (docu.groups[groupIndex].teams as any[]).push({
        //           id: team.id,
        //           name: team.name,
        //           shield: team.shield || '',
        //         });
        //       }
        //     }
        //     from(setDoc(stageDoc, docu)).subscribe(() => {
        //       observer.next();
        //       observer.complete();
        //     });
        //   });
        // });
    }
    createGroupInsideTournament(tournamentId, stageId, group) {
        throw new Error('');
        // const stageDoc = doc(
        //   firestore,
        //   TournamentService.collection,
        //   tournamentId,
        //   'fixture-stages',
        //   stageId
        // );
        // return new Observable((observer) => {
        //   from(getDoc(stageDoc)).subscribe((data) => {
        //     const docu = { ...data.data() };
        //     for (const team of group.teams) {
        //       team.members = undefined;
        //     }
        //     (docu.groups as any[]).push(this.groupMapper.toJson(group as any));
        //     from(setDoc(stageDoc, docu)).subscribe(() => {
        //       observer.next();
        //       observer.complete();
        //     });
        //   });
        // });
    }
    addMatchToGroupInsideTournament(tournamentId, stageId, groupIndex, teamAId, teamBId, date) {
        const ref = this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId);
        return (0, rxjs_1.from)(ref.get()).pipe((0, operators_1.map)(helpers_1.unifyData), (0, operators_1.map)((x) => {
            const indexG = x.groups.findIndex((y) => {
                return y.order == groupIndex;
            });
            const tempMatch = {
                date: (0, helpers_1.getDateFromSeconds)(date),
                'team-a': this.firestore.collection('teams').doc(teamAId),
                'team-b': this.firestore.collection('teams').doc(teamBId),
            };
            if (!x.groups[indexG].matches) {
                x.groups[indexG].matches = [];
            }
            x.groups[indexG].matches.push(tempMatch);
            return (0, rxjs_1.from)(ref.update(x)).pipe(
            // map(d=>{
            //   return mapInsideReferences(x)
            // }),
            // mergeMap(t=>t),
            (0, operators_1.map)((y) => {
                return this.fixtureStageMapper.fromJson(x);
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
    editMatchOfGroupInsideTournament(tournamentId, stageId, groupIndex, match) {
        const ref = this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId);
        return (0, rxjs_1.from)(ref.get()).pipe((0, operators_1.map)(helpers_1.unifyData), (0, operators_1.map)((x) => {
            const indexG = x.groups.findIndex((y) => {
                return y.order == groupIndex;
            });
            const currentGroup = x.groups[indexG];
            let index = 0;
            for (const _match of [...currentGroup.matches]) {
                const isMatch = (_match['team-a'].id == match.teamA.id &&
                    _match['team-b'].id == match.teamB.id) ||
                    (_match['team-a'].id == match.teamB.id &&
                        _match['team-b'].id == match.teamA.id);
                index += 1;
                if (isMatch) {
                    break;
                }
            }
            index -= 1;
            x.groups[indexG].matches[index] = this.matchMapper.toJson(match);
            return (0, rxjs_1.from)(ref.update(x)).pipe((0, operators_1.map)((y) => {
                return this.fixtureStageMapper.fromJson(x);
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
    getGroupMatchByTeams(tournamentId, stageId, groupLabel, teamAId, teamBId) {
        return (0, rxjs_1.from)(this.firestore
            .collection(tournaments_constants_1.TOURNAMENTS_ENTITY)
            .doc(tournamentId)
            .collection('fixture-stages')
            .doc(stageId)
            .get()).pipe((0, operators_1.map)((stage) => {
            return Object.assign(Object.assign({}, stage.data()), { id: stage.id });
        }), (0, operators_1.map)((stage) => {
            const group = stage['groups']
                .filter((x) => {
                return x.label == groupLabel;
            })
                .pop();
            if (!!group) {
                return (0, rxjs_1.of)(group);
            }
            return (0, rxjs_1.of)(null);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((group) => {
            const match = group['matches'].filter((match) => {
                return ((match['team-a'].id === teamAId &&
                    match['team-b'].id === teamBId) ||
                    (match['team-b'].id === teamAId && match['team-a'].id === teamBId));
            });
            return match.pop();
        }), (0, operators_1.map)((match) => {
            this.dataSource.entity = locations_constants_1.LOCATIONS_ENTITY;
            return !!match && match.location
                ? this.dataSource.getById(match.location.id).pipe((0, operators_1.map)((y) => {
                    return Object.assign(Object.assign({}, match), { location: y, date: (0, helpers_1.getDateFromSeconds)(match.date) });
                }))
                : (0, rxjs_1.of)(match);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((match) => {
            if (match != undefined) {
                const $teamA = (0, rxjs_1.from)(match['team-a'].get()).pipe((0, operators_1.map)((c) => {
                    return (0, helpers_1.mapInsideReferences)((0, helpers_1.unifyData)(c));
                }), (0, operators_1.mergeMap)((c) => c));
                const $teamB = (0, rxjs_1.from)(match['team-b'].get()).pipe((0, operators_1.map)((c) => {
                    return (0, helpers_1.mapInsideReferences)((0, helpers_1.unifyData)(c));
                }), (0, operators_1.mergeMap)((c) => c));
                // const $teamB = this.matchMapper.fromReferenceJson(match['team-b']);
                // const $teamB = ;
                return (0, rxjs_1.zip)((0, rxjs_1.of)(match), $teamA, $teamB);
            }
            return match;
        }), (0, operators_1.mergeMap)((c) => c), (0, operators_1.map)((zipped) => {
            if (zipped) {
                const match = Object.assign(Object.assign({}, zipped[0]), { 'team-a': zipped[1], 'team-b': zipped[2] });
                return this.matchMapper.fromJson(match);
            }
            console.log('COntract ', zipped);
            return zipped;
        }));
    }
}
exports.TournamentRepository = TournamentRepository;
TournamentRepository.entity = tournaments_constants_1.TOURNAMENTS_ENTITY;
