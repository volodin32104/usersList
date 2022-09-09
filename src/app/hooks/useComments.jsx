import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCurrentUserId } from "../store/users";

const CommentsContext = React.createContext();

export const useComments = () => {
    return useContext(CommentsContext);
};

export const CommentsnProvider = ({ children }) => {
    const [isLoading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const { userId } = useParams();
    const currentUserId = useSelector(getCurrentUserId());
    const [error, setError] = useState(null);
    useEffect(() => {
        getComments();
    }, [userId]);
      useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);
     function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }

    async function createComment(data) {
        const comment = {
            ...data,
            _id: nanoid(),
            pageId: userId,
            created_at: Date.now(),
            userId: currentUserId

        };
        try {
            const { content } = await commentService.createComment(comment);
            setComments((prevState) => [...prevState, content]);
        } catch (error) {
            errorCatcher(error);
        }
    }
    async function removeComment(id) {
        try {
            const { content } = await commentService.deleteComments(id);
            if (content === null) {
                setComments((prevState) => prevState.filter((c) => c._id !== id));
            }
        } catch (error) {
            errorCatcher(error);
        }
    }

    async function getComments() {
        try {
            const { content } = await commentService.getComments(userId);
            setComments(content);
        } catch (error) {
              errorCatcher(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <CommentsContext.Provider
            value={{ comments, createComment, isLoading, getComments, removeComment }}
        >
            {children}
        </CommentsContext.Provider>
    );
};

CommentsnProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
