import { AppPage } from '@_app';
import { Page } from '@components/page';
import pixelCatImage from '@assets/images/pixel-cat.png';

const StaticPageHandler: AppPage = () => {
  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;
  const INLINE_IMAGE_WIDTH = 80;

  return (
    <Page title={title} header="Static page">
      <img
        src={pixelCatImage}
        width={INLINE_IMAGE_WIDTH}
        title="This image is loaded inline"
      />
    </Page>
  );
};

export default StaticPageHandler;
