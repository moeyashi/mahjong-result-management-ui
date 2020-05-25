import { FC, useRef, KeyboardEvent, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  CardActions,
  Typography,
} from "@material-ui/core";
import PlayerInput from "./PlayerInput";
import PointInput from "./PointInput";
import { useAddResult } from "hooks/useAddResult";

const ResultPost: FC = () => {
  const postResult = useAddResult();
  const formRef = useRef<HTMLFormElement>();
  const [message, setMessage] = useState<string>();

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
    const ng = await postResult(
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
    setMessage(ng);
  };

  return (
    <Card component="form" ref={formRef}>
      <CardHeader
        title="結果追加"
        subheader="25000持ち30000返し、ウマ10-20（同点時入力順） 得点は素点/1000を入力"
      />
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
        <Typography color="error">{message}</Typography>
      </CardActions>
    </Card>
  );
};

export default ResultPost;
