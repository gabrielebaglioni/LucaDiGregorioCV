import React from "react";

type Props = {
  wrapperClassName: string;
  imgClassName: string;
  src: string;
  alt: string;
};

export default function ContainImage({
  wrapperClassName,
  imgClassName,
  src,
  alt,
}: Props) {
  return (
    <div className={wrapperClassName}>
      <img src={src} alt={alt} className={imgClassName} />
    </div>
  );
}

