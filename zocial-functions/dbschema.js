let db = {
  users: [
    {
      userId: "dh274ubfekjnfeds83o",
      email: "email@email.com",
      handle: 'userhandle',
      createdAt: "Thu Sep 05 2019",
      bio: 'Some stuff abuut me',
      website: 'www.mywebsite.com',
      location: 'Where I live'}
  ],
    shouts: [
        {
          userHandle: 'user',
          body: 'this is the shout body',
          createdAt: "Thu Sep 05 2019",
          likeCount: 5,
          commentCount: 2
        }
    ]
}

const userDetails = {
  credentials: {
    userId: '9roj42portfnropsgnmre',
    email: "user@mail.com",
    handle: 'user',
    createdAt: "Thu Sep 05 2019",
    imageUrl: 'image/rnalkgrdfemklw',
    bio: "Hello my name is this and I'm that",
    website: 'www.website.com',
    location: 'Denver, CO'
  },
  likes: [
    {
      userHandle: 'user',
      shoutId: '304i324qtkpg4w'
    },
    {
      userHandle: 'user',
      shoutId: '4u309qjtognwlkrsf'
    }
  ] 
}