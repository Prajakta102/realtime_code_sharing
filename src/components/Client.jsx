import React from 'react'
// import Avatar  from 'react-avatar'
import Avatar from 'react-nice-avatar'

const Client = ({username}) => {
    // console.log(username);
  return (
    <div className="client">
        {/* <Avatar/> */}
        <Avatar style={{ width: '4rem', height: '4rem' }}/>
        <span className="clientUsername">{username}</span>
    </div>
  )
}

export default Client