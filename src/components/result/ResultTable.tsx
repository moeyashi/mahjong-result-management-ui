import { FC } from "react";
import useGroup from "../../hooks/useGroup";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@material-ui/core";

const ResultTable: FC = () => {
  const { players, results } = useGroup();
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

  return (
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
  );
};

export default ResultTable;
