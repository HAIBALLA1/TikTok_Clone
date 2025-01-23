import React from 'react';
import Comment from './Comment';
import './Comments.css';
const CommentsList = ({ comments }) => {
  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentsList;