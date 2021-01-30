'use strict';

require('./feedPosts.matchers');

describe('feedPosts.matchers', function(){
  beforeEach(function(){
    this.aRootFeedPostToAUserFeed = {
      uid: 'fa4820fbdcad30b3d83e223101a882f4',
      initUid: 'fa4820fbdcad30b3d83e223101a882f4',
      createdAt: new Date('2020-12-11T19:48:18.785Z'),
      initCreatedAt: new Date('2020-12-11T19:48:18.785Z'),
      posterUserDid: 'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
      initPosterUserDid: 'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
      feedUserDid: 'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
      initFeedUserDid: 'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
      feedPostContentUid: 'fa4820fbdcad30b3d83e223101a882f4',
      title: 'hello world',
      body: '<h1>hello world</h1>',
      visibleTo: 2,
      maxVisibleTo: 2,
      ancestors: [],
    };

    this.aRootFeedPostToAnOrganzationForum = {
      uid: '2ce4b8040e13a21526522dbf7a842d60',
      createdAt: new Date('2020-12-11T19:50:43.341Z'),
      initCreatedAt: new Date('2020-12-11T19:50:43.341Z'),
      feedPostContentUid: '2ce4b8040e13a21526522dbf7a842d60',
      initUid: '2ce4b8040e13a21526522dbf7a842d60',
      initPosterUserDid: 'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
      posterUserDid: 'did:jlinc:aA_YeZC5s6sc_QKR0b2xKaRXfAy5USjl33LIPJNyrAk',
      title: 'i like cheese',
      body: '<h1>i like cheese</h1>',
      maxVisibleTo: 0,
      ancestors: [],
      feedOrganizationApikey: 'parksinspace',
      posterOrganizationApikey: undefined,
      initFeedOrganizationApikey: 'parksinspace',
      initPosterOrganizationApikey: undefined,
      visibleTo: 0
    };

    this.aHubPublishedPost = {
      ...this.aRootFeedPostToAnOrganzationForum,
      uid: 'c4e82e0bb83cfb19aea04d8a3e348070',
      parentUid: this.aRootFeedPostToAnOrganzationForum.uid,
      createdAt: new Date('2020-11-17T19:27:17.905Z'),
      visibleTo: 1,
      ancestors: [
        this.aRootFeedPostToAnOrganzationForum.uid,
        ...this.aRootFeedPostToAnOrganzationForum.ancestors,
      ],
      feedOrganizationApikey: this.aRootFeedPostToAnOrganzationForum.feedOrganizationApikey,
      posterUserDid: this.aRootFeedPostToAnOrganzationForum.posterUserDid,
      posterOrganizationApikey: this.aRootFeedPostToAnOrganzationForum.feedOrganizationApikey,
    };

    this.aRepostToAnOrganizationForum = {
      ...this.aHubPublishedPost,
      uid: 'b83cfb19aea04dc4e82e0b8a3e348070',
      parentUid: this.aHubPublishedPost.uid,
      createdAt: new Date('2020-11-17T19:27:17.905Z'),
      feedOrganizationApikey: 'deadastronaut',
      visibleTo: 0,
      maxVisibleTo: 1,
      posterUserDid: 'did:jlinc:KaRXf_YeZC5s6scAy5USjQKR0b2_l33LIPJNyrAk',
    };

    this.aConsumedFeedPost = {
      ...this.aHubPublishedPost,
      uid: 'adc4e82e0b8ab83cfb19aea04e348070',
      parentUid: this.aHubPublishedPost.uid,

      lastPublishingUserDid: this.aHubPublishedPost.posterUserDid,
      lastPublishingOrganizationApikey: this.aHubPublishedPost.posterOrganizationApikey,
      lastPublishedAt: this.aHubPublishedPost.createdAt,

      createdAt: new Date('2020-11-18T19:27:17.905Z'),
      feedOrganizationApikey: 'spacegeeks',
      visibleTo: 0,
      posterUserDid: undefined,
      posterOrganizationApikey: undefined,
    };
  });

  it('aFeedPostUid', function(){
    expect().to.not.be.aFeedPostUid();
    expect('').to.not.be.aFeedPostUid();
    expect('x').to.not.be.aFeedPostUid();
    expect('8a3e34807ae0bb83cfb19ea04dc4e820').to.be.aFeedPostUid();
  });

  it('aFeedPost', function(){
    expect().to.not.be.aFeedPost();
    expect('').to.not.be.aFeedPost();
    expect('x').to.not.be.aFeedPost();
    [
      this.aRootFeedPostToAUserFeed,
      this.aRootFeedPostToAnOrganzationForum,
      this.aHubPublishedPost,
      this.aRepostToAnOrganizationForum,
      this.aConsumedFeedPost,
    ].forEach(feedPost => {
      expect(feedPost).to.be.aFeedPost();
      expect(JSON.parse(JSON.stringify(feedPost))).to.be.aFeedPost();
    });

    [
      {uid: undefined},
      {initUid: undefined},
      {initCreatedAt: undefined},
      {initPosterUserDid: undefined},
      {createdAt: undefined},
      {feedUserDid: undefined, feedOrganizationApikey: undefined},
      {title: undefined, body: undefined},
    ].forEach(missingRequiredKeys => {
      const brokenPost = {
        ...this.aRootFeedPostToAUserFeed,
        ...missingRequiredKeys,
      };
      expect(brokenPost).to.not.be.aFeedPost();
      expect(() => { expect(brokenPost).to.be.aFeedPost(); })
        .to.throw('AssertionError');
    });
  });
  it('aRootFeedPost', function(){
    expect(this.aRootFeedPostToAUserFeed).to.be.aRootFeedPost();
    expect(this.aRootFeedPostToAnOrganzationForum).to.be.aRootFeedPost();
    expect(this.aHubPublishedPost).to.not.be.aRootFeedPost();
    expect(this.aRepostToAnOrganizationForum).to.not.be.aRootFeedPost();
    expect(this.aConsumedFeedPost).to.not.be.aRootFeedPost();
    expect({
      ...this.aRootFeedPostToAUserFeed,
      feedPostContentUid: 'd30b3d83fa4820fbdcae223101a882f4',
    }).to.not.be.aRootFeedPost();
    expect({
      ...this.aRootFeedPostToAUserFeed,
      feedPostContentUid: 'd30b3d83fa4820fbdcae223101a882f4',
      updatedAt: new Date,
    }).to.be.aRootFeedPost();
  });
  it('aConsumedFeedPost', function(){
    expect(this.aRootFeedPostToAUserFeed).to.not.be.aConsumedFeedPost();
    expect(this.aRootFeedPostToAnOrganzationForum).to.not.be.aConsumedFeedPost();
    expect(this.aHubPublishedPost).to.not.be.aConsumedFeedPost();
    expect(this.aRepostToAnOrganizationForum).to.not.be.aConsumedFeedPost();
    expect(this.aConsumedFeedPost).to.be.aConsumedFeedPost();
  });
  it('aFeedPostConsuming', function(){
    expect(this.aRootFeedPostToAUserFeed)
      .to.not.be.aFeedPostConsuming({});
    expect(this.aRootFeedPostToAnOrganzationForum)
      .to.not.be.aFeedPostConsuming({});
    expect(this.aHubPublishedPost)
      .to.not.be.aFeedPostConsuming({});
    expect(this.aRepostToAnOrganizationForum)
      .to.not.be.aFeedPostConsuming({});
    expect(this.aConsumedFeedPost)
      .to.be.aFeedPostConsuming({
        post: this.aHubPublishedPost,
        feedOrganizationApikey: 'spacegeeks',
      });

    expect(
      _.isFeedPostConsuming({
        post: this.aHubPublishedPost,
        feedOrganizationApikey: 'spacegeeks',
      })(this.aConsumedFeedPost)
    ).to.be.true;
  });

  it('aPublishedFeedPost', function(){
    expect(this.aRootFeedPostToAUserFeed).to.be.aPublishedFeedPost();
    expect(this.aRootFeedPostToAnOrganzationForum).to.not.be.aPublishedFeedPost();
    expect(this.aHubPublishedPost).to.be.aPublishedFeedPost();
    expect(this.aRepostToAnOrganizationForum).to.not.be.aPublishedFeedPost();
    expect(this.aConsumedFeedPost).to.not.be.aPublishedFeedPost();
  });
  it('anOrganizationForumFeedPost', function(){
    expect(this.aRootFeedPostToAUserFeed).to.not.be.anOrganizationForumFeedPost();
    expect(this.aRootFeedPostToAnOrganzationForum).to.be.anOrganizationForumFeedPost();
    expect(this.aHubPublishedPost).to.not.be.anOrganizationForumFeedPost();
    expect(this.aRepostToAnOrganizationForum).to.be.anOrganizationForumFeedPost();
    expect(this.aConsumedFeedPost).to.be.anOrganizationForumFeedPost();
  });
  it('anOrganizationPublishedFeedPost', function(){
    expect(this.aRootFeedPostToAUserFeed).to.not.be.anOrganizationPublishedFeedPost();
    expect(this.aRootFeedPostToAnOrganzationForum).to.not.be.anOrganizationPublishedFeedPost();
    expect(this.aHubPublishedPost).to.be.anOrganizationPublishedFeedPost();
    expect(this.aRepostToAnOrganizationForum).to.not.be.anOrganizationPublishedFeedPost();
    expect(this.aConsumedFeedPost).to.not.be.anOrganizationPublishedFeedPost();
  });
  it('anOrganizationPublishedFeedPostFor', function(){
    expect(this.aRootFeedPostToAUserFeed)
      .to.not.be.anOrganizationPublishedFeedPostFor();
    expect(this.aRootFeedPostToAnOrganzationForum)
      .to.not.be.anOrganizationPublishedFeedPostFor();
    expect(this.aHubPublishedPost)
      .to.be.anOrganizationPublishedFeedPostFor(this.aRootFeedPostToAnOrganzationForum);
    expect(this.aRepostToAnOrganizationForum)
      .to.not.be.anOrganizationPublishedFeedPostFor();
    expect(this.aConsumedFeedPost)
      .to.not.be.anOrganizationPublishedFeedPostFor();
  });
  it('aUserPublicProfileFeedPost', function(){
    expect(this.aRootFeedPostToAUserFeed).to.be.aUserPublicProfileFeedPost();
    expect(this.aRootFeedPostToAnOrganzationForum).to.not.be.aUserPublicProfileFeedPost();
    expect(this.aHubPublishedPost).to.not.be.aUserPublicProfileFeedPost();
    expect(this.aRepostToAnOrganizationForum).to.not.be.aUserPublicProfileFeedPost();
    expect(this.aConsumedFeedPost).to.not.be.aUserPublicProfileFeedPost();
  });
});
