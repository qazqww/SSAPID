/* eslint-disable react/require-default-props */
import React from "react";
import style from "../../styles/Input.module.scss";

type InputValue = string | number | readonly string[] | undefined;

type Props = {
  value: InputValue;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeHolder: string;
  name: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  width?: number;
  buttonText?: string;
  onClickInputButton?: (e: React.MouseEvent) => void;
  errorMessage?: string;
  noBackground?: boolean;
  onKeyPressEventHandler?: React.KeyboardEventHandler<HTMLInputElement>;
  height?: string;
};

function Input({
  value,
  onChange,
  onKeyPressEventHandler,
  placeHolder,
  name,
  type = "text",
  buttonText,
  width = 240,
  onClickInputButton,
  errorMessage,
  height,
  noBackground = false,
}: Props) {
  return (
    <div>
      <div
        className={
          noBackground ? `${style.input} ${style.noBackground}` : style.input
        }
        style={
          height
            ? { width: `${width}px`, height: `${height}` }
            : { width: `${width}px` }
        }
      >
        <label htmlFor={name}>
          <span className={value ? style.inValueSpan : ""}>{placeHolder}</span>
          <input
            name={name}
            className={value ? style.inValueInput : ""}
            type={type}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPressEventHandler}
          />
        </label>
        {buttonText && (
          <button type="button" onClick={onClickInputButton}>
            {buttonText}
          </button>
        )}
      </div>
      <p className={style.error}>{errorMessage}</p>
    </div>
  );
}
export default Input;
