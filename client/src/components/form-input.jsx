import React from "react";

const FormInput = ({
  type = "text",
  name = "name",
  autoComplete = "off",
  value,
  onChange,
  placeholder,
  className = "",
  onBlur,
}) => {
  return (
    <input
      type={type}
      name={name}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      autoCorrect="off"
      spellCheck="false"
      className={`input-base ${className}`}
    />
  );
};

export default FormInput;
