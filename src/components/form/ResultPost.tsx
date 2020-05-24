import { FC, useRef, KeyboardEvent } from "react";
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

const ResultPost: FC = () => {
  const group = useRecoilValue(groupState);
  const players = useRecoilValue(playersState);
  const formRef = useRef<HTMLFormElement>();

  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>, id: string): void => {
    if (e.keyCode === 13) {
      const elements = formRef.current?.elements;
      if (!elements) {
        return;
      }
      const length = elements.length;
      for (let i = 0; i < length; i++) {
        if (elements[i].id === id) {
          (elements[i] as HTMLInputElement).focus();
          break;
        }
      }
    }
  };
  const handleClick = async (): Promise<void> => {
    if (!group) {
      alert("登録に失敗しました。");
      return;
    }
    await group.addResult(
      players,
      (formRef.current?.elements.namedItem("player1") as HTMLInputElement)
        .value,
      (formRef.current?.elements.namedItem("player2") as HTMLInputElement)
        .value,
      (formRef.current?.elements.namedItem("player3") as HTMLInputElement)
        .value,
      (formRef.current?.elements.namedItem("player4") as HTMLInputElement)
        .value,
      parseFloat(
        (formRef.current?.elements.namedItem("point1") as HTMLInputElement)
          .value
      ),
      parseFloat(
        (formRef.current?.elements.namedItem("point2") as HTMLInputElement)
          .value
      ),
      parseFloat(
        (formRef.current?.elements.namedItem("point3") as HTMLInputElement)
          .value
      ),
      parseFloat(
        (formRef.current?.elements.namedItem("point4") as HTMLInputElement)
          .value
      )
    );
  };

  return (
    <Card component="form" ref={formRef}>
      <CardHeader title="結果追加" />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <PlayerInput
              id="player1"
              onKeyUp={(e) => handleKeyUp(e, "point1")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player1" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput
              id="point1"
              onKeyUp={(e) => handleKeyUp(e, "player2")}
            />
          </Grid>
          <Grid item xs={6}>
            <PlayerInput
              id="player2"
              onKeyUp={(e) => handleKeyUp(e, "point2")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player2" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput
              id="point2"
              onKeyUp={(e) => handleKeyUp(e, "player3")}
            />
          </Grid>
          <Grid item xs={6}>
            <PlayerInput
              id="player3"
              onKeyUp={(e) => handleKeyUp(e, "point3")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player3" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput
              id="point3"
              onKeyUp={(e) => handleKeyUp(e, "player4")}
            />
          </Grid>
          <Grid item xs={6}>
            <PlayerInput
              id="player4"
              onKeyUp={(e) => handleKeyUp(e, "point4")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player4" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <PointInput
              id="point4"
              onKeyUp={(e) => handleKeyUp(e, "submitResult")}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          id="submitResult"
          color="primary"
          variant="contained"
          onClick={handleClick}
        >
          登録
        </Button>
      </CardActions>
    </Card>
  );
};

export default ResultPost;
