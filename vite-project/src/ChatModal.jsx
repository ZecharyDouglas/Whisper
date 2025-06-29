import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "./helper/AuthContext";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION } from "./graphql/gqueries";

export default function ChatModal({ friend }) {
  const { user } = useAuth();
  const { data, loading, error, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { relationship_id: friend.relationship_id },
    //the apollo client has its own cache so its necessary to specifiy network only : this fixed db deleted messages from showing up
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { relationship_id: friend.relationship_id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newMsg = subscriptionData.data.messageCreated;

        // Grab the old array, or default it to an empty one
        const oldMsgs = Array.isArray(prev.getChatMessages)
          ? prev.getChatMessages
          : [];

        return {
          ...prev,
          getChatMessages: [...oldMsgs, newMsg],
        };
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore, friend.relationship_id]);

  if (loading) return <div className="p-4">Loading chat…</div>;
  if (error) return <div className="p-4 text-red-500">Error loading chat</div>;

  const messages = Array.isArray(data.getChatMessages)
    ? data.getChatMessages
    : [];

  return (
    <div className="">
      {messages.map((msg) => {
        const isMine = msg.sender_id === user.id;
        return (
          <div
            key={msg.id}
            className={`chat ${isMine ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble">{msg.message}</div>
          </div>
        );
      })}
    </div>
  );
}
