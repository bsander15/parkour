import React from 'react'
import PostsList from './postsList'

function Profile() {
  return (
    <div>
      <div class = "mainPane">
        <h2>Profile Header</h2>
        <PostsList showParkHeaders = {false}/>
      </div>
    </div>
  )
}

export default Profile