"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentRepository = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const tournament_contract_1 = require("../../tournament.contract");
class TournamentRepository extends tournament_contract_1.TournamentContract {
    constructor(dataSource, tournamentMapper, firestore) {
        super();
        this.dataSource = dataSource;
        this.tournamentMapper = tournamentMapper;
        this.firestore = firestore;
        this.dataSource.entity = TournamentRepository.entity;
    }
    get() {
        this.dataSource.entity = TournamentRepository.entity;
        return this.dataSource
            .getByFilter([])
            .pipe();
    }
    getById(id) {
        this.dataSource.entity = TournamentRepository.entity;
        return this.dataSource.getById(id).pipe((0, operators_1.map)((tournament) => {
            return tournament
                ? this.tournamentMapper.fromJson(tournament)
                : undefined;
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
    getAllSummaryTournaments() {
        throw new Error('');
        // return from(getDocs(this.collectionRef)).pipe(
        //   map((snapshot) => {
        //     return snapshot.docs
        //       .map((doc) => {
        //         return { ...doc.data(), id: doc.id };
        //       })
        //       .map(this.tournamentMapper.fromJson);
        //   })
        // );
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
    addMatchToGroupInsideTournament(tournamentId, stageId, groupIndex, match) {
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
        //     const matchDB = this.matchMapper.toWeakJson(match);
        //     if (!docu.groups[groupIndex].matches) {
        //       docu.groups[groupIndex].matches = [];
        //     }
        //     let isPresent = false;
        //     for (const _match of docu.groups[groupIndex].matches) {
        //       isPresent =
        //         (_match['team-a'].name == match.teamA.name &&
        //           _match['team-b'].name == match.teamB.name) ||
        //         (_match['team-a'].name == match.teamB.name &&
        //           _match['team-b'].name == match.teamA.name);
        //       if (isPresent) {
        //         break;
        //       }
        //     }
        //     if (!isPresent) {
        //       docu.groups[groupIndex].matches.push(matchDB);
        //       from(setDoc(stageDoc, docu)).subscribe(() => {
        //         observer.next();
        //         observer.complete();
        //       });
        //     } else {
        //       observer.next();
        //       observer.complete();
        //     }
        //   });
        // });
    }
    editMatchOfGroupInsideTournament(tournamentId, stageId, groupIndex, match) {
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
        //     const matchDB = this.matchMapper.toWeakJson(match);
        //     if (!docu.groups[groupIndex].matches) {
        //       docu.groups[groupIndex].matches = [];
        //     }
        //     let index = 0;
        //     for (const _match of [...docu.groups[groupIndex].matches]) {
        //       const isMatch =
        //         (_match['team-a'].name == match.teamA.name &&
        //           _match['team-b'].name == match.teamB.name) ||
        //         (_match['team-a'].name == match.teamB.name &&
        //           _match['team-b'].name == match.teamA.name);
        //       index += 1;
        //       if (isMatch) {
        //         break;
        //       }
        //     }
        //     index -= 1;
        //     docu.groups[groupIndex].matches[index] = matchDB;
        //     from(updateDoc(stageDoc, docu)).subscribe(() => {
        //       observer.next();
        //       observer.complete();
        //     });
        //   });
        // });
    }
}
exports.TournamentRepository = TournamentRepository;
TournamentRepository.entity = 'tournaments';
