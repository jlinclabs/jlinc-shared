'use strict';

const md5 = require('md5');

const FEED_POST_CONTENT_PROPS = Object.freeze(['title', 'body']);

function createFeedPostUid(){
  return md5(`${Math.random()}${Date.now()}`);
}

function createFeedPost({...post}){
  if (!post.feedUserDid && !post.feedOrganizationApikey)
    throw new Error('post.feedUserDid or post.feedOrganizationApikey is required');
  if (post.feedUserDid && post.feedOrganizationApikey)
    throw new Error('post.feedUserDid and post.feedOrganizationApikey are incompatible options');
  if (!post.posterUserDid) throw new Error('post.posterUserDid is required');
  if (!post.title) throw new Error('post.title is required');
  if (!post.body) throw new Error('post.body is required');
  post.uid = createFeedPostUid();
  post.initUid = post.uid;
  post.initFeedUserDid = post.feedUserDid;
  post.initPosterUserDid = post.posterUserDid;
  return post;
}

function descendFromFeedPost(post){
  return {
    initUid: post.initUid,
    feedPostContentUid: post.feedPostContentUid,
    parentUid: post.uid,
    lastPublisher: post.lastPublisher,
    lastPublishedAt: post.lastPublishedAt,
    ancestors: [post.uid, ...(post.ancestors || [])],
  };
}

function publishOrganizationForumPost({
  post: parentPost,
  posterUserDid,
}){
  // TODO validate input
  // parentPost.init_uid
  // parentPost.feedPostContentUid
  // parentPost.uid
  // parentPost.feedOrganizationApikey
  // parentPost.lastPublisher
  // parentPost.lastPublishedAt
  // parentPost.ancestors

  const post = descendFromFeedPost(parentPost);
  post.uid = createFeedPostUid();
  // post.initUid = parentPost.init_uid;
  // post.feedPostContentUid = parentPost.feedPostContentUid;
  // post.parentUid = parentPost.uid;
  post.feedOrganizationApikey = parentPost.feedOrganizationApikey;
  post.posterUserDid = posterUserDid;
  post.posterOrganizationApikey = parentPost.feedOrganizationApikey;
  post.published = true;
  // post.lastPublisher = parentPost.lastPublisher;
  // post.lastPublishedAt = parentPost.lastPublishedAt;
  // post.ancestors = [parentPost.uid, ...(parentPost.ancestors || [])];
  return post;
}


function repostFeedPost({
  post: parentPost,
  feedOrganizationApikey,
  feedUserDid,
  posterOrganizationApikey,
  posterUserDid,
  publishable,
}){
  return {
    ...descendFromFeedPost(parentPost),
    feedOrganizationApikey,
    feedUserDid,
    posterOrganizationApikey,
    posterUserDid,
    publishable,
  };
}














function validateFeedPost(post){
  if (typeof post !== 'object') throw new Error('post must be an object');

  if (!post.feedUserDid && !post.feedOrganizationApikey)
    throw new Error('post must have feedUserDid or feedOrganizationApikey');

  if (post.parentUid && (post.title || post.body))
    throw new Error('posts with a parentUid cannot have a title or a body');

  if (!post.parentUid && !post.title && !post.body)
    throw new Error('posts must have a parentUid, title and or a body');
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
  published: 'published',
  created_at: 'createdAt',
  deleted_at: 'deletedAt',
  deleted_by_user_did: 'deletedByUserDid',
  edited: 'edited',
  last_publishing_organization_apikey: 'lastPublishingOrganizationApikey',
  last_publishing_user_did: 'lastPublishingUserDid',
  last_published_at: 'lastPublishedAt',
  comment_count: 'commentCount',
  upvote_count: 'upvoteCount',
  downvote_count: 'downvoteCount',
  my_vote: 'myVote',
  publishable: 'publishable',
  ancestors: 'ancestors',
});

const FEED_POST_CONTENT_COLUMN_TO_PROP = Object.freeze({
  uid: 'uid',
  title: 'title',
  body: 'body',
  media_url: 'mediaUrl',
  media_mime_type: 'mediaMimeType',
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
      if (value === false || value === null) value = undefined;
      post[prop] = value;
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
      p[prop] = contents[prop];
    });
    Object.values(FEED_POST_COLUMN_TO_PROP).forEach(prop => {
      p[prop] = post[prop];
    });
    return p;
  })();

  if (post.parentUid && post.feedUserDid){
    // repost to a user profile feed
    post.repost = true;
  }

  if (
    // its a hub forum post
    (post.feedOrganizationApikey && !post.published) &&
    // that came from somewhere
    post.parentUid
  ){
    if (post.posterUserDid) {
      // repost to a hub forum
      post.repost = true;
    }else{
      // consumed to a hub forum
      post.consumed = true;
    }
  }

  if (post.deletedAt){
    post.deletedByPoster = !!(
      post.deletedByUserDid &&
      post.posterUserDid &&
      post.deletedByUserDid === post.posterUserDid
    );
    post.deletedByUserDid = undefined;
    post.feedPostContentUid = undefined;
    post.edited = undefined;
    post.posterUserDid = undefined;
    post.posterOrganizationApikey = undefined;
    post.title = undefined;
    post.body = undefined;
    post.mediaUrl = undefined;
    post.mediaMimeType = undefined;
    post.publishable = undefined;
  }
  return post;
}

function postIsMissingContent(post){
  return post && !post.initPosterUserDid;
}

const isBlank = x => !x || x.trim() === '';

function validateFeedPostContents(post){
  if (post.title && typeof post.title !== 'string') throw new Error('post.title must be a string');
  if (post.body && typeof post.body !== 'string') throw new Error('post.body must be a string');
  if (isBlank(post.title) && isBlank(post.body)) throw new Error('one of post.title or post.body is required');
}

function validateNewFeedPost(post){
  if (typeof post !== 'object') throw new Error('post must be an object');

  if (!post.feedOrganizationApikey && !post.feedUserDid)
    throw new Error('post.feedOrganizationApikey or post.feedUserDid is required');

  if (post.feedOrganizationApikey && post.feedUserDid)
    throw new Error('post.feedOrganizationApikey and post.feedUserDid are incompatible options');

  if (post.feedOrganizationApikey){
    if (typeof post.publishable !== 'boolean')
      throw new Error('post.publishable must be a boolean');
  }
  if (post.feedUserDid){
    if (post.publishable !== true)
      throw new Error('post.publishable must be true');
  }

  if (!post.parentUid) validateFeedPostContents(post);
}

module.exports = {
  createFeedPostUid,
  createFeedPost,
  descendFromFeedPost,
  publishOrganizationForumPost,
  repostFeedPost,


  FEED_POST_CONTENT_PROPS,
  validateFeedPost,
  recordToFeedPostContent,
  recordToFeedPost,
  addContentsToFeedPost,
  postIsMissingContent,
  validateNewFeedPost,
  validateFeedPostContents,
};