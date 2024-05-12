import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board/Board";
import "./Dashboard.css";
import CustomInput from "../components/CustomInput/CustomInput";
import { ICard, IBoard } from "../Interfaces/Kanban";
import { fetchBoardList, updateLocalStorageBoards } from "../Helper/APILayers";
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
  // const [boards, setBoards] = useState<IBoard[]>([]);
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // async function fetchData() {
  //   const boards: IBoard[] = await fetchBoardList();
  //   setBoards(boards);
  // }
  // // Add new board functionality
  // const [targetCard, setTargetCard] = useState({
  //   boardId: 0,
  //   cardId: 0,
  // });

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
    refetchOnMountOrArgChange: true,
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
        ?.split("=")[1]
    );

    createBoard({
      board: {
        title: name,
        ticket_id: Number(ticketId),
      },
      token,
    });
    refetchBoards();
    // const tempBoardsList = [...boards];
    // tempBoardsList.push({
    //   id: Date.now() + Math.random() * 2,
    //   title: name,
    //   cards: [],
    // });
    // setBoards(tempBoardsList);
  };

  const removeBoard = (boardId: number) => {
    deleteBoard(boardId);
    refetchBoards();
    // console.log(boardId);
    // const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    // if (boardIndex < 0) return;
    // const tempBoardsList = [...boards];
    // tempBoardsList.splice(boardIndex, 1);
    // setBoards(tempBoardsList);
  };

  const addCardHandler = (boardId: number, title: string) => {
    console.log(boardId);
    const token: string = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1]
    );

    createCard(
      {
        board_id: boardId,
        title,
      },
      token
    );
    refetchBoards();
    // const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    // if (boardIndex < 0) return;

    // const tempBoardsList = [...boards];
    // tempBoardsList[boardIndex].cards.push({
    //   id: Date.now() + Math.random() * 2,
    //   title,
    //   labels: [],
    //   date: "",
    //   tasks: [],
    //   desc: "",
    // });
    // setBoards(tempBoardsList);
  };

  const removeCard = (boardId: number, cardId: number) => {
    deleteCard(cardId);
    refetchBoards();

    // console.log(cardId);

    // const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    // if (boardIndex < 0) return;

    // const tempBoardsList = [...boards];
    // const cards = tempBoardsList[boardIndex].cards;

    // const cardIndex = cards.findIndex((item) => item.id === cardId);
    // if (cardIndex < 0) return;

    // cards.splice(cardIndex, 1);
    // setBoards(tempBoardsList);
  };

  const updateCard = (boardId: number, cardId: number, card: ICard) => {
    // const boardIndex = boards.findIndex((item) => item.id === boardId);
    // if (boardIndex < 0) return;
    // const tempBoardsList = [...boards];
    // const cards = tempBoardsList[boardIndex].cards;
    // const cardIndex = cards.findIndex((item) => item.id === cardId);
    // if (cardIndex < 0) return;
    // tempBoardsList[boardIndex].cards[cardIndex] = card;
    // setBoards(tempBoardsList);
  };

  const onDragEnd = (boardId: number, cardId: number) => {
    const sourceBoardIndex = boardss.findIndex(
      (item: IBoard) => item.id === boardId
    );
    if (sourceBoardIndex < 0) return;

    const sourceCardIndex = boardss[sourceBoardIndex]?.cards?.findIndex(
      (item) => item.id === cardId
    );
    if (sourceCardIndex < 0) return;

    const targetBoardIndex = boardss.findIndex(
      (item: IBoard) => item.id === targetCard.boardId
    );
    if (targetBoardIndex < 0) return;

    const targetCardIndex = boardss[targetBoardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cardId
    );
    if (targetCardIndex < 0) return;

    const tempBoardsList = [...boardss];
    const sourceCard = tempBoardsList[sourceBoardIndex].cards[sourceCardIndex];
    tempBoardsList[sourceBoardIndex].cards.splice(sourceCardIndex, 1);
    tempBoardsList[targetBoardIndex].cards.splice(
      targetCardIndex,
      0,
      sourceCard
    );
    setBoards(tempBoardsList);

    setTargetCard({
      boardId: 0,
      cardId: 0,
    });
  };

  const onDragEnter = (boardId: number, cardId: number) => {
    if (targetCard.cardId === cardId) return;
    setTargetCard({
      boardId: boardId,
      cardId: cardId,
    });
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.25 } },
  };
  const elementVariants = { hidden: { opacity: 0 }, show: { opacity: 1 } };

  return isFetching ? (
    <Lottie
      options={defaultOptions}
      // style={{ marginRight: "100px" }}
      height={400}
      width={400}
    />
  ) : (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="show"
      className="app-dsh"
    >
      <div className="app-nav">
        <h1>Bigloo Board</h1>
      </div>
      <div className="app-boards-container">
        <motion.div variants={elementVariants} className="app-boards">
          {boardss.data.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              removeCard={removeCard}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
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
    </motion.div>
  );
}

export default Dashboard;
