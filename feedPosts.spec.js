'use strict';

const {
  createForumFeedPost,
  createPublicProfileFeedPost,
  editFeedPost,
  repostFeedPostToForum,
  repostFeedPostToPublicProfile,
  publishOrganizationForumPost,
  consumeFeedPost,

  feedPostToRecords,
  recordToFeedPost,
  // validateFeedPost,
  recordToFeedPostContent,
  // recordToFeedPost,
  addContentsToFeedPost,
  postIsMissingContent,
  // validateNewFeedPost,
  validateFeedPostContents,
} = require('./feedPosts');

require('./feedPosts.matchers');

describe('feedPosts', function(){

  describe('createFeedPostUid', function(){
    it('should generate uuids', function(){
      const createFeedPostUid = () =>
        (Math.random() > 0.5 ? createPublicProfileFeedPost : createForumFeedPost)({
          feedOrganizationApikey: 'x',
          feedUserDid: 'did:jlinc:x',
          posterUserDid: 'did:jlinc:x',
          visibleTo: 2,
          maxVisibleTo: 2,
          title: 'x',
        }).uid
      ;
      const n = 1000;
      const set = new Set;
      _.times(n, () => { set.add(createFeedPostUid()); });
      expect(set.size).to.equal(n);
    });
  });

  it('should work like this', function(){
    const userPublishedRootPost = createPublicProfileFeedPost({
      feedUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      visibleTo: 2,
      title: 'Example 1',
      body: '<p>user posts to their own feed</p>',
    });

    expect(userPublishedRootPost).to.be.aRootFeedPost();
    expect(userPublishedRootPost).to.be.aUserPublicProfileFeedPost();
    expect(userPublishedRootPost).to.be.aPublishedFeedPost();
    expect(userPublishedRootPost).to.not.be.anOrganizationForumFeedPost();
    expect(userPublishedRootPost).to.not.be.aConsumedFeedPost();
    expect(userPublishedRootPost).to.not.be.anOrganizationPublishedFeedPost();
    expect(userPublishedRootPost).to.be.aFeedPostPublishedBy({
      posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
    });

    expect(userPublishedRootPost).to.matchPattern({
      visibleTo: 2,
      maxVisibleTo: 2,
      feedUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      title: 'Example 1',
      body: '<p>user posts to their own feed</p>',
      uid: _.isFeedPostUid,
      feedPostContentUid: userPublishedRootPost.uid,
      initUid: userPublishedRootPost.uid,
      initFeedUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      initPosterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      createdAt: _.isDate,
      contentCreatedAt: _.isDate,
      initCreatedAt: userPublishedRootPost.createdAt,
      ancestors: [],
    });

    const organizationFormRootPostAsUser = createForumFeedPost({
      feedOrganizationApikey: 'halliburton',
      posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      title: 'Example 2',
      body: `<p>user posts to a hub's forum as their public profile</p>`,
      maxVisibleTo: 2,
    });

    expect(organizationFormRootPostAsUser.uid).to.not.equal(userPublishedRootPost.uid);
    expect(organizationFormRootPostAsUser).to.be.aRootFeedPost();
    expect(organizationFormRootPostAsUser).to.be.anOrganizationForumFeedPost();
    expect(organizationFormRootPostAsUser).to.not.be.aPublishedFeedPost();
    expect(organizationFormRootPostAsUser).to.not.be.aUserPublicProfileFeedPost();
    expect(organizationFormRootPostAsUser).to.not.be.aConsumedFeedPost();
    expect(organizationFormRootPostAsUser).to.not.be.anOrganizationPublishedFeedPost();
    expect(organizationFormRootPostAsUser).to.not.be.aRepostFeedPost();

    expect(organizationFormRootPostAsUser).to.matchPattern({
      feedOrganizationApikey: 'halliburton',
      visibleTo: 0,
      maxVisibleTo: 2,
      posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      title: 'Example 2',
      body: `<p>user posts to a hub's forum as their public profile</p>`,
      uid: _.isFeedPostUid,
      feedPostContentUid: organizationFormRootPostAsUser.uid,
      initUid: organizationFormRootPostAsUser.uid,
      initPosterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      initFeedOrganizationApikey: 'halliburton',
      createdAt: _.isDate,
      contentCreatedAt: _.isDate,
      initCreatedAt: organizationFormRootPostAsUser.createdAt,
      ancestors: [],
    });

    const organizationFormRootPostAsOrg = createForumFeedPost({
      feedOrganizationApikey: 'halliburton',
      maxVisibleTo: 3,
      posterOrganizationApikey: 'halliburton',
      posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      title: 'Example 3',
      body: `<p>user posts to a hub's forum as that hub</p>`,
    });
    expect(organizationFormRootPostAsOrg).to.be.aRootFeedPost();
    expect(organizationFormRootPostAsOrg).to.be.anOrganizationForumFeedPost();
    expect(organizationFormRootPostAsOrg).to.not.be.aPublishedFeedPost();
    expect(organizationFormRootPostAsOrg).to.not.be.aUserPublicProfileFeedPost();
    expect(organizationFormRootPostAsOrg).to.not.be.aConsumedFeedPost();
    expect(organizationFormRootPostAsOrg).to.not.be.anOrganizationPublishedFeedPost();
    expect(organizationFormRootPostAsOrg).to.not.be.aRepostFeedPost();

    expect(organizationFormRootPostAsOrg).to.matchPattern({
      feedOrganizationApikey: 'halliburton',
      visibleTo: 0,
      maxVisibleTo: 3,
      posterOrganizationApikey: 'halliburton',
      posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      title: 'Example 3',
      body: `<p>user posts to a hub's forum as that hub</p>`,
      uid: _.isFeedPostUid,
      feedPostContentUid: organizationFormRootPostAsOrg.uid,
      initUid: organizationFormRootPostAsOrg.uid,
      initPosterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
      initPosterOrganizationApikey: 'halliburton',
      initFeedOrganizationApikey: 'halliburton',
      createdAt: _.isDate,
      contentCreatedAt: _.isDate,
      initCreatedAt: organizationFormRootPostAsOrg.createdAt,
      ancestors: [],
    });

    expect(() => {
      publishOrganizationForumPost({
        post: organizationFormRootPostAsUser,
        posterUserDid: 'did:jlinc:acuratoroftheupmostaccord',
        visibleTo: 0,
        maxVisibleTo: 2,
      });
    }).to.throw(
      'invalid visibleTo. Given 0 but minimum visibleTo ' +
      'value when publishing feed posts is 1'
    );

    const organizationPublishedPost = publishOrganizationForumPost({
      post: organizationFormRootPostAsUser,
      posterUserDid: 'did:jlinc:acuratoroftheupmostaccord',
      visibleTo: 2,
      maxVisibleTo: 2,
    });

    expect(organizationPublishedPost).to.be.aPublishedFeedPost();
    expect(organizationPublishedPost).to.be.anOrganizationPublishedFeedPost();
    expect(organizationPublishedPost).to.not.be.aRootFeedPost();
    expect(organizationPublishedPost).to.not.be.anOrganizationForumFeedPost();
    expect(organizationPublishedPost).to.not.be.aUserPublicProfileFeedPost();
    expect(organizationPublishedPost).to.not.be.aConsumedFeedPost();
    expect(organizationPublishedPost).to.not.be.aRepostFeedPost();
    expect(organizationPublishedPost).to.be.aFeedPostPublishedBy({
      posterOrganizationApikey: 'halliburton',
      posterUserDid: 'did:jlinc:acuratoroftheupmostaccord',
    });

    expect(organizationPublishedPost).to.matchPattern({
      initCreatedAt: organizationFormRootPostAsUser.createdAt,
      initUid: organizationFormRootPostAsUser.initUid,
      initPosterUserDid: organizationFormRootPostAsUser.initPosterUserDid,
      initFeedOrganizationApikey: organizationFormRootPostAsUser.initFeedOrganizationApikey,
      initPosterOrganizationApikey: organizationFormRootPostAsUser.initPosterOrganizationApikey,
      feedPostContentUid: organizationFormRootPostAsUser.feedPostContentUid,
      title: organizationFormRootPostAsUser.title,
      body: organizationFormRootPostAsUser.body,
      parentUid: organizationFormRootPostAsUser.uid,
      ancestors: [organizationFormRootPostAsUser.uid],
      createdAt: _.isDate,
      contentCreatedAt: _.isDate,
      uid: _.isFeedPostUid,
      visibleTo: 2,
      maxVisibleTo: 2,
      feedOrganizationApikey: organizationFormRootPostAsUser.feedOrganizationApikey,
      posterUserDid: 'did:jlinc:acuratoroftheupmostaccord',
      posterOrganizationApikey: organizationFormRootPostAsUser.feedOrganizationApikey,
    });

    expect(() => {
      repostFeedPostToPublicProfile({
        post: organizationPublishedPost,
        posterUserDid: 'did:jlinc:harrythefabelguy',
        visibleTo: 0,
      });
    }).to.throw('public profile feed posts must be visibleTo >= 2');

    const userPublishedRepost = repostFeedPostToPublicProfile({
      post: organizationPublishedPost,
      posterUserDid: 'did:jlinc:harrythefabelguy',
      visibleTo: 2,
    });
    expect(userPublishedRepost).to.be.aPublishedFeedPost();
    expect(userPublishedRepost).to.be.aUserPublicProfileFeedPost();
    expect(userPublishedRepost).to.be.aRepostFeedPost();
    expect(userPublishedRepost).to.not.be.anOrganizationPublishedFeedPost();
    expect(userPublishedRepost).to.not.be.aRootFeedPost();
    expect(userPublishedRepost).to.not.be.anOrganizationForumFeedPost();
    expect(userPublishedRepost).to.not.be.aConsumedFeedPost();
    expect(userPublishedRepost).to.be.aFeedPostPublishedBy({
      posterUserDid: 'did:jlinc:harrythefabelguy',
    });

    expect(userPublishedRepost).to.matchPattern({
      initCreatedAt: organizationFormRootPostAsUser.createdAt,
      initUid: organizationFormRootPostAsUser.initUid,
      initPosterUserDid: organizationFormRootPostAsUser.initPosterUserDid,
      initFeedOrganizationApikey: organizationFormRootPostAsUser.initFeedOrganizationApikey,
      initPosterOrganizationApikey: organizationFormRootPostAsUser.initPosterOrganizationApikey,
      feedPostContentUid: organizationFormRootPostAsUser.feedPostContentUid,
      title: organizationFormRootPostAsUser.title,
      body: organizationFormRootPostAsUser.body,
      parentUid: organizationPublishedPost.uid,
      ancestors: [
        organizationPublishedPost.uid,
        organizationFormRootPostAsUser.uid,
      ],
      createdAt: _.isDate,
      contentCreatedAt: _.isDate,
      uid: _.isFeedPostUid,
      feedUserDid: 'did:jlinc:harrythefabelguy',
      posterUserDid: 'did:jlinc:harrythefabelguy',
      visibleTo: 2,
      maxVisibleTo: 2,
      lastPublishingUserDid: organizationPublishedPost.posterUserDid,
      lastPublishingOrganizationApikey: organizationPublishedPost.posterOrganizationApikey,
      lastPublishedAt: organizationPublishedPost.createdAt,
    });

    const organizationFormRepost = repostFeedPostToForum({
      post: userPublishedRepost,
      feedOrganizationApikey: 'exon',
      posterUserDid: 'did:jlinc:somewickedpersonspublicprofiledid',
    });
    expect(organizationFormRepost).to.be.anOrganizationForumFeedPost();
    expect(organizationFormRepost).to.be.aRepostFeedPost();
    expect(organizationFormRepost).to.not.be.aPublishedFeedPost();
    expect(organizationFormRepost).to.not.be.aUserPublicProfileFeedPost();
    expect(organizationFormRepost).to.not.be.anOrganizationPublishedFeedPost();
    expect(organizationFormRepost).to.not.be.aRootFeedPost();
    expect(organizationFormRepost).to.not.be.aConsumedFeedPost();

    expect(organizationFormRepost).to.matchPattern({
      initCreatedAt: organizationFormRootPostAsUser.createdAt,
      initUid: organizationFormRootPostAsUser.initUid,
      initPosterUserDid: organizationFormRootPostAsUser.initPosterUserDid,
      initFeedOrganizationApikey: organizationFormRootPostAsUser.initFeedOrganizationApikey,
      initPosterOrganizationApikey: organizationFormRootPostAsUser.initPosterOrganizationApikey,
      feedPostContentUid: organizationFormRootPostAsUser.feedPostContentUid,
      title: organizationFormRootPostAsUser.title,
      body: organizationFormRootPostAsUser.body,
      parentUid: userPublishedRepost.uid,
      ancestors: [
        userPublishedRepost.uid,
        organizationPublishedPost.uid,
        organizationFormRootPostAsUser.uid,
      ],
      createdAt: _.isDate,
      contentCreatedAt: _.isDate,
      uid: _.isFeedPostUid,
      feedOrganizationApikey: 'exon',
      posterUserDid: 'did:jlinc:somewickedpersonspublicprofiledid',
      visibleTo: 0,
      maxVisibleTo: 2,
      lastPublishingUserDid: userPublishedRepost.posterUserDid,
      lastPublishingOrganizationApikey: userPublishedRepost.posterOrganizationApikey,
      lastPublishedAt: userPublishedRepost.createdAt,
    });

    const organizationFormConsumedPost = consumeFeedPost({
      feedOrganizationApikey: 'shell',
      post: organizationPublishedPost,
    });
    expect(organizationFormConsumedPost).to.be.anOrganizationForumFeedPost();
    expect(organizationFormConsumedPost).to.be.aConsumedFeedPost();
    expect(organizationFormConsumedPost).to.not.be.aPublishedFeedPost();
    expect(organizationFormConsumedPost).to.not.be.aUserPublicProfileFeedPost();
    expect(organizationFormConsumedPost).to.not.be.anOrganizationPublishedFeedPost();
    expect(organizationFormConsumedPost).to.not.be.aRootFeedPost();
    expect(organizationFormConsumedPost).to.not.be.aRepostFeedPost();
    expect(organizationFormConsumedPost).to.matchPattern({
      initCreatedAt: organizationFormRootPostAsUser.createdAt,
      initUid: organizationFormRootPostAsUser.initUid,
      initPosterUserDid: organizationFormRootPostAsUser.initPosterUserDid,
      initFeedOrganizationApikey: organizationFormRootPostAsUser.initFeedOrganizationApikey,
      initPosterOrganizationApikey: organizationFormRootPostAsUser.initPosterOrganizationApikey,
      feedPostContentUid: organizationFormRootPostAsUser.feedPostContentUid,
      title: organizationFormRootPostAsUser.title,
      body: organizationFormRootPostAsUser.body,
      parentUid: organizationPublishedPost.uid,
      ancestors: [
        organizationPublishedPost.uid,
        organizationFormRootPostAsUser.uid,
      ],
      createdAt: _.isDate,
      contentCreatedAt: _.isDate,
      visibleTo: 0,
      maxVisibleTo: 2,
      uid: _.isFeedPostUid,
      feedOrganizationApikey: 'shell',
      lastPublishingUserDid: organizationPublishedPost.posterUserDid,
      lastPublishingOrganizationApikey: organizationPublishedPost.posterOrganizationApikey,
      lastPublishedAt: organizationPublishedPost.createdAt,
    });

    const withoutUndefineds = object =>
      _.pickBy(object, x => typeof x !== 'undefined');

    Object.entries({
      userPublishedRootPost,
      organizationFormRootPostAsUser,
      organizationFormRootPostAsOrg,
      organizationPublishedPost,
      userPublishedRepost,
      organizationFormRepost,
      organizationFormConsumedPost,
    }).forEach(([name, post]) => {
      const records = feedPostToRecords(post);
      if (records.feed_post && records.feed_post.ancestors)
        records.feed_post.ancestors = JSON.parse(records.feed_post.ancestors);
      const copyOfPost = recordToFeedPost({
        ...records.feed_post_content,
        content_created_at: (
          records.feed_post_content &&
          records.feed_post_content.created_at
        ),
        ...records.feed_post,
      });
      expect(
        withoutUndefineds(copyOfPost)
      ).to.deep.equal(
        withoutUndefineds(post),
        `${name} did not serialize properly!`,
      );
    });
  });

  describe('createForumFeedPost', function() {
    context('when given invalid options', function() {
      it('should throw an Error', function() {
        let options = {};
        const call = () =>
          expect(() => { createForumFeedPost({...options}); });
        const expectError = (error) => call().to.throw(error);
        const expectNoError = () => call().to.not.throw();
        expectError('feedOrganizationApikey is required');
        options.feedOrganizationApikey = 'wlanetpork';
        expectError('maxVisibleTo is required');
        options.maxVisibleTo = 2;
        expectError('posterUserDid is required');
        options.posterUserDid = 'did:jlinc:whatever';
        expectError('one of post.title or post.body is required');
        options.title = '';
        expectError('one of post.title or post.body is required');
        delete options.title;
        options.body = '';
        expectError('one of post.title or post.body is required');
        options.title = 'x';
        expectNoError();
        delete options.title;
        options.body = 'x';
        expectNoError();
      });
    });
  });

  describe('createPublicProfileFeedPost', function() {
    context('when given invalid options', function() {
      it('should throw an Error', function() {
        let options = {};
        const call = () =>
          expect(() => { createPublicProfileFeedPost({...options}); });
        const expectError = (error) => call().to.throw(error);
        const expectNoError = () => call().to.not.throw();
        expectError('feedUserDid is required');
        options.feedUserDid = 'did:jlinc:fakedidupinhere';
        expectError('posterUserDid is required');
        options.posterUserDid = 'did:jlinc:whatever';
        expectError('feedUserDid must equal posterUserDid');
        options.posterUserDid = options.feedUserDid;
        expectError('visibleTo is required');
        options.visibleTo = 2;
        expectError('one of post.title or post.body is required');
        options.title = 'x';
        expectNoError();
        delete options.title;
        options.body = 'x';
        expectNoError();
      });
    });
  });

  describe('editFeedPost', function() {
    context('when given invalid arguments', function() {
      it('should throw', function(){
        let options = {};
        const expectError = error =>
          expect(() => { editFeedPost(options); }).to.throw(error);
        expectError('post is required');
        options.post = {};
        expectError('one of title or body is required');
        options.title = 12;
        expectError('title must be a string');
        delete options.title;
        options.body = 12;
        expectError('body must be a string');
        options.body = 'Hello';
        expectError('maxVisibleTo is required');
        options.maxVisibleTo = 99;
        expectError('maxVisibleTo=99 is invalid');
        options.maxVisibleTo = 2;
        expect(() => { editFeedPost(options); }).to.not.throw();
      });
    });
    it('should return a modified post', function() {
      const postV1 = createPublicProfileFeedPost({
        feedUserDid: 'did:jlinc:fakedidupinhere',
        posterUserDid: 'did:jlinc:fakedidupinhere',
        visibleTo: 2,
        title: 'v1.0',
      });
      expect(postV1).to.be.aFeedPost();
      const postV2 = editFeedPost({
        post: postV1,
        title: 'v2.0',
      });
      expect(postV2).to.be.aFeedPost();
      expect(postV2).to.matchPattern({
        ...postV1,
        feedPostContentUid: _.isFeedPostUid,
        title: 'v2.0',
        updatedAt: _.isDate,
      });
      expect(postV2.feedPostContentUid).to.not.equal(postV1.feedPostContentUid);

      expect(
        editFeedPost({
          post: postV1,
          title: '',
          body: 'Post 3.0!',
        })
      ).to.matchPattern({
        title: undefined,
        body: 'Post 3.0!',
        '...': 1,
      });

      expect(
        editFeedPost({
          post: postV1,
          title: 'v10.1',
          body: '   ',
        })
      ).to.matchPattern({
        title: 'v10.1',
        body: undefined,
        '...': 1,
      });

      expect(
        editFeedPost({
          post: postV1,
          body: '   ',
        })
      ).to.matchPattern({
        title: 'v1.0',
        body: undefined,
        '...': 1,
      });
    });
  });

  describe('repostFeedPostToForum', function() {
    context('when given invalid options', function() {
      it('should throw an Error', function() {
        let options = {};
        const call = () =>
          expect(() => { repostFeedPostToForum({...options}); });
        const expectError = (error) => call().to.throw(error);
        const expectNoError = () => call().to.not.throw();
        expectError('posterUserDid is required');
        options.posterUserDid = 'did:jlinc:fakedidupinhere';
        expectError('feedOrganizationApikey is required');
        options.feedOrganizationApikey = 'did:jlinc:fakedidupinhere';
        expectError('post is required');
        options.post = {};
        expectError('post.initUid is required');
        options.post.initUid = 'd30b3d83e223fa4820fbdca101a882f4';
        expectError('post.initPosterUserDid is required');
        options.post.initPosterUserDid = 'did:jlinc:dogsliketoeatpoop';
        expectError('post.feedPostContentUid is required');
        options.post.feedPostContentUid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.uid is required');
        options.post.uid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.visibleTo is required');
        options.post.visibleTo = 3;
        expectError('post.maxVisibleTo is required');
        options.post.maxVisibleTo = 0;
        expectError('post.ancestors is required');
        options.post.ancestors = [];
        expectNoError();
      });
    });
  });

  describe('repostFeedPostToPublicProfile', function() {
    let call, expectError, expectNoError, goodPost;
    const posterUserDid = 'did:jlinc:fakedidupinhere';
    beforeEach(function(){
      goodPost = {
        uid: 'd30b3d83e223fa4820fbdca101a882f4',
        initUid: 'd30b3d83e223fa4820fbdca101a882f4',
        initPosterUserDid: 'did:jlinc:dogsliketoeatpoop',
        feedPostContentUid: '8101a882f4d30b3d83e223fa4820fbdc',
        ancestors: [],
        visibleTo: 2,
        maxVisibleTo: 3,
      };
      call = options =>
        repostFeedPostToPublicProfile({...options});
      expectError = (options, error) =>
        expect(()=>{ call(options); }).to.throw(error);
      expectNoError = options =>
        expect(()=>{ call(options); }).to.not.throw();
    });

    context('when given invalid options', function() {
      it('should throw an Error', function() {
        let options = {};
        expectError = expectError.bind(null, options);
        expectNoError = expectNoError.bind(null, options);
        expectError('post is required');
        options.post = {};
        expectError('posterUserDid is required');
        options.posterUserDid = 'did:jlinc:fakedidupinhere';
        expectError('visibleTo is required');
        options.visibleTo = 12;
        expectError('visibleTo=12 is invalid');
        options.visibleTo = 0;
        expectError('public profile feed posts must be visibleTo >= 2');
        options.visibleTo = 2;
        expectError('post.initUid is required');
        options.post.initUid = 'd30b3d83e223fa4820fbdca101a882f4';
        expectError('post.initPosterUserDid is required');
        options.post.initPosterUserDid = 'did:jlinc:dogsliketoeatpoop';
        expectError('post.feedPostContentUid is required');
        options.post.feedPostContentUid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.uid is required');
        options.post.uid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.visibleTo is required');
        options.post.visibleTo = 3;
        expectError('post.maxVisibleTo is required');
        options.post.maxVisibleTo = 0;
        expectError('you cannot repost unpublished posts');
        options.post.maxVisibleTo = 2;
        expectError('post.ancestors is required');
        options.post.ancestors = [];
        expectNoError();
      });
    });

    context('when given a post that is not published', function() {
      it('should throw an Error', function() {
        expectError(
          {
            post: {
              ...goodPost,
              visibleTo: 0,
              maxVisibleTo: 0,
            },
            posterUserDid,
            visibleTo: 3,
            maxVisibleTo: 3,
          },
          'you cannot repost unpublished posts',
        );
      });
    });

    context('when given a visibleTo < 2', function() {
      it('should throw an Error', function() {
        [0, 1].forEach(visibleTo => {
          expectError(
            {
              post: {...goodPost},
              posterUserDid,
              visibleTo,
              maxVisibleTo: 3,
            },
            'public profile feed posts must be visibleTo >= 2',
          );
        });
      });
    });

    context('when given a visibleTo that esceeds the given post.maxVisibleTo', function() {
      it('should throw an Error', function() {
        const test = (postMaxVisibleTo, repostVisibleTo, error) => {
          expect(()=>{
            repostFeedPostToPublicProfile({
              post: {
                uid: 'd30b3d83e223fa4820fbdca101a882f4',
                initUid: 'd30b3d83e223fa4820fbdca101a882f4',
                initPosterUserDid: 'did:jlinc:dogsliketoeatpoop',
                feedPostContentUid: '8101a882f4d30b3d83e223fa4820fbdc',
                visibleTo: 2,
                maxVisibleTo: postMaxVisibleTo,
                ancestors: [],
              },
              posterUserDid: 'did:jlinc:fakedidupinhere',
              visibleTo: repostVisibleTo,
            });
          }).to.throw(error);
        };

        test(1, 2, `you cannot repost unpublished posts`);
        test(1, 3, `you cannot repost unpublished posts`);
        test(2, 3, `visibleTo cannot exceed post.maxVisibleTo. 3 > 2`);
      });
    });

  });

  describe('publishOrganizationForumPost', function() {
    context('when given invalid options', function() {
      it('should throw an Error', function() {
        let options = {};
        const call = () =>
          expect(() => { publishOrganizationForumPost({...options}); });
        const expectError = (error) => call().to.throw(error);
        const expectNoError = () => call().to.not.throw();
        expectError('posterUserDid is required');
        options.posterUserDid = 'did:jlinc:fakedidupinhere';
        expectError('post is required');
        options.post = {};
        expectError('visibleTo is required');
        options.visibleTo = 2;
        expectError('post.initUid is required');
        options.post.initUid = 'd30b3d83e223fa4820fbdca101a882f4';
        expectError('post.initPosterUserDid is required');
        options.post.initPosterUserDid = 'did:jlinc:dogsliketoeatpoop';
        expectError('post.feedPostContentUid is required');
        options.post.feedPostContentUid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.uid is required');
        options.post.uid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.visibleTo is required');
        options.post.visibleTo = 3;
        expectError('post.maxVisibleTo is required');
        options.post.maxVisibleTo = 0;
        expectError('post.ancestors is required');
        options.post.ancestors = [];
        expectError('visibleTo cannot exceed post.maxVisibleTo. 2 > 0');
        options.post.maxVisibleTo = 3;
        expectNoError();
      });
    });

    it('should work like this');
  });

  describe('consumeFeedPost', function() {
    context('when given invalid options', function() {
      it('should throw an Error', function() {
        let options = {};
        const call = () =>
          expect(() => { consumeFeedPost({...options}); });
        const expectError = (error) => call().to.throw(error);
        const expectNoError = () => call().to.not.throw();
        expectError('post is required');
        options.post = {};
        expectError('feedOrganizationApikey is required');
        options.feedOrganizationApikey = 'wlanetpork';
        expectError('maxVisibleTo is required');
        options.maxVisibleTo = 12;
        expectError('post.maxVisibleTo is required');
        options.post.maxVisibleTo = 12;
        expectError('post.maxVisibleTo=12 is invalid');
        options.post.maxVisibleTo = 3;
        expectError('post.initUid is required');
        options.post.initUid = 'd30b3d83e223fa4820fbdca101a882f4';
        expectError('post.initPosterUserDid is required');
        options.post.initPosterUserDid = 'did:jlinc:dogsliketoeatpoop';
        expectError('post.feedPostContentUid is required');
        options.post.feedPostContentUid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.uid is required');
        options.post.uid = '8101a882f4d30b3d83e223fa4820fbdc';
        expectError('post.visibleTo is required');
        options.post.visibleTo = 3;
        expectError('post.ancestors is required');
        options.post.ancestors = [];
        expectError('post.createdAt is required');
        options.post.createdAt = new Date;
        expectError('post.posterUserDid is required');
        options.post.posterUserDid = 'did:jlinc:dogsliketoeatpoop';
        expectNoError();
      });
    });

    context('when given a post that is not published', function() {
      it('should throw', function() {
        const feedOrganizationApikey = 'frogmall';
        const forumFeedPost = createForumFeedPost({
          feedOrganizationApikey,
          posterUserDid: 'did:jlinc:themanagerofthelocalbranch',
          title: 'Now doing blood work!',
          body: `<h1>Come on down!</h1>`,
          maxVisibleTo: 3,
        });
        expect(() => {
          consumeFeedPost({feedOrganizationApikey, post: forumFeedPost});
        }).to.throw('only published posts can be consumed');
      });
    });
    it('should create a new forum feed post consuming the published post', function() {
      const rootPost = createForumFeedPost({
        feedOrganizationApikey: 'hardlyhurts',
        posterUserDid: 'did:jlinc:themanagerofthelocalbranch',
        title: 'Now doing blood work!',
        body: `<h1>Come on down!</h1>`,
        maxVisibleTo: 3,
      });
      const publishedPost = publishOrganizationForumPost({
        post: rootPost,
        visibleTo: 3,
        maxVisibleTo: 3,
        posterUserDid: 'did:jlinc:themanagerofthelocalbranch',
      });
      const consumedPost = consumeFeedPost({
        post: publishedPost,
        feedOrganizationApikey: 'bloodiq',
      });
      expect(consumedPost).to.be.aConsumedFeedPost();
      expect(consumedPost).to.matchPattern({
        ...publishedPost,
        uid: _.isFeedPostUid,
        parentUid: publishedPost.uid,
        visibleTo: 0,
        maxVisibleTo: 3,
        ancestors: [publishedPost.uid, ...publishedPost.ancestors],
        feedOrganizationApikey: 'bloodiq',
        posterUserDid: undefined,
        posterOrganizationApikey: undefined,
        lastPublishingUserDid: publishedPost.posterUserDid,
        lastPublishingOrganizationApikey: publishedPost.posterOrganizationApikey,
        lastPublishedAt: publishedPost.createdAt,
      });
    });
  });

  describe('feedPostToRecords', function() {
    let post;
    context('when given a root organization forum feed post', function() {
      beforeEach(function(){
        post = createForumFeedPost({
          feedOrganizationApikey: 'soupmachine',
          posterOrganizationApikey: 'soupmachine',
          posterUserDid: 'did:jlinc:tabnineissoawesome',
          maxVisibleTo: 2,
          title: 'hail to the king baby',
          body: '<h1>YEAH!</h1>',
        });
      });
      it('should return a feed_posts record and a feed_post_contents records', function() {
        expect(feedPostToRecords(post)).to.matchPattern({
          feed_post_content: {
            created_at: post.contentCreatedAt,
            uid: post.feedPostContentUid,
            title: 'hail to the king baby',
            body: '<h1>YEAH!</h1>',
            max_visible_to: 2,
            init_created_at: post.initCreatedAt,
            init_poster_user_did: 'did:jlinc:tabnineissoawesome',
            init_poster_organization_apikey: 'soupmachine',
            init_feed_organization_apikey: 'soupmachine',
            init_feed_user_did: undefined,
          },
          feed_post: {
            uid: post.uid,
            init_uid: post.uid,
            feed_post_content_uid: post.uid,
            parent_uid: undefined,
            feed_organization_apikey: 'soupmachine',
            poster_user_did: 'did:jlinc:tabnineissoawesome',
            poster_organization_apikey: 'soupmachine',
            created_at: post.createdAt,
            updated_at: undefined,
            deleted_at: undefined,
            deleted_by_user_did: undefined,
            last_publishing_organization_apikey: undefined,
            last_published_at: undefined,
            feed_user_did: undefined,
            ancestors: undefined,
            last_publishing_user_did: undefined,
            visible_to: 0,
            ancestors: '[]',
          },
        });
      });
    });

    context('when given a root public profile post', function() {
      beforeEach(function(){
        post = createPublicProfileFeedPost({
          feedUserDid: 'did:jlinc:onehundredcatscantakemybaby',
          posterUserDid: 'did:jlinc:onehundredcatscantakemybaby',
          visibleTo: 2,
          title: 'i fight cats',
          body: '<h1>call 1-800-ifightcats</h1>',
        });
      });
      it('should return a feed_posts record', function() {
        expect(feedPostToRecords(post)).to.matchPattern({
          feed_post_content: {
            created_at: post.contentCreatedAt,
            uid: post.feedPostContentUid,
            title: 'i fight cats',
            body: '<h1>call 1-800-ifightcats</h1>',
            max_visible_to: 2,
            init_poster_user_did: 'did:jlinc:onehundredcatscantakemybaby',
            init_created_at: post.initCreatedAt,
            init_poster_organization_apikey: undefined,
            init_feed_organization_apikey: undefined,
            init_feed_user_did: 'did:jlinc:onehundredcatscantakemybaby',
          },
          feed_post: {
            uid: post.uid,
            init_uid: post.uid,
            parent_uid: post.parentUid,
            feed_post_content_uid: post.uid,
            feed_organization_apikey: undefined,
            feed_user_did: 'did:jlinc:onehundredcatscantakemybaby',
            poster_user_did: 'did:jlinc:onehundredcatscantakemybaby',
            poster_organization_apikey: undefined,
            visible_to: 2,
            ancestors: '[]',
            created_at: post.createdAt,
            updated_at: undefined,
            deleted_at: undefined,
            deleted_by_user_did: undefined,
            last_published_at: undefined,
            last_publishing_organization_apikey: undefined,
            last_publishing_user_did: undefined,
          },
        });
      });
    });

    context('when given a repost to a forum', function() {
      let parent;
      beforeEach(function(){
        parent = createPublicProfileFeedPost({
          feedUserDid: 'did:jlinc:onehundredcatscantakemybaby',
          posterUserDid: 'did:jlinc:onehundredcatscantakemybaby',
          visibleTo: 2,
          maxVisibleTo: 2,
          title: 'i fight cats',
          body: '<h1>call 1-800-ifightcats</h1>',
        });
        post = repostFeedPostToForum({
          post: parent,
          posterUserDid: 'did:jlinc:howmanytimesmustitellyou',
          feedOrganizationApikey: 'cowsarefriends',
        });
      });
      it('should return a feed_posts record', function() {
        expect(feedPostToRecords(post)).to.matchPattern({
          feed_post: {
            uid: post.uid,
            init_uid: post.initUid,
            parent_uid: post.parentUid,
            feed_post_content_uid: post.feedPostContentUid,
            feed_organization_apikey: 'cowsarefriends',
            feed_user_did: undefined,
            poster_user_did: 'did:jlinc:howmanytimesmustitellyou',
            poster_organization_apikey: undefined,
            visible_to: 0,
            ancestors: JSON.stringify([post.parentUid]),
            created_at: post.createdAt,
            updated_at: undefined,
            deleted_at: undefined,
            deleted_by_user_did: undefined,
            last_publishing_user_did: parent.posterUserDid,
            last_publishing_organization_apikey: parent.posterOrganizationApikey,
            last_published_at: parent.createdAt,
          },
          feed_post_content: {
            created_at: post.contentCreatedAt,
            uid: post.feedPostContentUid,
            title: post.title,
            body: post.body,
            max_visible_to: 2,
            init_created_at: post.initCreatedAt,
            init_poster_user_did: post.initPosterUserDid,
            init_poster_organization_apikey: post.initPosterOrganizationApikey,
            init_feed_organization_apikey: post.initFeedOrganizationApikey,
            init_feed_user_did: post.initFeedUserDid,
          },
        });
      });
    });

    context('when given a repost to a public profile', function() {
      beforeEach(function(){
        const parent = createForumFeedPost({
          feedOrganizationApikey: 'soupmachine',
          posterOrganizationApikey: 'soupmachine',
          posterUserDid: 'did:jlinc:tabnineissoawesome',
          maxVisibleTo: 2,
          title: 'hail to the king baby',
          body: '<h1>YEAH!</h1>',
        });
        post = repostFeedPostToPublicProfile({
          post: parent,
          posterUserDid: 'did:jlinc:howmanytimesmustitellyou',
          feedOrganizationApikey: 'cowsarefriends',
          visibleTo: 2,
          maxVisibleTo: 2,
        });
      });
      it('should return a feed_posts record', function() {
        expect(feedPostToRecords(post)).to.matchPattern({
          feed_post: {
            uid: post.uid,
            init_uid: post.initUid,
            parent_uid: post.parentUid,
            feed_post_content_uid: post.feedPostContentUid,
            feed_organization_apikey: undefined,
            feed_user_did: 'did:jlinc:howmanytimesmustitellyou',
            poster_user_did: 'did:jlinc:howmanytimesmustitellyou',
            poster_organization_apikey: undefined,
            visible_to: 2,
            ancestors: JSON.stringify([post.parentUid]),
            created_at: post.createdAt,
            updated_at: undefined,
            deleted_at: undefined,
            deleted_by_user_did: undefined,
            last_published_at: undefined,
            last_publishing_organization_apikey: undefined,
            last_publishing_user_did: undefined,
          },
          feed_post_content: {
            created_at: post.contentCreatedAt,
            uid: post.feedPostContentUid,
            title: post.title,
            body: post.body,
            max_visible_to: 2,
            init_created_at: post.initCreatedAt,
            init_poster_user_did: post.initPosterUserDid,
            init_poster_organization_apikey: post.initPosterOrganizationApikey,
            init_feed_organization_apikey: post.initFeedOrganizationApikey,
            init_feed_user_did: post.initFeedUserDid,
          },
        });
      });
    });

    context('when given a root organization published feed post', function() {
      beforeEach(function(){
        const parent = createForumFeedPost({
          feedOrganizationApikey: 'soupmachine',
          posterOrganizationApikey: 'soupmachine',
          posterUserDid: 'did:jlinc:tabnineissoawesome',
          maxVisibleTo: 2,
          title: 'hail to the king baby',
          body: '<h1>YEAH!</h1>',
        });
        post = publishOrganizationForumPost({
          post: parent,
          visibleTo: 1,
          maxVisibleTo: 2,
          posterUserDid: 'did:jlinc:anadminsoniceheadminedtwice',
        });
      });
      it('should return a feed_posts record and a feed_post_contents records', function() {
        expect(feedPostToRecords(post)).to.matchPattern({
          feed_post: {
            uid: post.uid,
            parent_uid: post.parentUid,
            init_uid: post.initUid,
            feed_post_content_uid: post.feedPostContentUid,
            feed_organization_apikey: 'soupmachine',
            feed_user_did: undefined,
            poster_user_did: 'did:jlinc:anadminsoniceheadminedtwice',
            poster_organization_apikey: 'soupmachine',
            visible_to: 1,
            ancestors: JSON.stringify([post.parentUid]),
            created_at: post.createdAt,
            updated_at: undefined,
            deleted_at: undefined,
            deleted_by_user_did: undefined,
            last_published_at: undefined,
            last_publishing_organization_apikey: undefined,
            last_publishing_user_did: undefined,
          },
          feed_post_content: {
            created_at: post.contentCreatedAt,
            uid: post.feedPostContentUid,
            title: post.title,
            body: post.body,
            max_visible_to: 2,
            init_created_at: post.initCreatedAt,
            init_poster_user_did: post.initPosterUserDid,
            init_poster_organization_apikey: post.initPosterOrganizationApikey,
            init_feed_organization_apikey: post.initFeedOrganizationApikey,
            init_feed_user_did: post.initFeedUserDid,
          },
        });
      });
    });

    context('when given a consumed organization forum feed post', function() {
      beforeEach(function(){
        const root = createForumFeedPost({
          feedOrganizationApikey: 'soupmachine',
          posterOrganizationApikey: 'soupmachine',
          posterUserDid: 'did:jlinc:tabnineissoawesome',
          maxVisibleTo: 3,
          title: 'hail to the king baby',
          body: '<h1>YEAH!</h1>',
        });
        const parent = publishOrganizationForumPost({
          post: root,
          posterUserDid: 'did:jlinc:anadminsoniceheadminedtwice',
          visibleTo: 2,
        });
        post = consumeFeedPost({
          post: parent,
          feedOrganizationApikey: 'liquidfoodcon',
        });
      });
      it('should return a feed_posts record and a feed_post_contents records', function() {
        expect(feedPostToRecords(post)).to.matchPattern({
          feed_post: {
            uid: post.uid,
            parent_uid: post.parentUid,
            init_uid: post.initUid,
            feed_post_content_uid: post.feedPostContentUid,
            feed_organization_apikey: 'liquidfoodcon',
            feed_user_did: undefined,
            poster_user_did: undefined,
            poster_organization_apikey: undefined,
            visible_to: 0,
            ancestors: JSON.stringify(post.ancestors),
            created_at: post.createdAt,
            updated_at: undefined,
            deleted_at: undefined,
            deleted_by_user_did: undefined,
            last_published_at: post.createdAt,
            last_publishing_organization_apikey: 'soupmachine',
            last_publishing_user_did: 'did:jlinc:anadminsoniceheadminedtwice',
          },
          feed_post_content: {
            created_at: post.contentCreatedAt,
            uid: post.feedPostContentUid,
            title: post.title,
            body: post.body,
            max_visible_to: 3,
            init_created_at: post.initCreatedAt,
            init_poster_user_did: post.initPosterUserDid,
            init_poster_organization_apikey: post.initPosterOrganizationApikey,
            init_feed_organization_apikey: post.initFeedOrganizationApikey,
            init_feed_user_did: post.initFeedUserDid,
          },
        });
      });
    });

  });

  describe('recordToFeedPostContent', function(){
    it('should be a function', function(){
      expect(recordToFeedPostContent).to.be.a('function');
    });

    it('should convert a snake case record object to camel case', function(){
      expect(
        recordToFeedPostContent({
          uid: 'FAKE_uid',
          title: 'FAKE_title',
          body: 'FAKE_body',
          visible_to: 2,
          max_visible_to: 3,
          media_url: 'FAKE_media_url',
          media_mime_type: 'FAKE_media_mime_type',
          init_poster_user_did: 'FAKE_init_poster_user_did',
          init_poster_organization_apikey: 'FAKE_init_poster_organization_apikey',
          init_feed_organization_apikey: 'FAKE_init_feed_organization_apikey',
          init_feed_user_did: 'FAKE_init_feed_user_did',
          init_created_at: 'FAKE_init_created_at',
          ignored: 'youbet',
        })
      ).to.deep.equal({
        uid: 'FAKE_uid',
        title: 'FAKE_title',
        body: 'FAKE_body',
        maxVisibleTo: 3,
        initPosterUserDid: 'FAKE_init_poster_user_did',
        initPosterOrganizationApikey: 'FAKE_init_poster_organization_apikey',
        initFeedOrganizationApikey: 'FAKE_init_feed_organization_apikey',
        initFeedUserDid: 'FAKE_init_feed_user_did',
        initCreatedAt: 'FAKE_init_created_at',
      });

      expect(
        recordToFeedPostContent({
          uid: 'FAKE_uid',
          title: undefined,
          body: 'FAKE_body',
          visible_to: 0,
          max_visible_to: 2,
          init_poster_user_did: 'FAKE_init_poster_user_did',
          init_poster_organization_apikey: false,
          init_feed_organization_apikey: 'FAKE_init_feed_organization_apikey',
          init_feed_user_did: 'FAKE_init_feed_user_did',
          init_created_at: 'FAKE_init_created_at',
          ignored: 'youbet',
        })
      ).to.deep.equal({
        uid: 'FAKE_uid',
        body: 'FAKE_body',
        maxVisibleTo: 2,
        initPosterUserDid: 'FAKE_init_poster_user_did',
        initFeedOrganizationApikey: 'FAKE_init_feed_organization_apikey',
        initFeedUserDid: 'FAKE_init_feed_user_did',
        initCreatedAt: 'FAKE_init_created_at',
      });
    });
  });


  describe('recordToFeedPost', function(){
    beforeEach(function(){
      this.organizationFormPostRecord1 = {
        "feed_post_content_uid": "42b9f8343159f06858f01f71c075778e",
        "uid": "42b9f8343159f06858f01f71c075778e",
        "parent_uid": null,
        "init_uid": "42b9f8343159f06858f01f71c075778e",
        "feed_organization_apikey": "deadlyiconcom",
        "poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        "poster_organization_apikey": null,
        "visible_to": 0,
        "created_at": new Date("2020-10-29T21:33:02.691Z"),
        "updated_at": new Date("2020-11-01T21:33:02.691Z"),
        "deleted_at": null,
        "deleted_by_user_did": null,
        "last_publisher": null,
        "last_published_at": null,
        "max_visible_to": 2,
        "edited": true,
        "title": null,
        "body": "<figure class=\"media\"><oembed url=\"https://vimeo.com/368540845\"></oembed></figure>",
        "media_url": null,
        "media_mime_type": null,
        "init_poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        "init_poster_organization_apikey": null,
        "init_feed_organization_apikey": "deadlyiconcom",
        "init_feed_user_did": null,
        "init_created_at": new Date("2020-10-29T21:33:02.691Z"),
        "upvote_count": 10,
        "downvote_count": 20,
        "comment_count": 30,
        "ancestors": [],
      };
      this.organizationPublishedPostRecord1 = {
        "feed_post_content_uid": "e5c412af6297a9e9541ad482a1d47dac",
        "uid": "b12b8d7b5ffc9da647ae09a61a368351",
        "parent_uid": "e5c412af6297a9e9541ad482a1d47dac",
        "init_uid": "e5c412af6297a9e9541ad482a1d47dac",
        "feed_organization_apikey": "JaredGrippe2",
        "poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        "poster_organization_apikey": "JaredGrippe2",
        "visible_to": 2,
        "created_at": "2020-10-28T20:56:23.696Z",
        "deleted_at": null,
        "deleted_by_user_did": null,
        "last_publisher": null,
        "last_published_at": null,
        "max_visible_to": 3,
        "edited": false,
        "title": "111",
        "body": "<p>111</p>",
        "media_url": null,
        "media_mime_type": null,
        "init_poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        "init_poster_organization_apikey": null,
        "init_feed_organization_apikey": "JaredGrippe2",
        "init_feed_user_did": null,
        "init_created_at": "2020-10-28T20:56:21.121Z",
        "upvote_count": 0,
        "downvote_count": 0,
        "comment_count": 0,
        "ancestors": [],
      };

      this.userPublishedPostRecord1 = {
        "feed_post_content_uid": "e5c412af6297a9e9541ad482a1d47dac",
        "uid": "b12b8d7b5ffc9da647ae09a61a368351",
        "parent_uid": "e5c412af6297a9e9541ad482a1d47dac",
        "init_uid": "e5c412af6297a9e9541ad482a1d47dac",
        "feed_organization_apikey": null,
        "feed_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        "poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        "poster_organization_apikey": "JaredGrippe2",
        "published": true,
        "visible_to": 2,
        "created_at": "2020-10-28T20:56:23.696Z",
        "deleted_at": null,
        "deleted_by_user_did": null,
        "last_publisher": null,
        "last_published_at": null,
        "max_visible_to": 2,
        "edited": false,
        "title": "111",
        "body": "<p>111</p>",
        "media_url": null,
        "media_mime_type": null,
        "init_poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        "init_poster_organization_apikey": null,
        "init_feed_organization_apikey": "JaredGrippe2",
        "init_feed_user_did": null,
        "init_created_at": "2020-10-28T20:56:21.121Z",
        "ancestors": [],
      };

    });


    it('should be a function', function(){
      expect(recordToFeedPost).to.be.a('function');
    });


    it('should wok when given feed content', function(){
      const post = recordToFeedPost({
        uid: '11111',
        title: 'this is a title',
        body: 'this is a body',
        init_poster_user_did: 'this is a init_poster_user_did',
        init_poster_organization_apikey: 'this is a init_poster_organization_apikey',
        init_feed_organization_apikey: 'this is a init_feed_organization_apikey',
        init_feed_user_did: 'this is a init_feed_user_did',
        init_created_at: 'this is a init_created_at',
      });
      expect(post).to.deep.equal({
        uid: '11111',
        title: 'this is a title',
        body: 'this is a body',
        initPosterUserDid: 'this is a init_poster_user_did',
        initPosterOrganizationApikey: 'this is a init_poster_organization_apikey',
        initFeedOrganizationApikey: 'this is a init_feed_organization_apikey',
        initFeedUserDid: 'this is a init_feed_user_did',
        initCreatedAt: 'this is a init_created_at',
      });
    });

    it('should convert a snake case record object to camel case and set false or null values to undefined', function(){
      expect(
        recordToFeedPost(this.organizationFormPostRecord1)
      ).to.deep.equal({
        feedPostContentUid: "42b9f8343159f06858f01f71c075778e",
        uid: "42b9f8343159f06858f01f71c075778e",
        initUid: "42b9f8343159f06858f01f71c075778e",
        feedOrganizationApikey: "deadlyiconcom",
        posterUserDid: "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        createdAt: new Date("2020-10-29T21:33:02.691Z"),
        updatedAt: new Date("2020-11-01T21:33:02.691Z"),
        body: "<figure class=\"media\"><oembed url=\"https://vimeo.com/368540845\"></oembed></figure>",
        initPosterUserDid: "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        initFeedOrganizationApikey: "deadlyiconcom",
        initCreatedAt: new Date("2020-10-29T21:33:02.691Z"),
        upvoteCount: 10,
        downvoteCount: 20,
        commentCount: 30,
        ancestors: [],
        visibleTo: 0,
        maxVisibleTo: 2,
      });
    });

    context('when the post is was deleted by the author', function() {
      it('not have any of the content and show it was deleted by the author', async function(){
        const post = recordToFeedPost({
          ...this.organizationFormPostRecord1,
          deleted_at: new Date("2020-10-29T21:33:02.691Z"),
          deleted_by_user_did: this.organizationFormPostRecord1.poster_user_did,
        });
        expect(post.deletedAt.toISOString()).to.equal("2020-10-29T21:33:02.691Z");
        expect(post.deletedByPoster).to.be.true;
        expect(post.deletedByUserDid).to.be.undefined;
        expect(post.feedPostContentUid).to.be.undefined;
        expect(post.edited).to.be.undefined;
        expect(post.posterUserDid).to.be.undefined;
        expect(post.posterOrganizationApikey).to.be.undefined;
        expect(post.title).to.be.undefined;
        expect(post.body).to.be.undefined;
        expect(post.mediaUrl).to.be.undefined;
        expect(post.mediaMimeType).to.be.undefined;
        expect(post.publishable).to.be.undefined;
      });
    });

    context('when the post is was deleted by an admin', function() {
      it('not have any of the content and show it was deleted by an admin', async function(){
        const post = recordToFeedPost({
          ...this.organizationFormPostRecord1,
          deleted_at: new Date("2020-10-29T21:33:02.691Z"),
          deleted_by_user_did: null,
        });
        expect(post.deletedAt.toISOString()).to.equal("2020-10-29T21:33:02.691Z");
        expect(post.deletedByPoster).to.be.false;
        expect(post.deletedByUserDid).to.be.undefined;
        expect(post.feedPostContentUid).to.be.undefined;
        expect(post.edited).to.be.undefined;
        expect(post.posterUserDid).to.be.undefined;
        expect(post.posterOrganizationApikey).to.be.undefined;
        expect(post.title).to.be.undefined;
        expect(post.body).to.be.undefined;
        expect(post.mediaUrl).to.be.undefined;
        expect(post.mediaMimeType).to.be.undefined;
        expect(post.publishable).to.be.undefined;
      });
    });
  });

  describe('addContentsToFeedPost', function(){
    it('should be a function', function(){
      expect(addContentsToFeedPost).to.be.a('function');
    });
    context('when given a post', function() {
      function generatePersistedFeedPost(){
        const post = createPublicProfileFeedPost({
          feedUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
          posterUserDid: 'did:jlinc:somefinepersonspublicprofiledid',
          visibleTo: 2,
          title: 'Example 1',
          body: '<p>user posts to their own feed</p>',
        });
        const records = feedPostToRecords(post);
        records.feed_post.ancestors = JSON.parse(records.feed_post.ancestors);
        return {
          post,
          postWithoutContent: recordToFeedPost(records.feed_post),
          contents: recordToFeedPostContent(records.feed_post_content),
        };
      };
      it('should be idempotent', function() {
        const { post, postWithoutContent, contents } = generatePersistedFeedPost();
        const p1 = addContentsToFeedPost(postWithoutContent, contents);
        expect(addContentsToFeedPost(postWithoutContent, contents)).to.deep.equal(p1);
        const p2 = addContentsToFeedPost(p1, contents);
        expect(p2).to.deep.equal(p1);
        const p3 = addContentsToFeedPost(p1, contents);
        expect(p3).to.deep.equal(p1);
        expect(p3).to.deep.equal(post);
      });
      context('that is not deleted', function() {
        it('should merge the content onto the post', function() {
          const { post, postWithoutContent, contents } = generatePersistedFeedPost();
          expect(addContentsToFeedPost(postWithoutContent, contents)).to.deep.equal(post);
        });
      });
      context('that was deleted', function() {
        context('by an admin', function() {
          it('should set a bunch of props to undefined and set deletedByPoster=false', function() {
            const { post, postWithoutContent, contents } = generatePersistedFeedPost();
            postWithoutContent.deletedAt = new Date;
            expect(addContentsToFeedPost(postWithoutContent, contents)).to.matchPattern({
              ...post,
              deletedAt: postWithoutContent.deletedAt,
              deletedByPoster: false,
              deletedByUserDid: undefined,
              feedPostContentUid: undefined,
              edited: undefined,
              posterUserDid: undefined,
              posterOrganizationApikey: undefined,
              title: undefined,
              body: undefined,
              mediaUrl: undefined,
              mediaMimeType: undefined,
            });
          });
        });
        context('by the user', function() {
          it('should set a bunch of props to undefined and set deletedByPoster=true', function() {
            const { post, postWithoutContent, contents } = generatePersistedFeedPost();
            postWithoutContent.deletedAt = new Date;
            postWithoutContent.deletedByUserDid = post.posterUserDid;
            expect(addContentsToFeedPost(postWithoutContent, contents)).to.matchPattern({
              ...post,
              deletedAt: postWithoutContent.deletedAt,
              deletedByPoster: true,
              deletedByUserDid: undefined,
              feedPostContentUid: undefined,
              edited: undefined,
              posterUserDid: undefined,
              posterOrganizationApikey: undefined,
              title: undefined,
              body: undefined,
              mediaUrl: undefined,
              mediaMimeType: undefined,
            });
          });
        });
        context('whose contents.uid does not match post.feedPostContentsUid', function() {
          it('should throw', function() {
            expect(() =>
              addContentsToFeedPost({ feedPostContentUid: 'we'}, { uid: 'dont match' })
            ).to.throw('feedPostContentUid mismatch dont match !== we');
          });
        });
      });
    });
  });

  describe('postIsMissingContent', function(){
    it('should be a function', function(){
      expect(postIsMissingContent).to.be.a('function');
    });
    it('should return true if the post is missing content', function(){
      expect(postIsMissingContent({})).to.be.true;
      expect(postIsMissingContent({initPosterUserDid: 'x'})).to.be.false;
    });
  });

  describe('validateFeedPostContents', function(){
    it('should be a function', function(){
      expect(validateFeedPostContents).to.be.a('function');
    });
    it('should validate a new feed post', function(){
      expect(() => validateFeedPostContents({})).to.throw('one of post.title or post.body is required');
      expect(() => validateFeedPostContents({title: {}})).to.throw('post.title must be a string');
      expect(() => validateFeedPostContents({title:'  '})).to.throw('one of post.title or post.body is required');
      expect(() => validateFeedPostContents({body:'  '})).to.throw('one of post.title or post.body is required');
      expect(() => validateFeedPostContents({body:[]})).to.throw('post.body must be a string');
      expect(() => validateFeedPostContents({title:'x'})).to.not.throw();
      expect(() => validateFeedPostContents({body:'x'})).to.not.throw();
    });
  });
});
