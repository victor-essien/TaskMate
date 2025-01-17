import React, {useEffect, useState} from 'react';
import {fetchComments, addComment} from '../firebaseConfig/db';
import { formatDistanceToNow } from "date-fns"; // For human-readable timestamps


type Comment = {
    id: string;
    text: string;
    author: string;
    timestamp: Date;
  };
  
  type Props = {
    teamId: string;
    taskId: string;
    userName: string; // Name of the user adding comments
  };
  

const CommentSection: React.FC<Props> = ({ teamId, taskId, userName }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
  
    // Fetch comments on component mount
    useEffect(() => {
      const loadComments = async () => {
        const fetchedComments = await fetchComments(teamId, taskId);
        setComments(fetchedComments);
      };
  
      loadComments();
    }, [teamId, taskId]);
  
    // Handle adding a new comment
    const handleAddComment = async () => {
      if (!newComment.trim()) return;
      await addComment(teamId, taskId, newComment, userName);
      setNewComment(""); // Clear input field
      const updatedComments = await fetchComments(teamId, taskId);
      setComments(updatedComments); // Refresh comments
    };
  
    return (
        <div className="relative h-full flex flex-col pb-2">
      
  
        {/* Display comments */}
        <div className="flex-grow overflow-y-auto p-4 pb-24">
          {comments.map(comment => (
            // <div key={comment.id} className="p-3 bg-gray rounded-lg">
            //   <p className="text-sm font-semibold">{comment.author}</p>
            //   <p className="text-gray-700">{comment.text}</p>
            //   <p className="text-xs text-gray-500">
            //     {formatDistanceToNow(new Date(comment.timestamp))} ago
            //   </p>
            // </div>

            <div key={comment.id} className=" pb-2  rounded-lg">
  <p className="text-lg font-bold mb-2">{comment.author}</p>
  <p className="bg-lightgrey p-3 text-lg font-bold rounded-lg  max-w-full break-words">
    {comment.text}
  </p>
  <p className="text-sm font-semibold text-gray mt-1">
    {formatDistanceToNow(new Date(comment.timestamp))} ago
  </p>
</div>

          ))}
        </div>
  
        {/* Sticky input at the bottom */}
        <div></div>
        <div className=" fixed bottom-0 left-0 right-0  bg-bgColor p-4 border-b  shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow px-4 py-4 text-xl  rounded-lg bg-bgColor focus:outline-none"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CommentSection;