import { FC } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "@material-ui/core";
import { useRecoilValue } from "recoil";
import {
  groupState,
  playersState,
  resultsState,
} from "hooks/states/groupState";

const ResultTable: FC = () => {
  const group = useRecoilValue(groupState);
  const players = useRecoilValue(playersState);
  const results = useRecoilValue(resultsState);

  const handleClear = async (): Promise<void> => {
    if (!group) {
      alert("クリアに失敗");
      return;
    }
    group.reset();
  };
  const playerNames = results.reduce((ret: { [key: string]: string }, r) => {
    const ids = [
      r.eastPlayerId,
      r.westPlayerId,
      r.northPlayerId,
      r.southPlayerId,
    ];
    ids.forEach((id) => {
      if (!ret[id]) {
        ret[id] = players.find((p) => p.id === id)?.name || "";
      }
    });
    return ret;
  }, {});
  const sum = results.reduce((ret: { [key: string]: number }, r) => {
    const points: [string, number][] = [
      [r.eastPlayerId, r.eastPoint],
      [r.westPlayerId, r.westPoint],
      [r.northPlayerId, r.northPoint],
      [r.southPlayerId, r.southPoint],
    ];
    points.forEach(([id, point]) => {
      if (!ret[id]) {
        ret[id] = point;
      }
    });
    return ret;
  }, {});

  return (
    <Card>
      <CardHeader
        title="結果"
        subheader={Object.entries(sum)
          .map(([k, v]) => `${playerNames[k]}: ${v}`)
          .join(", ")}
        action={
          <Button variant="outlined" onClick={handleClear}>
            clear
          </Button>
        }
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {Object.entries(playerNames).map(([k, v]) => (
                  <TableCell key={k}>{v}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r) => {
                const pMap = {
                  [r.eastPlayerId]: r.eastPoint,
                  [r.westPlayerId]: r.westPoint,
                  [r.northPlayerId]: r.northPoint,
                  [r.southPlayerId]: r.southPoint,
                };
                return (
                  <TableRow key={r.ref.path}>
                    {Object.keys(playerNames).map((k) => (
                      <TableCell key={`${r.ref.path}-${k}`}>
                        {typeof pMap[k] === "undefined" ? "" : pMap[k]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ResultTable;
