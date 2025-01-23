import React, { useState } from 'react';
import CommentsList from './CommentList';
import CommentInput from './CommentInput';
import './Comments.css';
const CommentsSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);

  const handleNewComment = (text) => {
    const newComment = {
      id: Date.now(),
      username: 'CurrentUser', // À remplacer par l'utilisateur actuel
      avatar: '/default-avatar.png',
      text,
      timestamp: 'Just now',
      likes: 0
    };
    setComments([newComment, ...comments]);
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Comments</h3>
      </div>
      <CommentInput onSubmit={handleNewComment} />
      <CommentsList comments={comments} />
    </div>
  );
};

export default CommentsSection;