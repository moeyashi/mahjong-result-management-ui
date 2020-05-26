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
  TableFooter,
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
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Button
            variant="outlined"
            onClick={handleClear}
            style={{ marginTop: 8 }}
          >
            clear
          </Button>
        }
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
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                {Object.keys(playerNames).map((k) => (
                  <TableCell key={k}>{sum[k]?.toFixed(1)}</TableCell>
                ))}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ResultTable;
