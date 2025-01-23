import React from 'react';
import './Comments.css';
const Comment = ({ comment }) => {
  const { username, avatar, text, timestamp, likes } = comment;

  return (
    <div className="comment">
      <div className="comment__avatar">
        <img src={avatar} alt={username} />
      </div>
      
      <div className="comment__content">
        <div className="comment__header">
          <span className="comment__username">{username}</span>
          <span className="comment__timestamp">{timestamp}</span>
        </div>
        <p className="comment__text">{text}</p>
        <div className="comment__actions">
          <button className="like-button">
            <span className="like-count">{likes}</span>
          </button>
          <button className="reply-button">Reply</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;