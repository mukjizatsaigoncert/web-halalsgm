/* eslint-disable jsx-a11y/alt-text */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_FALLBACK = "/images/image-placeholder.png";

const ImageFallback = (props: any) => {
  const { src, fallback = DEFAULT_FALLBACK, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_FALLBACK);

  useEffect(() => {
    setImgSrc(src || DEFAULT_FALLBACK);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
};

export default ImageFallback;
