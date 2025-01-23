import React, { useState } from 'react';
import './Comments.css';
const CommentInput = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form className="comment-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="comment-input__field"
      />
      <button 
        type="submit" 
        className="comment-input__submit"
        disabled={!comment.trim()}
      >
        Post
      </button>
    </form>
  );
};

export default CommentInput;