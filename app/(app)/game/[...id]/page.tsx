// import { resolvePromise } from "../../../../lib/helpers/common";
// import { gameService } from "../../../../lib/services/game";
// import Game from "../../../../components/screens/Game";
// import { IGame } from "../../../../lib/types/game";
//
// export const revalidate = 3600;
//
// export default async function GamePage({ params }: { params: { id: string[] } }) {
//   const id = String(params?.id?.[0]);
//
//   const [data, gameErr] = await resolvePromise(
//     gameService.getById(id, [
//       "developers",
//       "developers.developer",
//       "publishers",
//       "publishers.publisher",
//       "genres",
//       "genres.genre",
//       "platforms",
//       "platforms.platform",
//     ])
//   );
//
//
//   if (gameErr) {
//     return {
//       props: { game: null },
//     };
//   }
//
//   const game = data?.attributes as IGame;
//
//   const [reviews, reviewsErr] = await resolvePromise(
//     gameService.getReviews(id, {
//       includes: ["user", "game"],
//     })
//   );
//
//   if (!reviewsErr) {
//     game.reviews = reviews?.attributes;
//   }
//
//   const [characters, charactersErr] = await resolvePromise(
//     gameService.getCharacters(id, {
//       includes: ["character"],
//     })
//   );
//
//   if (!charactersErr) {
//     game.characters = characters?.attributes;
//   }
//
//   const [staff, staffErr] = await resolvePromise(
//     gameService.getStaff(id, {
//       includes: ["people"],
//     })
//   );
//
//   if (!staffErr) {
//     game.staff = staff?.attributes;
//   }
//
//   return <Game game={game} />;
// }
//

import { GameType } from "@/lib/types/game";
import Game from "@/components/Game";

export default async function GamePage({
  params,
}: {
  params: { id: string[] };
}) {
  const id = String(params?.id?.[0]);
  const response = await fetch(
    `http://localhost:5050/games/${id}?includes=platforms,genres,companies`,
  );
  const gameData = (await response.json()) as { attributes: GameType };
  console.log(gameData);

  return <Game game={gameData.attributes} />;
}
