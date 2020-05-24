import Autocomplete, { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { playersState, loadingPlayersState } from "hooks/states/groupState";

const PlayerInput: FC<Partial<
  AutocompleteProps<string, undefined, undefined, boolean>
>> = (props) => {
  const players = useRecoilValue(playersState);
  const loadingPlayers = useRecoilValue(loadingPlayersState);
  // const getOptionLabel = (player: Player): string => player.name;
  return (
    <Autocomplete
      freeSolo
      options={players.map((player) => player.name)}
      renderInput={(params): JSX.Element => (
        <TextField {...params} label="対局者" />
      )}
      // getOptionLabel={getOptionLabel}
      placeholder={loadingPlayers ? "読み込み中..." : ""}
      {...props}
    />
  );
};

export default PlayerInput;
