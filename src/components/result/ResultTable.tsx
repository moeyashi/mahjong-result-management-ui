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
  resultsState,
  resultSummaryState,
  resultPlayerNames,
} from "hooks/states/groupState";

const ResultTable: FC = () => {
  const group = useRecoilValue(groupState);
  const results = useRecoilValue(resultsState);
  const playerNames = useRecoilValue(resultPlayerNames);
  const sum = useRecoilValue(resultSummaryState);

  const handleClear = async (): Promise<void> => {
    if (!group) {
      alert("クリアに失敗");
      return;
    }
    group.reset();
  };

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
