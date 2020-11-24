# Feed Posts


## Types of Feeds

### Hub forum
### Hub published
### User homepage
### User public profile

## Post Attributes

### Root Post

- has no parent id
- Is initial content
- Shares the same uid with `feedPostContentUid`

### Published

- has `published=true` set

### A Repost

- has a `parentUid`
- has a `posterUserDid`

### A Consumed Post

- has a `parentUid`
- has a `feedOrganizationApikey`
- has `published=false`
- does not have a `posterUserDid`



## Types of posts per feed type


### Hub forum
  - published=false
  - reposts
  - consumed

### Hub published
  - published=true
  - !reposts
  - !consumed

### User homepage
  - published=true
  - reposts
  - !consumed

### User public profile
  - published=true
  - reposts
  - !consumed



organizationPublished
organizationForumRootPost
organizationForumRepost
organizationForumConsumedPost
userPublished
userPublishedRepost


## Terms

### Post

Attributes:
- feed: hub forum feed | hub published feed | personal profile feed
- poster user:
- poster hub:

### Root Post

A post with no parent.

Can be created in and can only exist in:
- hub forum feed
- personal profile feed

### Consumed Post

These posts are created by hub to hub "subscriptions".

These posts descend from a posts published by a hub.

These posts are display differently in that we should the last publisher as the "actor" who created this post.

### Descend

Whenever you create a post that has a parent you "descend" from that post.

Cases:
- reposting
- publishing a hub forum post

### Repost

Creates a descendant post.

Can be created in
- hub forum
- personal profile feed




## Inconsistencies

The user's homepage feed is not like any other kind of feed. its uses a join-at-query-time approach to compile the "feeds" where as all other feeds have feed_posts records specifically for them. Why is this inconsistent? No one is posting to the users homepage feed.

If we make the user's homepage feed real records it feels like an actor is posting to it.

the flipside is 'no one is strictly "posting" to the hub forum feed' for "hub feed consumption" so maybe the hub forum feed should be a mix of real posts and queried posts? we didnt do that because we need a place to attach comments.


## Ideas

I think this idea means we drop the concept of "types of feeds" or "feeds as a destination for a post" and feeds become a query against posts you have access to.

### `post.visibleTo`

- remove published attribute and rely on a "visible to" property set on the post.
  - hub forum posts have visibleTo === 'organization'
  - when that post is published its descendant has visibleTo >= 'organization'
  - when we query for the different hub feeds we can also solely rely on this visibleTo property
  - we can drop the term published or consider any post with visibleTo >= 'organization', as published

- visibleTo could be stored as an int:

0. organization members only
1. \+ organization subscribers & followers
2. \+ anyone on True
3. \+ public

how would we distinguish between a post published for hub members only and a forum feed post?
