import Autocomplete, { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import useGroup from "../../hooks/useGroup";
import { FC } from "react";
import Player from "../../models/Player";

const PlayerInput: FC<Partial<AutocompleteProps<Player>>> = (props) => {
  const { players } = useGroup();
  const getOptionLabel = (player: Player): string => player.name;
  return (
    <Autocomplete<Player>
      freeSolo
      options={players}
      renderInput={(params): JSX.Element => (
        <TextField {...params} label="対局者" />
      )}
      getOptionLabel={getOptionLabel}
      {...props}
    />
  );
};

export default PlayerInput;
