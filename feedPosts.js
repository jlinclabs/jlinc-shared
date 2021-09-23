'use strict';

const _ = require('lodash');
const createUid = require('./createUid');

const FEED_POST_CONTENT_PROPS = Object.freeze(['title', 'body']);
const VISIBLE_TO_LABELS = Object.freeze([
  'members only',
  'network only (AKA on some list)',
  'Tru only',
  'public',
]);

const VISIBLE_TO_VALUES = Object.freeze(
  VISIBLE_TO_LABELS.map((_,index) => index)
);

function createFeedPostUid(){
  return createUid();
}

function _assertValidVisibleTo(visibleTo, name = 'visibleTo'){
  if (typeof visibleTo === 'undefined')
    throw new Error(name+' is required');
  if (!VISIBLE_TO_VALUES.includes(visibleTo))
    throw new Error(name+`=${visibleTo} is invalid`);
}

function _assertValidTitleAndBody({title, body}, prefix = ''){
  if (!title && !body)
    throw new Error(`one of ${prefix}title or ${prefix}body is required`);
  if (title && typeof title !== 'string')
    throw new Error(`${prefix}title must be a string`);
  if (body && typeof body !== 'string')
    throw new Error(`${prefix}body must be a string`);
}

function _createRootFeedPost({posterUserDid, maxVisibleTo, title, body}){
  if (!posterUserDid) throw new Error('post.posterUserDid is required');
  if (title === '') title = undefined;
  if (body === '') body = undefined;
  _assertValidTitleAndBody({title, body}, 'post.');
  const uid = createFeedPostUid();
  const createdAt = new Date;
  return {
    uid,
    createdAt,
    initCreatedAt: createdAt,
    feedPostContentUid: uid,
    initUid: uid,
    initPosterUserDid: posterUserDid,
    createdAt: createdAt,
    contentCreatedAt: createdAt,
    posterUserDid,
    title,
    body,
    maxVisibleTo,
    ancestors: [],
  };
}

function createForumFeedPost({
  feedOrganizationApikey,
  posterUserDid,
  posterOrganizationApikey,
  maxVisibleTo,
  title,
  body,
}){
  if (!feedOrganizationApikey)
    throw new Error('feedOrganizationApikey is required');
  _assertValidVisibleTo(maxVisibleTo, 'maxVisibleTo');
  return {
    ..._createRootFeedPost({posterUserDid, maxVisibleTo, title, body}),
    feedOrganizationApikey,
    posterOrganizationApikey,
    initFeedOrganizationApikey: feedOrganizationApikey,
    initPosterOrganizationApikey: posterOrganizationApikey,
    visibleTo: 0,
  };
}

function createPublicProfileFeedPost({
  feedUserDid,
  posterUserDid,
  visibleTo,
  // maxVisibleTo = visibleTo,
  title,
  body,
}){
  if (!feedUserDid) throw new Error('feedUserDid is required');
  if (!posterUserDid) throw new Error('posterUserDid is required');
  if (feedUserDid !== posterUserDid)
    throw new Error('feedUserDid must equal posterUserDid');
  _assertValidVisibleTo(visibleTo, 'visibleTo');
  // _assertValidVisibleTo(maxVisibleTo, 'maxVisibleTo');
  return {
    ..._createRootFeedPost({posterUserDid, maxVisibleTo: visibleTo, title, body}),
    feedUserDid,
    initFeedUserDid: feedUserDid,
    visibleTo,
  };
}

function editFeedPost({
  post,
  title,
  body,
  maxVisibleTo,
}){
  if (!_.isPlainObject(post)) throw new Error('post is required');
  if (typeof title === 'undefined') title = post.title;
  if (typeof body === 'undefined') body = post.body;
  if (typeof maxVisibleTo === 'undefined') maxVisibleTo = post.maxVisibleTo;
  if (isBlankString(title)) title = undefined;
  if (isBlankString(body)) body = undefined;
  _assertValidTitleAndBody({title, body});
  _assertValidVisibleTo(maxVisibleTo, 'maxVisibleTo');
  const visibleTo = post.feedUserDid ? maxVisibleTo : post.visibleTo;
  const now = new Date;
  return {
    ...post,
    feedPostContentUid: createFeedPostUid(),
    title,
    body,
    visibleTo,
    maxVisibleTo,
    updatedAt: now,
    contentCreatedAt: now,
  };
}

function _descendFromFeedPost(parent, visibleTo){
  if (!_.isPlainObject(parent))
    throw new Error('post is required');
  _assertValidVisibleTo(visibleTo, 'visibleTo');
  if (typeof parent.initUid !== 'string')
    throw new Error('post.initUid is required');
  if (typeof parent.initPosterUserDid !== 'string')
    throw new Error('post.initPosterUserDid is required');
  if (typeof parent.feedPostContentUid !== 'string')
    throw new Error('post.feedPostContentUid is required');
  if (typeof parent.uid !== 'string')
    throw new Error('post.uid is required');
  if (typeof parent.visibleTo !== 'number')
    throw new Error('post.visibleTo is required');
  if (typeof parent.maxVisibleTo !== 'number')
    throw new Error('post.maxVisibleTo is required');
  if (!Array.isArray(parent.ancestors))
    throw new Error('post.ancestors is required');
  if (visibleTo > parent.maxVisibleTo)
    throw new Error(
      `visibleTo cannot exceed post.maxVisibleTo. ` +
      `${visibleTo} > ${parent.maxVisibleTo}`
    );

  const post = {
    ..._.pick(parent, [
      'contentCreatedAt',
      'initUid',
      'initCreatedAt',
      'initPosterUserDid',
      'initFeedOrganizationApikey',
      'initFeedUserDid',
      'initPosterOrganizationApikey',
      'feedPostContentUid',
      'lastPublishingOrganizationApikey',
      'lastPublishingUserDid',
      'lastPublishedAt',
      'title',
      'body',
      'maxVisibleTo',
    ]),
    uid: createFeedPostUid(),
    parentUid: parent.uid,
    visibleTo,
    ancestors: [parent.uid, ...parent.ancestors],
    createdAt: new Date,
  };

  // should this change on the published post or === 0 on forum only posts?
  if (parent.visibleTo > 0){
    post.lastPublishingUserDid = parent.posterUserDid;
    post.lastPublishingOrganizationApikey = parent.posterOrganizationApikey;
    post.lastPublishedAt = parent.createdAt;
  }

  return post;
}

function repostFeedPostToForum({
  post: parentPost,
  posterUserDid,
  posterOrganizationApikey,
  feedOrganizationApikey,
}){
  if (!posterUserDid) throw new Error(`posterUserDid is required`);
  if (!feedOrganizationApikey) throw new Error(`feedOrganizationApikey is required`);
  return {
    ..._descendFromFeedPost(parentPost, 0),
    feedOrganizationApikey,
    posterOrganizationApikey,
    posterUserDid,
  };
};

function repostFeedPostToPublicProfile({
  post: parentPost,
  posterUserDid,
  visibleTo,
}){
  if (!parentPost) throw new Error('post is required');
  if (parentPost.maxVisibleTo < 2) throw new Error('you cannot repost unpublished posts');
  if (!posterUserDid) throw new Error('posterUserDid is required');
  _assertValidVisibleTo(visibleTo);
  if (visibleTo < 2) throw new Error('public profile feed posts must be visibleTo >= 2');
  return {
    ..._descendFromFeedPost(parentPost, visibleTo),
    feedUserDid: posterUserDid,
    posterUserDid,
  };
};

function publishOrganizationForumPost({
  post: parentPost,
  posterUserDid,
  visibleTo,
}){
  if (!posterUserDid) throw new Error(`posterUserDid is required`);
  if (visibleTo < 1) throw new Error(
    `invalid visibleTo. Given ${visibleTo} but ` +
    `minimum visibleTo value when publishing feed posts is 1`
  );
  return {
    ..._descendFromFeedPost(parentPost, visibleTo),
    uid: createFeedPostUid(),
    feedOrganizationApikey: parentPost.feedOrganizationApikey,
    posterUserDid: posterUserDid,
    posterOrganizationApikey: parentPost.feedOrganizationApikey,
  };
}

function consumeFeedPost({
  post,
  feedOrganizationApikey,
}){
  if (!_.isPlainObject(post))
    throw new Error('post is required');
  if (!feedOrganizationApikey)
    throw new Error('feedOrganizationApikey is required');
  _assertValidVisibleTo(post.maxVisibleTo, 'post.maxVisibleTo');
  const consumption = _descendFromFeedPost(post, 0, post.maxVisibleTo);
  if (post.visibleTo === 0) throw new Error('only published posts can be consumed');
  if (!post.createdAt) throw new Error('post.createdAt is required');
  if (!post.posterUserDid) throw new Error('post.posterUserDid is required');
  return {
    ...consumption,
    visibleTo: 0,
    maxVisibleTo: post.maxVisibleTo,
    feedOrganizationApikey,
    createdAt: post.createdAt,
    lastPublishingUserDid: post.posterUserDid,
    lastPublishingOrganizationApikey: post.posterOrganizationApikey,
    lastPublishedAt: post.createdAt,
  };
}

function feedPostToRecords(feedPost){
  function extractPropsAsColumns(map){
    const record = {};
    Object.entries(map).forEach(([column, prop]) => {
      if (prop in feedPost && typeof feedPost[prop] !== 'undefined')
        record[column] = feedPost[prop];
    });
    return record;
  }
  return {
    feed_post: {
      ...extractPropsAsColumns(FEED_POST_COLUMN_TO_PROP),
      ancestors: JSON.stringify(feedPost.ancestors),
    },
    feed_post_content: {
      ...extractPropsAsColumns(FEED_POST_CONTENT_COLUMN_TO_PROP),
      uid: feedPost.feedPostContentUid,
      created_at: feedPost.contentCreatedAt,
    },
  };
}

const FEED_POST_COLUMN_TO_PROP = Object.freeze({
  feed_post_content_uid: 'feedPostContentUid',
  uid: 'uid',
  parent_uid: 'parentUid',
  init_uid: 'initUid',
  feed_organization_apikey: 'feedOrganizationApikey',
  feed_user_did: 'feedUserDid',
  poster_user_did: 'posterUserDid',
  poster_organization_apikey: 'posterOrganizationApikey',
  visible_to: 'visibleTo',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  deleted_at: 'deletedAt',
  deleted_by_user_did: 'deletedByUserDid',
  last_publishing_organization_apikey: 'lastPublishingOrganizationApikey',
  last_publishing_user_did: 'lastPublishingUserDid',
  last_published_at: 'lastPublishedAt',
  ancestors: 'ancestors',
  comment_count: 'commentCount',
  upvote_count: 'upvoteCount',
  downvote_count: 'downvoteCount',
  my_vote: 'myVote',
});

const FEED_POST_CONTENT_COLUMN_TO_PROP = Object.freeze({
  created_at: 'createdAt',
  uid: 'uid',
  title: 'title',
  body: 'body',
  max_visible_to: 'maxVisibleTo',
  init_poster_user_did: 'initPosterUserDid',
  init_poster_organization_apikey: 'initPosterOrganizationApikey',
  init_feed_organization_apikey: 'initFeedOrganizationApikey',
  init_feed_user_did: 'initFeedUserDid',
  init_created_at: 'initCreatedAt',
});

function recordToInstance(map, record){
  return Object.entries(map).reduce(
    (post, [column, prop]) => {
      let value = record[column];
      if (typeof value !== 'undefined' && value !== false && value !== null) post[prop] = value;
      return post;
    },
    {}
  );
}

function recordToFeedPostContent(record){
  return recordToInstance(FEED_POST_CONTENT_COLUMN_TO_PROP, record);
}

function recordToFeedPost(record){
  return addContentsToFeedPost(
    recordToInstance(FEED_POST_COLUMN_TO_PROP, record),
    recordToFeedPostContent({
      ...record,
      uid: record.feed_post_content_uid,
      created_at: record.content_created_at,
    }),
  );
}

function addContentsToFeedPost(post, contents){
  if (contents.uid !== post.feedPostContentUid)
    throw new Error(`feedPostContentUid mismatch ${contents.uid} !== ${post.feedPostContentUid}`);

  post = (() => {
    const p = {};
    Object.values(FEED_POST_CONTENT_COLUMN_TO_PROP).forEach(prop => {
      if (prop === 'uid') return;
      if (contents[prop] === undefined) return;
      p[prop] = contents[prop];
    });
    Object.values(FEED_POST_COLUMN_TO_PROP).forEach(prop => {
      if (post[prop] === undefined) return;
      p[prop] = post[prop];
    });
    return p;
  })();

  if (contents.createdAt) post.contentCreatedAt = contents.createdAt;

  const isForumPost = !!(post.feedOrganizationApikey && post.visibleTo === 0);
  ['commentCount', 'upvoteCount', 'downvoteCount', 'myVote'].forEach(prop => {
    if (!isForumPost || post[prop] === 0) delete post[prop];
  });

  if (post.deletedAt){
    post.deletedByPoster = !!(
      post.deletedByUserDid &&
      post.posterUserDid &&
      post.deletedByUserDid === post.posterUserDid
    );
    delete post.updatedAt;
    delete post.deletedByUserDid;
    delete post.feedPostContentUid;
    delete post.posterUserDid;
    delete post.posterOrganizationApikey;
    delete post.title;
    delete post.body;
    delete post.mediaUrl;
    delete post.mediaMimeType;
  }
  return post;
}

function postIsMissingContent(post){
  return post && !post.initPosterUserDid;
}

const isBlank =
  x => !x || x.trim() === '';

const isBlankString = string =>
  typeof string === 'string' && isBlank(string);

function validateFeedPostContents(post){
  if (post.title && typeof post.title !== 'string') throw new Error('post.title must be a string');
  if (post.body && typeof post.body !== 'string') throw new Error('post.body must be a string');
  if (isBlank(post.title) && isBlank(post.body)) throw new Error('one of post.title or post.body is required');
}

module.exports = {
  FEED_POST_CONTENT_PROPS,
  createForumFeedPost,
  createPublicProfileFeedPost,
  editFeedPost,
  repostFeedPostToForum,
  repostFeedPostToPublicProfile,
  publishOrganizationForumPost,
  consumeFeedPost,
  feedPostToRecords,

  recordToFeedPostContent,
  recordToFeedPost,
  addContentsToFeedPost,
  postIsMissingContent,
  validateFeedPostContents,
};
