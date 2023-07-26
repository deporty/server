import { Container } from '../core/DI';
import { PlayerMapper } from './infrastructure/player.mapper';
import { PlayerRepository } from './infrastructure/repository/player.repository';
import { PlayerContract } from './player.contract';
import { CreatePlayerUsecase } from './usecases/create-player/create-player.usecase';
import { DeletePlayerUsecase } from './usecases/delete-player/delete-player.usecase';
import { GetPlayerByDocumentUsecase } from './usecases/get-player-by-document/get-player-by-document.usecase';
import { GetPlayerByEmailUsecase } from './usecases/get-player-by-email/get-player-by-email.usecase';
import { GetPlayerByIdUsecase } from './usecases/get-player-by-id/get-player-by-id.usecase';
export class PlayersModulesConfig {
  static config(container: Container) {
    container.add({
      id: 'PlayerMapper',
      kind: PlayerMapper,
      dependencies: ['Firestore'],
      strategy: 'singleton',
    });


    container.add({
      id: 'PlayerContract',
      kind: PlayerContract,
      override: PlayerRepository,
      dependencies: ['DataSource', 'PlayerMapper', 'FileAdapter'],
      strategy: 'singleton',
    });



    container.add({
      id: 'DeletePlayerUsecase',
      kind: DeletePlayerUsecase,
      dependencies: ['PlayerContract','FileAdapter','GetPlayerByIdUsecase'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetPlayerByDocumentUsecase',
      kind: GetPlayerByDocumentUsecase,
      dependencies: ['PlayerContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'GetPlayerByEmailUsecase',
      kind: GetPlayerByEmailUsecase,
      dependencies: ['PlayerContract'],
      strategy: 'singleton',
    });
    container.add({
      id: 'GetPlayerByIdUsecase',
      kind: GetPlayerByIdUsecase,
      dependencies: ['PlayerContract'],
      strategy: 'singleton',
    });

    container.add({
      id: 'CreatePlayerUsecase',
      kind: CreatePlayerUsecase,
      dependencies: [
        'PlayerContract',
        'FileAdapter',
        'GetPlayerByDocumentUsecase',
        'GetPlayerByEmailUsecase',
      ],
      strategy: 'singleton',
    });

    container.add({
      id: 'DeletePlayerUsecase',
      kind: DeletePlayerUsecase,
      dependencies: ['PlayerContract', 'FileAdapter', 'GetPlayerByIdUsecase'],
      strategy: 'singleton',
    });
  }
}
