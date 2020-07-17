'use strict';

const request = require('request-promise');

const {
  ASSETS_SERVER_URL,
  ASSETS_SERVER_SECRET,
} = process.env;

async function createAssetUploadToken(){
  const url = `${ASSETS_SERVER_URL}/create-upload-token/${ASSETS_SERVER_SECRET}`;
  const { uploadToken } = await request.post(url, { json: true });
  return uploadToken;
};

async function uploadAsset({ uploadToken, value, filename }){
  const url = `${ASSETS_SERVER_URL}/upload/${uploadToken}`;
  return await request.post(url, {
    json: true,
    formData: {
      asset: {
        value,
        options: { filename }
      },
    },
  });
}

function dataURIToAsset(dataURI) {
  const matches = dataURI.match(/^data:image\/([^;]+?);(base64|charset=UTF-8),(.+)$/);
  if (!matches) throw new Error('dataURI in unsupported format');
  let [, type, encoding, data] = matches;
  if (type === 'svg+xml'){
    type = 'svg';
    data = decodeURIComponent(data);
  }
  let filename = 'image.'+type;
  if (encoding === 'charset=UTF-8') encoding = 'utf8';
  let value = Buffer.from(data, encoding);
  return { value, filename };
}

async function uploadImageDataURL(imageDataURL){
  const uploadToken = await createAssetUploadToken();
  const { url } = await uploadAsset({
    uploadToken,
    ...dataURIToAsset(imageDataURL),
  });
  return url;
}

function isAssetUrl(url){
  return typeof url === 'string' && url.startsWith(ASSETS_SERVER_URL);
}

module.exports = {
  createAssetUploadToken,
  uploadAsset,
  dataURIToAsset,
  uploadImageDataURL,
  isAssetUrl,
};
