import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { UserListGame } from "@/lib/types/user";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateListType, EditListType } from "./create";
import { XIcon, PencilIcon } from "lucide-react"; // Assuming you're using Lucide icons
import { Textarea } from "../ui/textarea";
import useHover from "@/lib/hooks/useHover";

export default function SortableItem({
  id,
  game,
  setList,
}: {
  id: string;
  game: Pick<UserListGame, "game_id" | "note"> & {
    game: { title: string; cover_url: string };
  };
  setList: React.Dispatch<
    React.SetStateAction<CreateListType | EditListType | null>
  >;
}) {
  const [isHoveringNote, hoverNote] = useHover();
  const [isHoveringRemove, hoverRemove] = useHover();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: isHoveringRemove || isHoveringNote });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemoveGame = () => {
    setList((prev) => ({
      ...prev,
      games: prev?.games!.filter((g) => g.game_id !== game.game_id),
    }));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // className="relative group w-40 h-56 rounded-lg overflow-hidden cursor-pointer"
      className="relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden group"
    >
      <img
        src={game.game.cover_url}
        alt={game.game.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="flex space-x-2">
          <Button
            {...hoverRemove}
            variant="destructive"
            size="sm"
            onClick={handleRemoveGame}
          >
            <XIcon className="w-4 h-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" {...hoverNote}>
                <PencilIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Edit Note</DialogTitle>
              <Textarea
                value={game.note || ""}
                onChange={(e) => {
                  setList((prev) => {
                    const updatedGames = prev?.games!.map((g) =>
                      g.game_id === game.game_id
                        ? { ...g, note: e.target.value }
                        : g,
                    );
                    return { ...prev, games: updatedGames };
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
