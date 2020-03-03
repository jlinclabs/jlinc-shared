'use strict';

function validateFeedPost({post, assetServerUrl}) {
  if (!post) throw new Error('post is required');
  if (typeof post !== 'object') throw new Error('post must be an object');

  if (post.repostUid) {
    if (typeof post.repostUid !== 'string' || !post.repostUid.match(/\w{32}/))
      throw new Error('invalid repostUid');
    return;
  }

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

function organizationFeedPostRecordToPost(record){
  const post = {
    uid: record.feed_post_uid,
    feedOwnerApikey: record.feed_owner_apikey,
    createdAt: record.created_at,
    myPost: !!record.my_post,
  };

  [
    ['body', 'body'],
    ['title', 'title'],
    ['mediaUrl', 'media_url'],
    ['mediaMimeType', 'media_mime_type'],
    ['repostUid', 'repost_uid'],
    ['userDid', 'user_did'],
    ['userPublicKey', 'user_public_key'],
    ['userSignature', 'user_signature'],
    ['userSignatureJSON', 'user_signature_json'],
    ['organizationDid', 'organization_did'],
    ['organizationPublicKey', 'organization_public_key'],
    ['organizationSignature', 'organization_signature'],
    ['organizationSignatureJSON', 'organization_signature_json'],
  ].forEach(([prop, column]) => {
    if (typeof record[column] === 'string')
      post[prop] = record[column];
  });

  if (record.updated_at) post.hiddenAt  = record.updated_at;
  if (record.hidden_at)  post.hiddenAt  = record.hidden_at;
  if (record.deleted_at) post.deletedAt = record.deleted_at;

  return post;
}

function verifyOrganizationFeedPostSignature(JLINC, post){
  if (post.userSignature) {
    JLINC.verifySignature({
      itemSigned: post.userSignatureJSON,
      signature: post.userSignature,
      publicKey: post.userPublicKey,
    });
    verifySignatureJSONMatchesPost(post.userSignatureJSON);
  }

  if (post.organizationSignature) {
    JLINC.verifySignature({
      itemSigned: post.organizationSignatureJSON,
      signature: post.organizationSignature,
      publicKey: post.organizationPublicKey,
    });
    verifySignatureJSONMatchesPost(post.organizationSignatureJSON);
  }

  function verifySignatureJSONMatchesPost(signatureJSON) {
    const itemSigned = JSON.parse(signatureJSON);
    for (const key in itemSigned) {
      if (
        (key === 'createdAt' && !datesMatch(post[key], itemSigned[key])) ||
        (key !== 'createdAt' && itemSigned[key] !== post[key])
      ) {
        throw new Error(`${key} in post does not match value in signatureJSON`);
      }
    }
  }
}

const datesMatch = (dateA, dateB) => {
  if (dateA instanceof Date) dateA = dateA.toISOString();
  if (dateB instanceof Date) dateB = dateB.toISOString();
  return dateA === dateB;
};

const isEmpty = string => typeof string !== 'string' || string.trim().length === 0;
const isUndefinedOrString = object => typeof object === 'undefined' || typeof object === 'string';

module.exports = {
  validateFeedPost,
  organizationFeedPostRecordToPost,
  verifyOrganizationFeedPostSignature,
};
