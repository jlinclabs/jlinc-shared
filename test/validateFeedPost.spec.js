'use strict';

const validateFeedPost = require('../validateFeedPost');

describe('validateFeedPost', function() {
  context('when given an invalid post', function() {
    it('should throw an error', async function(){
      expect(() => validateFeedPost({})).to.throw('post is required');

      expect(() => validateFeedPost({ post: 123 })).to.throw('post must be an object');

      expect(() => validateFeedPost({ post: {} })).to.throw('title, body and mediaUrl cannot all be blank');

      expect(() => validateFeedPost({ post: { title: 123 } })) .to.throw('title must be a string');

      expect(() => validateFeedPost({ post: { mediaUrl: 123 } })) .to.throw('mediaUrl must be a string');

      expect(() => validateFeedPost({ post: { mediaMimeType: 123 } })) .to.throw('mediaMimeType must be a string');

      expect(
        () => validateFeedPost({
          post: { mediaMimeType: 'video/vimeoUrl', mediaUrl: 'https://www.video.com/mp4' },
          assetServerUrl: 'https://jlincassets.com',
        })
      ) .to.throw('media must be vimeo url when mediaMimeType="video/vimeoUrl"');

      expect(
        () => validateFeedPost({
          post: { mediaMimeType: 'video/mp4', mediaUrl: 'https://www.video.com/mp4' },
          assetServerUrl: 'https://jlincassets.com',
        })
      ) .to.throw('media must be uploaded to the JLINC assets server');
    });
  });

  context('when given a valid post', function() {
    it('should not throw', function () {
      validateFeedPost({
        post: {
          title: 'feet feet',
          body: 'whatchu watchu',
          mediaMimeType: 'image/jpg',
          mediaUrl: 'https://jlincassets.com/watchufeet.jpg'
        },
        assetServerUrl: 'https://jlincassets.com'
      });
    });
  });
});
