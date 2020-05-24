import { FC, useState, ChangeEvent, ChangeEventHandler } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  CardActions,
} from "@material-ui/core";
import PlayerInput from "./PlayerInput";
import PointInput from "./PointInput";
import { useRecoilValue } from "recoil";
import { groupState, playersState } from "hooks/states/groupState";

type Values = {
  eastPlayerName: string;
  westPlayerName: string;
  northPlayerName: string;
  southPlayerName: string;
  eastPoint: number;
  westPoint: number;
  northPoint: number;
  southPoint: number;
};

const ResultPost: FC = () => {
  const group = useRecoilValue(groupState);
  const players = useRecoilValue(playersState);
  const [values, setValues] = useState<Values>({
    eastPlayerName: "",
    westPlayerName: "",
    northPlayerName: "",
    southPlayerName: "",
    eastPoint: 0,
    westPoint: 0,
    northPoint: 0,
    southPoint: 0,
  });

  const handleChangeEastPlayer = (_: ChangeEvent<{}>, value: string): void => {
    values.eastPlayerName = value;
    setValues({ ...values });
  };
  const handleChangeWestPlayer = (_: ChangeEvent<{}>, value: string): void => {
    values.westPlayerName = value;
    setValues({ ...values });
  };
  const handleChangeNorthPlayer = (_: ChangeEvent<{}>, value: string): void => {
    values.northPlayerName = value;
    setValues({ ...values });
  };
  const handleChangeSouthPlayer = (_: ChangeEvent<{}>, value: string): void => {
    values.southPlayerName = value;
    setValues({ ...values });
  };
  const handleChangePoint: ChangeEventHandler<HTMLInputElement> = (e) => {
    const id = e.target.id;
    if (
      id === "eastPoint" ||
      id === "northPoint" ||
      id === "southPoint" ||
      id === "westPoint"
    ) {
      values[id] = parseFloat(e.target.value);
      setValues({ ...values });
    }
  };
  const handleClick = async (): Promise<void> => {
    if (!group) {
      alert("登録に失敗しました。");
      return;
    }
    await group.addResult(
      players,
      values.eastPlayerName,
      values.westPlayerName,
      values.northPlayerName,
      values.southPlayerName,
      values.eastPoint,
      values.westPoint,
      values.northPoint,
      values.southPoint
    );
  };

  return (
    <Card>
      <CardHeader title="結果追加" />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <PlayerInput
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player1" />
              )}
              onInputChange={handleChangeEastPlayer}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput id="eastPoint" onChange={handleChangePoint} />
          </Grid>
          <Grid item xs={6}>
            <PlayerInput
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player2" />
              )}
              onInputChange={handleChangeSouthPlayer}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput id="southPoint" onChange={handleChangePoint} />
          </Grid>
          <Grid item xs={6}>
            <PlayerInput
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player3" />
              )}
              onInputChange={handleChangeWestPlayer}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput id="westPoint" onChange={handleChangePoint} />
          </Grid>
          <Grid item xs={6}>
            <PlayerInput
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player4" />
              )}
              onInputChange={handleChangeNorthPlayer}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput id="northPoint" onChange={handleChangePoint} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" onClick={handleClick}>
          登録
        </Button>
      </CardActions>
    </Card>
  );
};

export default ResultPost;
