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



## Tyes of posts per feed type


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
