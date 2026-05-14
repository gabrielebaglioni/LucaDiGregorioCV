import React from "react";

type Props = {
  wrapperClassName: string;
  titleClassName: string;
  secondaryClassName: string;
  title: string;
  secondary: string;
};

export default function TwoLineMeta({
  wrapperClassName,
  titleClassName,
  secondaryClassName,
  title,
  secondary,
}: Props) {
  return (
    <div className={wrapperClassName}>
      <p className={titleClassName}>{title}</p>
      <p className={secondaryClassName}>{secondary}</p>
    </div>
  );
}

