# Feed Posts



## Post Properties

- uid
- initUid
- initFeedOrganizationApikey
- initPosterUserDid
- initPosterOrganizationApikey
- createdAt
- initCreatedAt
- ancestors

### Author Properties

- posterOrganizationApikey
- posterUserDid

### Destination / Feed

- feedUserDid
- feedOrganizationApikey

### Visibility

- visibleTo
- maxVisibleTo

### content

- title
- body

### Only on Organization Forum Feed Post

- commentCount
- upvoteCount
- downvoteCount
- myVote




## Feed Post Destinations

- Organization forum
- Organization published
- User published

### Hub forum

- !!post.feedUserDid === false
- !!post.feedOrganizationApikey === true
- post.organizationForumPost === true

### Hub published

- !!post.feedUserDid === false
- !!post.feedOrganizationApikey === true
- !!post.organizationForumPost === false

### User public profile

- !!post.feedUserDid === true
- !!post.feedOrganizationApikey === false
- !!post.organizationForumPost === false





## Post Attributes

### Root Post

- has no parent id
- Is initial content
- Shares the same uid with `feedPostContentUid`

### Organization Forum Post

- !!post.feedUserDid === false
- !!post.feedOrganizationApikey === true
- post.organizationForumPost === true

### Published Post

- has `visibleTo > 0` set
- !!post.organizationForumPost === false
- !!(post.feedUserDid || post.feedOrganizationApikey) === true

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

0. members only
1. network only (AKA on some list)
2. Tru only
3. public

AKA:

0. Hub
1. Network
2. Tru
3. Internet


feed: hub apikey | user public profile did
visibleTo: 0...3
networks: [networkUid1,networkUid1]



A) there are networks and you can post to networks
B) hubs can subscribe to any network they are in or any hub in the system

#### Subscription

- any user can subscribe to any hub
- any hub can subscribe to any other hub
- any hub can subscribe to any network
- any hub can subscribe to any user
- any network can subscribe to any hub
- any network can subscribe to any user

`(user|hub|network)<-subscribe->(user|hub|network)`

```
hub-x <- network-p -> hub-y

network_members:
| network_id | hub_id |
|------------|--------|
| net-a      | 🐪     |
| net-a      | 🍩     |
| net-a      | 💵     |

```




- the hub admin for `350sf` posts to it's forum
- the publishes that post with visible-to-network-only: `350network`
- because `350california` is subscribed to `350sf`
  - AND `350california` is a member of `350network` network
- then `350california` ingests that post into their forum
- a member of `350california` reposts it to `350eu`
  - which is allowed because `350eu` is in the `350network`
- `350eu` publishes the post
  - its locked to: visible-to-network-only: `350network`

<!-- ¿ does `350california` have control over being "subscribed" to posts -->







### What about subscribers?

this means the hubs subscribed to other hubs via `feed_subscriptions`

this is used only ingestions time

is a list maintained privately by the subscriber
¿ OR ?
is a list maintained privately by the hub



### `post.maxVisibleTo`

this is only used for forum posts like `lastPublishingUserDid` and `lastPublishingOrganizationApikey`.

this is where the author specifies how publicable this post is.

example1: user creates a hub forum posts and says this can be published but to Tru member only; it would create a post with `{visibleTo: 0}` making it a hub forum posts and `{maxVisibleTo: 2}`.

example2: a hub ingests a post from another hub, the post being ingested is `{visibleTo: 1, networks: n}` it would create a post with `{visibleTo: 0}` making it a hub and `{maxVisibleTo: 1, networks: n}`. if this post gets published its only allowed to be set `{visibleTo: 1, networks: n}` making it only sharable to the networks it was originally posted to.

example3: a users posts to their public profile feed saying the post is visible to tru members only but can be published publically.

#### `members only`

you are logged in and in the

#### `network only`


#### `Tru only`


#### `public`





#### Networks

ARE A first-class object next to user and organizations.

networks have one owner/admin

maintain a set of organization apikeys that are members of the network

when a hub is in a network it is allowed to create feed posts with
`{visibleTo: 1, networks: [networkUid]}` to post within that network.
when this happens, hubs in the network and subscribe to the feed hub, ingest the post.

when a post has visibleTo=1 we check generate a list of organizations apikeys for ingestion:

```
post.networks = [networkUid1, networkUid2]
const orgsThatIngestThisPost = (
  (all the hubs subscribed to the target hub) |
  (all the hubs in the networks specified)
)
```

a set of sets of hub apikeys that are maintained by an owning hub

`hub subscriber list AKA network`?

following: listen for posts with `visibleTo >= 2`
subscribing: hub1 listening for posts from hub2 with `visibleTo >= 2`
joining a hub subscriber list:


how would we distinguish between a post published for hub members only and a forum feed post?

feeds as queries:

$canSee:
```sql
$canSee = (
  visibleTo >= 3
  AND i_am_logged_in AND (
    ((visibleTo >= 2) OR (visibleTo >= 1 AND `post to a hub I follow`))
    AND `not a post ive hidden from myself`
  )
)
```

- hub forum
```sql
WHERE visibleTo = 0
AND `post is to the hub`
AND `i am a member of the hub`
```

- hub published
```sql
WHERE `post is to the hub`
AND visibleTo >= 1
AND $canSee:
```

- homepage:
```sql
WHERE `post is to a hub I follow`
AND $canSee
```

following a hub is just a list the user maintains and feeds this query. it just has to be visibleTo >= 2

- public profile feed:
```sql
WHERE `post is to this public profile feed`
AND $canSee
```

- hub ingestion
```sql
WHERE `post is to this public profile feed`
AND $canSee
```

```
when a post is created that is:
  - to a hub
  - visibleTo > 0
then:
  for each hub that (subscribes to this hub OR is in the selected network)
    ingest that post
    *these new posts always have visibleTo=0*
    ¿¿forward along the post.networks value??
```

the `for each that subscribes to that hub` query is where we can support
- networks and hub-to-hub subscriptions.
- and in the

**this would work for 'hub follows public profile' feature**




