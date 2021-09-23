'use strict';

const { _, definePattern } = require('./test/matchers');
require('./organizations.matchers');

function expectOneOfToExist(post, props){
  if (props.some(prop => post[prop])) return;
  expect.fail(true, false, `expected one of ${props.join(', ')} to exist`);
}

definePattern('aFeedPostUid', target =>
  _.isString(target) && target.length === 32
);

definePattern('aFeedPost', post => {
  expect(post).to.matchPattern({
    uid: _.isFeedPostUid,
    feedPostContentUid: _.isFeedPostUid,
    posterUserDid: _.isUndefinedOr(_.isDID), // undefined on reposts
    posterOrganizationApikey: _.isUndefinedOr(_.isOrganizationApikey),
    initUid: _.isFeedPostUid,
    initCreatedAt: _.isDateOrAnISODateString,
    initPosterUserDid: _.isDID,
    initFeedOrganizationApikey: _.isUndefinedOr(_.isOrganizationApikey),
    initPosterOrganizationApikey: _.isUndefinedOr(_.isOrganizationApikey),
    createdAt: _.isDateOrAnISODateString,
    contentCreatedAt: _.isDateOrAnISODateString,
    feedUserDid: _.isUndefinedOr(_.isDID),
    initFeedUserDid: _.isUndefinedOr(_.isDID),
    feedOrganizationApikey: _.isUndefinedOr(_.isOrganizationApikey),
    title: _.isUndefinedOr(_.isString),
    body: _.isUndefinedOr(_.isString),
    updatedAt: _.isUndefinedOr(_.isDateOrAnISODateString),
    deletedAt: _.isUndefinedOr(_.isDateOrAnISODateString),
    deletedByPoster: _.isUndefinedOr(_.isBoolean),
    '...': 1,
  });

  expectOneOfToExist(post, ['feedUserDid', 'feedOrganizationApikey']);
  expectOneOfToExist(post, ['title', 'body']);
});

definePattern('aRootFeedPost', post => {
  expect(post).to.be.aFeedPost();
  expect(post).to.matchPattern({
    posterUserDid: _.isDID,
    parentUid: undefined,
    '...': 1,
  });
  expect(post.uid).to.equal(post.initUid);
  if (!post.updatedAt) expect(post.uid).to.equal(post.feedPostContentUid);
});

definePattern('aConsumedFeedPost', post => {
  expect(post).to.be.anOrganizationForumFeedPost();
  expect(post).to.matchPattern({
    parentUid: _.isFeedPostUid,
    posterUserDid: undefined,
    lastPublishingUserDid: _.isUndefinedOr(_.isDID),
    lastPublishingOrganizationApikey: _.isUndefinedOr(_.isOrganizationApikey),
    lastPublishedAt: _.isDateOrAnISODateString,
    '...': 1,
  });
  expect(post.uid).to.not.equal(post.initUid);
  expectOneOfToExist(post, ['lastPublishingUserDid', 'lastPublishingOrganizationApikey']);
});

definePattern(
  'aFeedPostConsuming',
  (consumerPost, {post: parentPost, feedOrganizationApikey}) => {
    expect(consumerPost).to.be.aConsumedFeedPost();
    expect(parentPost).to.be.aPublishedFeedPost();
    expect(consumerPost.uid).to.not.equal(parentPost.uid);
    expect(consumerPost).matchPattern({
      ...parentPost,
      posterUserDid: undefined,
      uid: _.isFeedPostUid,
      createdAt: parentPost.createdAt,
      visibleTo: 0,
      maxVisibleTo: parentPost.maxVisibleTo,
      feedOrganizationApikey,
      parentUid: parentPost.uid,
      lastPublishingUserDid: parentPost.posterUserDid,
      lastPublishingOrganizationApikey: parentPost.posterOrganizationApikey,
      lastPublishedAt: parentPost.createdAt,
      posterOrganizationApikey: undefined,
    });
  },
);

definePattern('aPublishedFeedPost', post => {
  expect(post).to.be.aFeedPost();
  expect(post).to.matchPattern({
    visibleTo: _.isIncludedIn([1,2,3]),
    '...': 1,
  });
});

definePattern('anOrganizationPublishedFeedPost', post => {
  expect(post).to.be.aFeedPost();
  expect(post).to.matchPattern({
    feedOrganizationApikey: _.isOrganizationApikey,
    feedUserDid: undefined,
    parentUid: _.isFeedPostUid,
    visibleTo: _.isIncludedIn([1,2,3]),
    '...': 1,
  });
});

definePattern(
  'anOrganizationPublishedFeedPostFor',
  (publishedPost, parentPost) => {
    expect(publishedPost).to.be.anOrganizationPublishedFeedPost();
    expect(parentPost).to.be.anOrganizationForumFeedPost();
    expect(publishedPost.uid).to.not.equal(parentPost.uid);
    expect(publishedPost).matchPattern({
      ...parentPost,
      uid: _.isFeedPostUid,
      parentUid: parentPost.uid,
      visibleTo: _.isIncludedIn([1,2,3]),
      ancestors: parentPost.ancestors
        ? [parentPost.uid, ...parentPost.ancestors]
        : _.isUndefinedOr(_.isArray)
      ,
      createdAt: _.isDateOrAnISODateString,
      updatedAt: _.isUndefinedOr(_.isDateOrAnISODateString),
      deletedAt: _.isUndefinedOr(_.isDateOrAnISODateString),
      deletedByPoster: _.isUndefinedOr(_.isBoolean),
      feedOrganizationApikey: parentPost.feedOrganizationApikey,
      posterUserDid: _.isDID,
      posterOrganizationApikey: parentPost.feedOrganizationApikey,
    });
  },
);

definePattern('anOrganizationForumFeedPost', post => {
  expect(post).to.be.aFeedPost();
  expect(post).to.matchPattern({
    feedUserDid: undefined,
    feedOrganizationApikey: _.isOrganizationApikey,
    visibleTo: 0,
    '...': 1,
  });
});

definePattern('aUserPublicProfileFeedPost', post => {
  expect(post).to.be.aFeedPost();
  expect(post).to.matchPattern({
    feedOrganizationApikey: undefined,
    feedUserDid: _.isDID,
    '...': 1,
  });
});

definePattern('aFeedPostPublishedBy', (post, expectedPublisher) => {
  expect(post).to.be.aFeedPost();
  const publisher = post.visibleTo > 0 && {
    posterUserDid: post.posterUserDid,
    posterOrganizationApikey: post.posterOrganizationApikey,
  };
  expect(publisher).to.matchPattern(expectedPublisher);
});

definePattern('aRepostFeedPost', post => {
  expect(post).to.be.aFeedPost();
  expect(post).to.matchPattern({
    posterUserDid: _.isDID,
    parentUid: _.isFeedPostUid,
    '...': 1,
  });
  return (
    !post.feedOrganizationApikey ||
    post.visibleTo === 0
  );
});
