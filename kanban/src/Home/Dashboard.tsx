import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board/Board";
import "./Dashboard.css";
import CustomInput from "../components/CustomInput/CustomInput";
import { ICard, IBoard } from "../Interfaces/Kanban";
import {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useDeleteBoardMutation,
} from "../services/board";
import { useCreateCardMutation, useDeleteCardMutation } from "../services/card";
import Lottie from "react-lottie";
import loadinganimation from "./loading.json";
import { motion } from "framer-motion";

function Dashboard() {
  const { ticketId } = useParams();
  console.log(ticketId);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadinganimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [
    createBoard,
    // { isLoadingAddCard }
  ] = useCreateBoardMutation();

  const [
    deleteBoard,
    // { isLoadingDeleteCard }
  ] = useDeleteBoardMutation();

  const {
    data: boardss = [],
    refetch: refetchBoards,
    // isLoading,
    isFetching,
    // isError,
    // error,
  } = useGetBoardsQuery(ticketId, {
    // refetchOnMountOrArgChange: true,
    skip: !ticketId,
    // Ensure data is refetched on mount
  });

  const [createCard] = useCreateCardMutation();

  const [
    deleteCard,
    // { isLoadingDeleteCard }
  ] = useDeleteCardMutation();

  //add tokceId to a board when added
  const addboardHandler = async (name: string) => {
    const token: string = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] || ""
    );

    createBoard({
      board: {
        title: name,
        ticket_id: Number(ticketId),
      },
      token,
    });
  };

  const removeBoard = (boardId: number) => {
    deleteBoard({ boardId, ticketId });
  };

  const addCardHandler = (boardId: number, title: string) => {
    createCard({
      board_id: boardId,
      title,
    });
  };

  const removeCard = (boardId: number, cardId: number) => {
    deleteCard({ boardId, cardId });
  };

  const updateCard = (boardId: number, cardId: number, card: ICard) => {};

  const gridVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.25 } },
  };
  const elementVariants = { hidden: { opacity: 0 }, show: { opacity: 1 } };

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="show"
      className="app-dsh"
    >
      <div className="app-nav">
        <h1>Bigloo Board</h1>
      </div>
      {isFetching ? (
        <Lottie
          options={defaultOptions}
          style={{ marginRight: "100px" }}
          height={60}
          width={60}
        />
      ) : (
        <div className="app-boards-container">
          <motion.div variants={elementVariants} className="app-boards">
            {boardss.data.map((item) => (
              <Board
                key={item.id}
                board={item}
                addCard={addCardHandler}
                removeBoard={() => removeBoard(item.id)}
                removeCard={removeCard}
                updateCard={updateCard}
                refetchBoards={refetchBoards}
              />
            ))}
            <div className="app-boards-last">
              <CustomInput
                displayClass="app-boards-add-board"
                editClass="app-boards-add-board-edit"
                placeholder="Enter Board Name"
                text="AddxxBoard"
                buttonText="Add..Board"
                onSubmit={addboardHandler}
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default Dashboard;
