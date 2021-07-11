import Image from 'next/image';
import React, { FC } from 'react';
import { Page } from '@components/page';
import { HelloWorld, Props as HelloWorldProps } from '@components/hello-world';
import { useIndexPage } from './hooks';

import pixelCatImage from '@assets/images/pixel-cat.png';
import catImage from '@assets/images/cat.jpg';

export type Props = {};

export const IndexPage: FC<Props> = () => {
  const {
    count,
    increase,
    decrease,
    locale,
    locales,
    changeLang,
  } = useIndexPage();

  const helloWorldProps: HelloWorldProps = {
    count,
    locale,
    locales,
    onIncrease: increase,
    onDecrease: decrease,
    onLangChang: changeLang,
  };

  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;
  const IMAGE_HEIGHT = 100;

  return (
    <Page title={title} header="Index">
      <Image src={pixelCatImage} height={IMAGE_HEIGHT} objectFit="contain" />
      <HelloWorld {...helloWorldProps} />
      <Image
        src={catImage}
        height={IMAGE_HEIGHT}
        objectFit="contain"
        placeholder="blur"
      />
    </Page>
  );
};
