const emailExistsQuery = `*[_type == "user" && email == $email][0]`;

const userNameExistsQuery = `*[_type == "user" && username == $username][0]`;

const confirmLoginQuery = `*[
  _type == "user" &&
  email == $email
][0]{
  _id,
  userName,
  email,
  profileImage{ asset->{ url } },
  password,
  likedPins[]->{
    _id,
    title,
    description,
    likes,
    postedBy->{
      _id,
      userName,
      profileImage{
        asset->{ url }
      }
    },
    createdAt
  },
  followers[]->{
    _id,
  },
  following[]->{
    _id,
  }
}`;

const likedPinsQuery = `*[ _type == "user" && _id == $userId][0] {

  likedPins[]->{
    _id,
    title,
    description,
    likes,
    mediaType,
    image{ 
      asset->{ 
        url 
      } 
    },
    postedBy->{ 
      _id, 
      userName, 
      profileImage{ 
        asset->{ 
          url 
        } 
      } 
    },
    createdAt,
    categories[]->{ 
      _id, 
      title 
    },
    comments[]->{ 
      _id, 
      text, 
      postedBy->{ 
        _id, 
        userName 
      }, 
      createdAt 
    }
  }
}`

const findIdwEmailQuery = `*[_type == "user" && email == $email][0]._id` 

const feedQuery = `
*[_type == "pin"] | order(_createdAt desc) {
  _id,
  image{ asset-> { url } },
  video{ asset-> { url } },
  postedBy->{ _id, userName, profileImage{ asset-> { url } } },
  board[]{ _id, createdBy->{ _id, userName } },

  // Stories is an array of references to Story docs
  stories[]->{
    _id,
    mediaType,

    // media is an inline array of objects, so no -> here
    media[]{
      mediaType,
      image {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
      video {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }
  }
}`

  const postQuery = `*[_type == "pin" && _id == $pinId]{
    _id,
    title,
    description,
    mediaType,
    likes,
    image{
      asset->{
        url
      }
    },
    video{
      asset->{
        url
      }
    },
    postedBy->{
      _id,
      userName,
      profileImage
    },
    createdAt,
    categories[]->{
      _id,
      title
    },
    board[]->{
      _id,
      title,
      description,
      createdBy->{
        _id,
        userName
      }
    },
    comments[]->{
      _id,
      text,
      postedBy->{
        _id,
        userName,
        profileImage
      },
      createdAt
    },
    stories[]->{
    _id,
    mediaType,
    media[]{
      mediaType,
      image {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
      video {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }
  }
  }`;


const searchQuery = `*[
  _type == "pin" &&
  (
    (
    title match $search || 
    postedBy->userName match $search || 
    categories[]->title match $search
    ) 
    ||
    ($clause)
  )
]{
  _id,
  title,
  description,
  mediaType,
  image {
    asset-> {
      url
    }
  },
  video {
    asset-> {
      url
    }
  },
  postedBy-> {
    _id,
    userName,
    profileImage {
      asset-> {
        url
      }
    }
  },
  createdAt,
  categories[]-> {
    _id,
    title
  },
  stories[]-> {
    _id,
    mediaType,
    media[] {
      mediaType,
      image {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
      video {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }
  }
}`;


const userProfileQuery = `*[_type == "user" && _id == $userId][0] {
  _id,
  bio,
  userName,
  instagram,
  x,
  onlyfans,
  youtube,
  profileImage{ asset->{ _id, url } },
  followers[]->{ _id },
  following[]->{ _id },
  likedPins[]->{
    _id,
    title,
    description,
    likes,
    mediaType,
    image{ asset->{ url } },
    video{ asset->{ url } },
    postedBy->{ _id, userName, profileImage{ asset->{ url } } },
    createdAt,
    stories[]->{
      _id,
      mediaType,
      media[]{
        mediaType,
        image{ asset->{ url } },
        video{ asset->{ url } }
      }
    }
  },
  "myPins": *[
    _type == "pin" && postedBy._ref == $userId
  ]{
    _id,
    title,
    description,
    likes,
    mediaType,
    image{ asset->{ url } },
    video{ asset->{ url } },
    createdAt,
    categories[]->{ _id, title },
    stories[]->{
      _id,
      mediaType,
      media[]{
        mediaType,
        image{
          asset->{
            url,
            metadata{
              dimensions{ width, height }
            }
          }
        },
        video{
          asset->{
            url,
            metadata{
              dimensions{ width, height }
            }
          }
        }
      }
    },
    postedBy->{ _id, userName, profileImage{ asset->{ url } } },
    comments[]->{
      _id,
      text,
      postedBy->{ _id, userName, profileImage{ asset->{ url } } },
      createdAt
    }
  }
}`;


  const userRelationsQuery = `*[ _type == "user" && _id == $userId ][0] {
    likedPins[]->{
      _id,
    },
      followers[]->{
      _id,
    },

    following[]->{
      _id,
    }
  }`;


  const userFollowDataQuery = `*[_type == "user" && _id == $userId][0]{
    following[]->{
      _id,
    }
  }`;

  const categoryFeedQuery = `*[_type == "pin" && references(*[_type == "category" && title == $categoryTitle]._id)]{
    _id,
    image{ asset-> { url } },
    video{ asset-> { url } },
    postedBy->{ _id, userName, profileImage{ asset-> { url } } },
    board[]{ _id, createdBy->{ _id, userName } },

    stories[]->{
      _id,
      mediaType,

      media[]{
        mediaType,
        image {
          asset-> {
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          }
        },
        video {
          asset-> {
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          }
        }
      }
    }
  }`;
  
export {
  emailExistsQuery,
  userNameExistsQuery, 
  confirmLoginQuery, 
  findIdwEmailQuery, 
  feedQuery, 
  postQuery, 
  searchQuery, 
  fetchCommentQuery,
  likedPinsQuery,
  userProfileQuery,
  userRelationsQuery,
  userFollowDataQuery,
  categoryFeedQuery
};
