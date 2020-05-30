import { FC } from "react";
import { TextFieldProps, TextField, InputAdornment } from "@material-ui/core";

const PointInput: FC<TextFieldProps> = ({ InputProps, ...props }) => (
  <TextField
    type="number"
    label="得点"
    InputProps={{
      endAdornment: <InputAdornment position="end">00</InputAdornment>,
      ...InputProps,
    }}
    inputProps={{
      step: 1,
    }}
    {...props}
  />
);

export default PointInput;
