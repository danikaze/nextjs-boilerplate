import Image from 'next/image';
import { AppPage } from '@_app';
import { Page } from '@components/page';
import pixelCatImage from '@assets/images/pixel-cat.png';

const StaticPageHandler: AppPage = () => {
  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;
  const IMAGE_HEIGHT = 100;

  return (
    <Page title={title} header="Static page">
      <Image src={pixelCatImage} height={IMAGE_HEIGHT} objectFit="contain" />
    </Page>
  );
};

export default StaticPageHandler;
