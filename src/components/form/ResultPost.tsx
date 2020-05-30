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
  TextFieldProps,
} from "@material-ui/core";
import PlayerInput, { PlayerInputProps } from "./PlayerInput";
import PointInput from "./PointInput";
import { useAddResult } from "hooks/useAddResult";

const initialValues = {
  player1: "",
  player2: "",
  player3: "",
  player4: "",
  point1: "",
  point2: "",
  point3: "",
  point4: "",
  extraPoint1: "0",
  extraPoint2: "0",
  extraPoint3: "0",
  extraPoint4: "0",
};

const ResultPost: FC = () => {
  const postResult = useAddResult();
  const formRef = useRef<HTMLFormElement>();
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<string>();

  const handleChangePlayer = (key: string): PlayerInputProps["onChange"] => (
    _,
    value
  ) => {
    setValues({ ...values, [key]: value });
  };

  const handleChangePoint = (key: string): TextFieldProps["onChange"] => (
    e
  ) => {
    setValues({ ...values, [key]: e.target.value });
  };

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
      values.player1,
      values.player2,
      values.player3,
      values.player4,
      parseInt(values.point1),
      parseInt(values.point2),
      parseInt(values.point3),
      parseInt(values.point4),
      parseInt(values.extraPoint1),
      parseInt(values.extraPoint2),
      parseInt(values.extraPoint3),
      parseInt(values.extraPoint4)
    );
    setMessage(ng);
    if (!ng) {
      setValues({
        ...values,
        point1: initialValues.point1,
        point2: initialValues.point2,
        point3: initialValues.point3,
        point4: initialValues.point4,
        extraPoint1: initialValues.extraPoint1,
        extraPoint2: initialValues.extraPoint2,
        extraPoint3: initialValues.extraPoint3,
        extraPoint4: initialValues.extraPoint4,
      });
    }
  };

  return (
    <Card component="form" ref={formRef}>
      <CardHeader
        title="結果追加"
        titleTypographyProps={{ variant: "h6" }}
        subheader="得点は素点を入力。同点時の着順は入力順。"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      />
      <CardContent style={{ paddingTop: 8, paddingBottom: 8 }}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <PlayerInput
              id="player1"
              value={values.player1}
              onChange={handleChangePlayer("player1")}
              onKeyUp={(e) => handleKeyUp(e, "point1")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player1" />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <PointInput
              id="point1"
              value={values.point1}
              onChange={handleChangePoint("point1")}
              onKeyUp={(e) => handleKeyUp(e, "player2")}
            />
          </Grid>
          <Grid item xs={4}>
            <PointInput
              id="extraPoint1"
              label="トビ等"
              helperText="着順影響なし"
              value={values.extraPoint1}
              onChange={handleChangePoint("extraPoint1")}
            />
          </Grid>
          <Grid item xs={5}>
            <PlayerInput
              id="player2"
              value={values.player2}
              onChange={handleChangePlayer("player2")}
              onKeyUp={(e) => handleKeyUp(e, "point2")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player2" />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <PointInput
              id="point2"
              value={values.point2}
              onChange={handleChangePoint("point2")}
              onKeyUp={(e) => handleKeyUp(e, "player3")}
            />
          </Grid>
          <Grid item xs={4}>
            <PointInput
              id="extraPoint2"
              label="トビ等"
              helperText="着順影響なし"
              value={values.extraPoint2}
              onChange={handleChangePoint("extraPoint2")}
            />
          </Grid>
          <Grid item xs={5}>
            <PlayerInput
              id="player3"
              value={values.player3}
              onChange={handleChangePlayer("player3")}
              onKeyUp={(e) => handleKeyUp(e, "point3")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player3" />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <PointInput
              id="point3"
              value={values.point3}
              onChange={handleChangePoint("point3")}
              onKeyUp={(e) => handleKeyUp(e, "player4")}
            />
          </Grid>
          <Grid item xs={4}>
            <PointInput
              id="extraPoint3"
              label="トビ等"
              helperText="着順影響なし"
              value={values.extraPoint3}
              onChange={handleChangePoint("extraPoint3")}
            />
          </Grid>
          <Grid item xs={5}>
            <PlayerInput
              id="player4"
              value={values.player4}
              onChange={handleChangePlayer("player4")}
              onKeyUp={(e) => handleKeyUp(e, "point4")}
              renderInput={(params): JSX.Element => (
                <TextField {...params} label="player4" />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <PointInput
              id="point4"
              value={values.point4}
              onChange={handleChangePoint("point4")}
              onKeyUp={(e) => handleKeyUp(e, "submitResult")}
            />
          </Grid>
          <Grid item xs={4}>
            <PointInput
              id="extraPoint4"
              label="トビ等"
              helperText="着順影響なし"
              value={values.extraPoint4}
              onChange={handleChangePoint("extraPoint4")}
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
