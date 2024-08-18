import { GameType } from "@/lib/types/game";
import Game from "@/components/Game";
import { API_URL } from "@/lib/utils";

export default async function GamePage({
  params,
}: {
  params: { id: string[] };
}) {
  const id = String(params?.id?.[0]);
  const response = await fetch(
    `${API_URL}/games/${id}?includes=platforms,genres,companies`,
  );
  const gameData = (await response.json()) as { attributes: GameType };

  return <Game game={gameData.attributes} />;
}
