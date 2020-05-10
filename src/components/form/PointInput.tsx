import { FC } from "react";
import { TextFieldProps, TextField } from "@material-ui/core";

const PointInput: FC<TextFieldProps> = (props) => (
  <TextField type="number" label="得点" {...props} />
);

export default PointInput;
