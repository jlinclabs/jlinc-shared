'use strict';

const {
  validateFeedPost,
  recordToFeedPostContent,
  recordToFeedPost,
  addContentsToFeedPost,
  postIsMissingContent,
  validateNewFeedPost,
  validateFeedPostContents,
} = require('./feedPosts');

describe('feedPosts', function(){

  it('shoudl work like this', function(){

    const userPublishedRootPost = createFeedPost({
      feedUserDid: 'jlinc:did:somefinepersonspublicprofiledid',
      posterUserDid: 'jlinc:did:somefinepersonspublicprofiledid',
    });

    expect(userPublishedRootPost).to.matchPattern({

    })

    const organizationFormRootPostAsUser = createFeedPost({
      feedOrganizationApikey: 'halliburton',
      posterUserDid: 'jlinc:did:somefinepersonspublicprofiledid',
      publishable: true,
    });

    const organizationFormRootPostAsOrg = createFeedPost({
      feedOrganizationApikey: 'halliburton',
      posterOrganizationApikey: 'halliburton',
      publishable: true,
    });

    const organizationPublishedPost =
      publishOrganizationForumPost(organizationFormRootPostAsUser);

    const userPublishedRepost = repostFeedPost({
      post: organizationPublishedPost,
      feedUserDid: 'jlinc:did:somefinepersonspublicprofiledid',
    });

    const organizationFormRepost = repostFeedPost({
      post: userPublishedRepost,
      feedOrganizationApikey: 'exon',
      publishable: false,
    });

    console.log({
      userPublishedRootPost,
      userPublishedRepost,
      organizationFormRootPostAsUser,
      organizationFormRootPostAsOrg,
      organizationFormRepost,
      organizationFormConsumedPost,
      organizationPublishedPost,
    });
  });

  describe('validateFeedPost', function(){
    it('should be a function', function(){
      expect(validateFeedPost).to.be.a('function');
    });
    context('when given a valid feed post', function(){
      it('should return undefined', function(){
        expect(validateFeedPost({
          feedOrganizationApikey: 'yadadogi',
          title: 'Hello World',
        })).to.be.undefined;
        expect(validateFeedPost({
          feedOrganizationApikey: 'yadadogi',
          body: '<h1>Hi there</h1>',
        })).to.be.undefined;
        expect(validateFeedPost({
          feedOrganizationApikey: 'fake:did',
          parentUid: 'fake:uuid',
        })).to.be.undefined;
        expect(validateFeedPost({
          feedUserDid: 'fake:did',
          title: 'Hello World',
        })).to.be.undefined;
        expect(validateFeedPost({
          feedUserDid: 'fake:did',
          body: '<h1>Hi there</h1>',
        })).to.be.undefined;
        expect(validateFeedPost({
          feedUserDid: 'fake:did',
          parentUid: 'fake:uuid',
        })).to.be.undefined;
      });
    });
    context('when given an ivalid feed post', function(){
      it('should throw an error', function(){
        const expectCase = (post, error) => {
          expect(() => { validateFeedPost(post); }).to.throw(error);
        };
        expectCase(undefined, 'post must be an object');
        expectCase({}, 'post must have feedUserDid or feedOrganizationApikey');
        expectCase(
          {feedUserDid: 'x'},
          'posts must have a parentUid, title and or a body'
        );
        expectCase(
          {feedOrganizationApikey: 'x'},
          'posts must have a parentUid, title and or a body'
        );
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
        mediaUrl: 'FAKE_media_url',
        mediaMimeType: 'FAKE_media_mime_type',
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
          media_url: null,
          media_mime_type: 'FAKE_media_mime_type',
          init_poster_user_did: 'FAKE_init_poster_user_did',
          init_poster_organization_apikey: false,
          init_feed_organization_apikey: 'FAKE_init_feed_organization_apikey',
          init_feed_user_did: 'FAKE_init_feed_user_did',
          init_created_at: 'FAKE_init_created_at',
          ignored: 'youbet',
        })
      ).to.deep.equal({
        uid: 'FAKE_uid',
        title: undefined,
        body: 'FAKE_body',
        mediaUrl: undefined,
        mediaMimeType: 'FAKE_media_mime_type',
        initPosterUserDid: 'FAKE_init_poster_user_did',
        initPosterOrganizationApikey: undefined,
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
        "published": false,
        "created_at": new Date("2020-10-29T21:33:02.691Z"),
        "deleted_at": null,
        "deleted_by_user_did": null,
        "last_publisher": null,
        "last_published_at": null,
        "publishable": false,
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
        "upvote_count": 0,
        "downvote_count": 0,
        "comment_count": 0,
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
        "published": true,
        "created_at": "2020-10-28T20:56:23.696Z",
        "deleted_at": null,
        "deleted_by_user_did": null,
        "last_publisher": null,
        "last_published_at": null,
        "publishable": false,
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
        "created_at": "2020-10-28T20:56:23.696Z",
        "deleted_at": null,
        "deleted_by_user_did": null,
        "last_publisher": null,
        "last_published_at": null,
        "publishable": true,
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
        media_url: 'this is a media_url',
        media_mime_type: 'this is a media_mime_type',
        init_poster_user_did: 'this is a init_poster_user_did',
        init_poster_organization_apikey: 'this is a init_poster_organization_apikey',
        init_feed_organization_apikey: 'this is a init_feed_organization_apikey',
        init_feed_user_did: 'this is a init_feed_user_did',
        init_created_at: 'this is a init_created_at',
      });
      expect(post).to.deep.equal({
        feedPostContentUid: undefined,
        uid: '11111',
        parentUid: undefined,
        initUid: undefined,
        feedOrganizationApikey: undefined,
        feedUserDid: undefined,
        posterUserDid: undefined,
        posterOrganizationApikey: undefined,
        published: undefined,
        createdAt: undefined,
        deletedAt: undefined,
        deletedByUserDid: undefined,
        edited: undefined,
        lastPublishingOrganizationApikey: undefined,
        lastPublishingUserDid: undefined,
        lastPublishedAt: undefined,
        commentCount: undefined,
        upvoteCount: undefined,
        downvoteCount: undefined,
        myVote: undefined,
        publishable: undefined,
        ancestors: undefined,
        title: 'this is a title',
        body: 'this is a body',
        mediaUrl: 'this is a media_url',
        mediaMimeType: 'this is a media_mime_type',
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
        parentUid: undefined,
        initUid: "42b9f8343159f06858f01f71c075778e",
        feedOrganizationApikey: "deadlyiconcom",
        feedUserDid: undefined,
        posterUserDid: "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        posterOrganizationApikey: undefined,
        published: undefined,
        createdAt: new Date("2020-10-29T21:33:02.691Z"),
        deletedAt: undefined,
        deletedByUserDid: undefined,
        lastPublishingOrganizationApikey: undefined,
        lastPublishingUserDid: undefined,
        lastPublishedAt: undefined,
        publishable: undefined,
        edited: true,
        title: undefined,
        body: "<figure class=\"media\"><oembed url=\"https://vimeo.com/368540845\"></oembed></figure>",
        mediaUrl: undefined,
        mediaMimeType: undefined,
        initPosterUserDid: "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
        initPosterOrganizationApikey: undefined,
        initFeedOrganizationApikey: "deadlyiconcom",
        initFeedUserDid: undefined,
        initCreatedAt: new Date("2020-10-29T21:33:02.691Z"),
        upvoteCount: 0,
        downvoteCount: 0,
        commentCount: 0,
        ancestors: [],
        myVote: undefined,
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

    context('when the post is to an organization forum', function() {
      let organizationFormPost;
      beforeEach(function(){




        organizationFormPost = {
          "feed_organization_apikey": "deadlyiconcom",
          "uid": "42b9f8343159f06858f01f71c075778e",
          "init_uid": "42b9f8343159f06858f01f71c075778e",
          "feed_post_content_uid": "42b9f8343159f06858f01f71c075778e",

          "parent_uid": null,
          "poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
          "poster_organization_apikey": null,
          "published": false,
          "created_at": new Date("2020-10-29T21:33:02.691Z"),
          "deleted_at": null,
          "deleted_by_user_did": null,
          "last_publisher": null,
          "last_published_at": null,
          "publishable": false,
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
          "upvote_count": 0,
          "downvote_count": 0,
          "comment_count": 0,
          "ancestors": [],


          "feed_organization_apikey": "JaredGrippe2",
          "published": false,

          // "feed_post_content_uid": "e5c412af6297a9e9541ad482a1d47dac",
          // "uid": "b12b8d7b5ffc9da647ae09a61a368351",
          // "parent_uid": "e5c412af6297a9e9541ad482a1d47dac",
          // "init_uid": "e5c412af6297a9e9541ad482a1d47dac",

          // "created_at": "2020-10-28T20:56:23.696Z",



          // "poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
          // "poster_organization_apikey": "JaredGrippe2",
          // "published": false,
          // "last_publisher": null,
          // "last_published_at": null,
          // "publishable": false,

          // "init_poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
          // "init_poster_organization_apikey": null,
          // "init_feed_organization_apikey": "JaredGrippe2",
          // "init_feed_user_did": null,
          // "init_created_at": "2020-10-28T20:56:21.121Z",
          // "upvote_count": 0,
          // "downvote_count": 0,
          // "comment_count": 0,
          // "ancestors": [],
        };
      });
      context('and it is a root post', function() {
        it('should set repost=false consumed=false', async function(){
          const post = recordToFeedPost({
            ...organizationFormPost,
          });
          expect(post.repost).to.be.undefined;
          expect(post.consumed).to.be.undefined;
        });
      });
      context('and it is a repost', function() {
        it('should set repost=true consumed=false', async function(){
          const post = recordToFeedPost({
            ...organizationFormPost,
            "poster_user_did": "did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk",
          });
          expect(post.repost).to.be.true;
          expect(post.consumed).to.be.undefined;
        });
      });
      context('and it was consumed', function() {
        it('should set repost=false consumed=true', async function(){
          const post = recordToFeedPost({
            ...something,
          });
          expect(post.repost).to.be.undefined;
          expect(post.consumed).to.be.true;
        });
      });
    });

    context('when the post is an organization published post', function() {
      it('should have type: "organizationForum"', async function(){
        expect(
          recordToFeedPost(this.organizationPublishedPostRecord1).type
        ).to.equal('organizationPublished');
      });
    });

    context('when the post is an user published post', function() {
      it('should have type: "organizationForum"', async function(){
        expect(
          recordToFeedPost(this.userPublishedPostRecord1).type
        ).to.equal('userPublished');
      });
    });
  });

  describe('addContentsToFeedPost', function(){
    it('should be a function', function(){
      expect(addContentsToFeedPost).to.be.a('function');
    });
    context('when given a post', function() {
      let post, contents;

      beforeEach(function(){
        post = {
          feedPostContentUid: 'test_uid_pc1',
          uid: 'test_uid_p3',
          parentUid: 'test_uid_p2',
          initUid: 'test_uid_p1',
          feedOrganizationApikey: undefined,
          feedUserDid: 'FAKE_feed_user_did',
          posterUserDid: 'FAKE_poster_user_did',
          posterOrganizationApikey: undefined,
          published: 'FAKE_published',
          createdAt: 'FAKE_created_at',
          deletedAt: undefined,
          deletedByUserDid: undefined,
          edited: undefined,
          lastPublishingOrganizationApikey: 'FAKE_last_publisher',
          lastPublishingUserDid: undefined,
          lastPublishedAt: 'FAKE_last_published_at',
          commentCount: 'FAKE_comment_count',
          upvoteCount: 'FAKE_upvote_count',
          downvoteCount: 'FAKE_downvote_count',
          myVote: 'FAKE_my_vote',
          publishable: undefined,
          ancestors: [],
          title: undefined,
          body: undefined,
          mediaUrl: undefined,
          mediaMimeType: undefined,
          initPosterUserDid: undefined,
          initPosterOrganizationApikey: undefined,
          initFeedOrganizationApikey: undefined,
          initFeedUserDid: undefined,
          initCreatedAt: undefined,
        };
        contents = {
          uid: 'test_uid_pc1',
          title: 'FAKE_title',
          body: 'FAKE_body',
          mediaUrl: 'FAKE_mediaUrl',
          mediaMimeType: 'FAKE_mediaMimeType',
          initPosterUserDid: 'FAKE_initPosterUserDid',
          initPosterOrganizationApikey: 'FAKE_initPosterOrganizationApikey',
          initFeedOrganizationApikey: 'FAKE_initFeedOrganizationApikey',
          initFeedUserDid: 'FAKE_initFeedUserDid',
          initCreatedAt: 'FAKE_initCreatedAt',
        };
      });

      it('should be idempotent', function() {
        const p1 = addContentsToFeedPost(post, contents);
        expect(addContentsToFeedPost(post, contents)).to.deep.equal(p1);
        const p2 = addContentsToFeedPost(p1, contents);
        expect(p2).to.deep.equal(p1);
        const p3 = addContentsToFeedPost(p1, contents);
        expect(p3).to.deep.equal(p1);
      });
      context('that is not deleted', function() {
        beforeEach(function(){
          post.deletedAt = undefined;
          post.deletedByUserDid = undefined;
        });
        it('should merge the content onto the post', function() {
          expect(
            addContentsToFeedPost(post, contents)
          ).to.deep.equal({
            type: 'userPublished',
            feedPostContentUid: post.feedPostContentUid,
            uid: post.uid,
            parentUid: post.parentUid,
            initUid: post.initUid,
            feedOrganizationApikey: post.feedOrganizationApikey,
            feedUserDid: post.feedUserDid,
            posterUserDid: post.posterUserDid,
            posterOrganizationApikey: post.posterOrganizationApikey,
            published: post.published,
            createdAt: post.createdAt,
            deletedAt: post.deletedAt,
            deletedByUserDid: post.deletedByUserDid,
            edited: post.edited,
            lastPublishingOrganizationApikey: post.lastPublishingOrganizationApikey,
            lastPublishingUserDid: undefined,
            lastPublishedAt: post.lastPublishedAt,
            commentCount: post.commentCount,
            upvoteCount: post.upvoteCount,
            downvoteCount: post.downvoteCount,
            myVote: post.myVote,
            publishable: post.publishable,
            ancestors: post.ancestors,

            title: contents.title,
            body: contents.body,
            mediaUrl: contents.mediaUrl,
            mediaMimeType: contents.mediaMimeType,
            initPosterUserDid: contents.initPosterUserDid,
            initPosterOrganizationApikey: contents.initPosterOrganizationApikey,
            initFeedOrganizationApikey: contents.initFeedOrganizationApikey,
            initFeedUserDid: contents.initFeedUserDid,
            initCreatedAt: contents.initCreatedAt,
          });
        });
      });
      context('that was deleted', function() {
        context('by an admin', function() {
          beforeEach(function(){
            post.deletedAt = 'FAKE_deleted_at';
            post.deletedByUserDid = undefined;
          });
          it('should set a bunch of props to undefined and set deletedByPoster=false', function() {
            expect(
              addContentsToFeedPost(post, contents)
            ).to.deep.equal({
              type: 'userPublished',
              feedPostContentUid: undefined,
              uid: post.uid,
              parentUid: post.parentUid,
              initUid: post.initUid,
              feedOrganizationApikey: post.feedOrganizationApikey,
              feedUserDid: post.feedUserDid,
              posterUserDid: undefined,
              posterOrganizationApikey: post.posterOrganizationApikey,
              published: post.published,
              createdAt: post.createdAt,
              deletedAt: post.deletedAt,
              deletedByUserDid: post.deletedByUserDid,
              edited: post.edited,
              lastPublishingOrganizationApikey: post.lastPublishingOrganizationApikey,
              lastPublishingUserDid: undefined,
              lastPublishedAt: post.lastPublishedAt,
              commentCount: post.commentCount,
              upvoteCount: post.upvoteCount,
              downvoteCount: post.downvoteCount,
              myVote: post.myVote,
              publishable: post.publishable,
              ancestors: post.ancestors,

              title: undefined,
              body: undefined,
              mediaUrl: undefined,
              mediaMimeType: undefined,
              initPosterUserDid: contents.initPosterUserDid,
              initPosterOrganizationApikey: contents.initPosterOrganizationApikey,
              initFeedOrganizationApikey: contents.initFeedOrganizationApikey,
              initFeedUserDid: contents.initFeedUserDid,
              initCreatedAt: contents.initCreatedAt,

              deletedByPoster: false,
            });
          });
        });
        context('by the user', function() {
          beforeEach(function(){
            post.deletedAt = 'FAKE_deleted_at';
            post.deletedByUserDid = post.posterUserDid;
          });
          it('should set a bunch of props to undefined and set deletedByPoster=true', function() {
            expect(
              addContentsToFeedPost(post, contents)
            ).to.deep.equal({
              type: 'userPublished',
              feedPostContentUid: undefined,
              uid: post.uid,
              parentUid: post.parentUid,
              initUid: post.initUid,
              feedOrganizationApikey: post.feedOrganizationApikey,
              feedUserDid: post.feedUserDid,
              posterUserDid: undefined,
              posterOrganizationApikey: post.posterOrganizationApikey,
              published: post.published,
              createdAt: post.createdAt,
              deletedAt: post.deletedAt,
              deletedByUserDid: undefined,
              edited: post.edited,
              lastPublishingOrganizationApikey: post.lastPublishingOrganizationApikey,
              lastPublishingUserDid: undefined,
              lastPublishedAt: post.lastPublishedAt,
              commentCount: post.commentCount,
              upvoteCount: post.upvoteCount,
              downvoteCount: post.downvoteCount,
              myVote: post.myVote,
              publishable: post.publishable,
              ancestors: post.ancestors,

              title: undefined,
              body: undefined,
              mediaUrl: undefined,
              mediaMimeType: undefined,
              initPosterUserDid: contents.initPosterUserDid,
              initPosterOrganizationApikey: contents.initPosterOrganizationApikey,
              initFeedOrganizationApikey: contents.initFeedOrganizationApikey,
              initFeedUserDid: contents.initFeedUserDid,
              initCreatedAt: contents.initCreatedAt,

              deletedByPoster: true,
            });
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


  describe('validateNewFeedPost', function(){
    let post;
    const expectError = error =>
      expect(() => validateNewFeedPost(post)).to.throw(error);

    it('should be a function', function(){
      expect(validateNewFeedPost).to.be.a('function');
    });
    context('when its an initial post', function(){
      it('should validate a new feed post', function(){
        post = undefined;
        expectError('post must be an object');

        post = {};
        expectError('post.feedOrganizationApikey or post.feedUserDid is required');

        post.feedOrganizationApikey = 'pooplabs';
        expectError('post.publishable must be a boolean');

        post.publishable = true;
        expectError('one of post.title or post.body is required');

        post.title = 'hello world';
        expect(() => validateNewFeedPost(post)).to.not.throw();
      });
    });
    context('when its a repost post', function(){
      it('should validate a report post', function(){
        post = { parentUid: 'xxx' };
        expectError('post.feedOrganizationApikey or post.feedUserDid is required');

        post.feedOrganizationApikey = 'pooplabs';
        expectError('post.publishable must be a boolean');

        post.publishable = true;
        expect(() => validateNewFeedPost(post)).to.not.throw();
      });
    });
  });
  describe('validateFeedPostContents', function(){
    it('should be a function', function(){
      expect(validateFeedPostContents).to.be.a('function');
    });
    it('should validate a new feed post', function(){
      expect(() => validateFeedPostContents({})).to.throw('one of post.title or post.body is required');
      expect(() => validateFeedPostContents({title:'  '})).to.throw('one of post.title or post.body is required');
      expect(() => validateFeedPostContents({body:'  '})).to.throw('one of post.title or post.body is required');
      expect(() => validateFeedPostContents({title:'x'})).to.not.throw();
      expect(() => validateFeedPostContents({body:'x'})).to.not.throw();
    });
  });
});
