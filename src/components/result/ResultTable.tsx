import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  resultPlayerNames,
  resultsState,
  resultSummaryState,
} from "hooks/states/groupState";
import Result from "models/Result";
import { FC } from "react";
import { useRecoilValue } from "recoil";

const ResultTable: FC = () => {
  const results = useRecoilValue(resultsState);
  const playerNames = useRecoilValue(resultPlayerNames);
  const sum = useRecoilValue(resultSummaryState);

  const handleDelete = (result: Result) => async (): Promise<void> => {
    if (!confirm("対局結果を削除しますか？")) {
      return;
    }
    await result.delete();
  };

  return (
    <Card>
      <CardHeader
        title="結果"
        titleTypographyProps={{ variant: "h6" }}
        subheader="25000持ち30000返し、ウマ10-20（同点時入力順）"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      />
      <CardContent style={{ paddingTop: 8, paddingBottom: 8 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {Object.entries(playerNames).map(([k, v]) => (
                  <TableCell key={k}>
                    {v} : {sum[k]?.toFixed(1)}
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r) => {
                const pMap = {
                  [r.playerMap.east.id]: r.playerMap.east,
                  [r.playerMap.west.id]: r.playerMap.west,
                  [r.playerMap.south.id]: r.playerMap.south,
                  [r.playerMap.north.id]: r.playerMap.north,
                };
                return (
                  <TableRow key={r.ref.path}>
                    {Object.keys(playerNames).map((k) => (
                      <TableCell key={`${r.ref.path}-${k}`}>
                        {typeof pMap[k] === "undefined"
                          ? ""
                          : (
                              pMap[k].point +
                              pMap[k].rankBonus +
                              pMap[k].topPrize -
                              r.startPoint
                            ).toFixed(1)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button onClick={handleDelete(r)}>delete</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                {Object.keys(playerNames).map((k) => (
                  <TableCell key={k}>{sum[k]?.toFixed(1)}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ResultTable;
