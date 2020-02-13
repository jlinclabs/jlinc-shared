'use strict';

module.exports = function validateFeedPost({post, assetServerUrl}) {
  if (!post) throw new Error('post is required');
  if (typeof post !== 'object') throw new Error('post must be an object');

  const { title, body, mediaUrl, mediaMimeType } = post;
  if (!isUndefinedOrString(title)) throw new Error('title must be a string');
  if (!isUndefinedOrString(body)) throw new Error('body must be a string');
  if (!isUndefinedOrString(mediaUrl)) throw new Error('mediaUrl must be a string');
  if (!isUndefinedOrString(mediaMimeType)) throw new Error('mediaMimeType must be a string');
  if (!post.repostUid && isEmpty(title) && isEmpty(body) && isEmpty(mediaUrl))
    throw new Error('title, body and mediaUrl cannot all be blank');

  if (mediaUrl && !assetServerUrl) throw new Error('assetServerUrl is required');
  if (mediaMimeType === 'video/vimeoUrl'){
    if (!mediaUrl.match(/^https?:\/\/(?:player\.)?vimeo.com\//))
      throw new Error('media must be vimeo url when mediaMimeType="video/vimeoUrl"');
  }else if (
    mediaUrl &&
    !mediaUrl.startsWith(assetServerUrl)
  ){
    throw new Error('media must be uploaded to the JLINC assets server');
  }
};

const isEmpty = string =>
  typeof string !== 'string' || string.trim().length === 0;

const isUndefinedOrString = object =>
  typeof object === 'undefined' || typeof object === 'string';
