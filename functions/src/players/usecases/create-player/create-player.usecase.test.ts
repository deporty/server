import { IPlayerModel } from "@deporty-org/entities/players";
import { of } from "rxjs";
import { Container } from "../../../core/DI";
import { buildContainer } from "../../../test/factories";
import { PlayersModulesConfig } from "../../players-modules.config";
import { GetPlayerByDocumentUsecase } from "../get-player-by-document/get-player-by-document.usecase";
import { GetPlayerByEmailUsecase } from "../get-player-by-email/get-player-by-email.usecase";
import { PlayerAlreadyExistsException } from "./create-player.exceptions";
import { CreatePlayerUsecase } from "./create-player.usecase";
describe("CreatePlayerUsecase", () => {
  let createPlayerUsecase: CreatePlayerUsecase;
  let getPlayerByDocumentUsecase: GetPlayerByDocumentUsecase;
  let getPlayerByEmailUsecase: GetPlayerByEmailUsecase;
  let container: Container;


  beforeAll(() => {
    container = buildContainer(PlayersModulesConfig);


    createPlayerUsecase =
      container.getInstance<CreatePlayerUsecase>(
        "CreatePlayerUsecase"
      );

    getPlayerByDocumentUsecase =
      container.getInstance<GetPlayerByDocumentUsecase>(
        "GetPlayerByDocumentUsecase"
      );

    getPlayerByEmailUsecase =
      container.getInstance<GetPlayerByEmailUsecase>(
        "GetPlayerByEmailUsecase"
      );
  });
  test("Should create instance", () => {
    expect(createPlayerUsecase).not.toBeNull();
  });

  test("Should return a PlayerAlreadyExistsException when the document exists in the db", (done) => {
    jest
      .spyOn(getPlayerByDocumentUsecase, "call")
      .mockImplementation((document: string) => {
        return of({
          name: "Fka",
          document: "10235678989",
        } as IPlayerModel);
      });

    const response = createPlayerUsecase.call({
      document: "10534521654",
    } as any);
    response.subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(PlayerAlreadyExistsException);
        done();
      },
    });
  });

  test("Should return a PlayerAlreadyExistsException when the email exists in the db", (done) => {
    jest
      .spyOn(getPlayerByDocumentUsecase, "call")
      .mockImplementation((document: string) => {
        return of(undefined);
      });

    jest
      .spyOn(getPlayerByEmailUsecase, "call")
      .mockImplementation((email: string) => {
        return of({
          name: "Fake user",
        } as IPlayerModel);
      });

    const response = createPlayerUsecase.call({
      document: "10534521654",
      email: "aksldfjañk@gmail.com",
    } as any);
    response.subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(PlayerAlreadyExistsException);
        done();
      },
    });
  });
});
