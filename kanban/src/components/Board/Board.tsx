import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import CustomInput from "../CustomInput/CustomInput";

import "./Board.css";
import { IBoard, ICard } from "../../Interfaces/Kanban";
import { useGetCardsFromBoardQuery } from "../../services/card";

import Lottie from "react-lottie";
import loadinganimation from "../../Home/loading.json";

interface BoardProps {
  board: IBoard;
  addCard: (boardId: number, title: string) => void;
  removeBoard: (boardId: number) => void;
  removeCard: (boardId: number, cardId: number) => void;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
  refetchBoards: () => void;
}

function Board(props: BoardProps) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadinganimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { board, addCard, removeBoard, removeCard, updateCard, refetchBoards } =
    props;
  // console.log(board.id);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    data: cards = [],
    refetch: refetchCards,
    isFetching,
  } = useGetCardsFromBoardQuery(board.id);

  console.log(cards);

  return (
    <div className="board">
      <div className="board-inner" key={board?.id}>
        <div className="board-header">
          <p className="board-header-title">
            {board?.title}
            <span>{cards?.length || 0}</span>
          </p>
          <div
            className="board-header-title-more"
            onClick={() => {
              console.log(showDropdown);
              setShowDropdown((prev) => !prev);
            }}
          >
            <MoreHorizontal />
            {showDropdown && (
              <Dropdown
                class="board-dropdown"
                onClose={() => setShowDropdown(false)}
              >
                <p
                  className="deleteBoardBtn"
                  onClick={() => removeBoard(board?.id)}
                >
                  Delete Board
                </p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="board-cards custom-scroll">
          {isFetching ? (
            <Lottie
              options={defaultOptions}
              style={{ marginRight: "100px" }}
              height={60}
              width={60}
            />
          ) : (
            cards?.data?.map((item) => (
              <Card
                key={item.id}
                card={item}
                boardId={board.id}
                removeCard={removeCard}
                updateCard={updateCard}
                refetchBoards={refetchBoards}
              />
            ))
          )}
          <CustomInput
            text="+ Add Card"
            placeholder="Enter Card Title"
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={(value: string) => addCard(board?.id, value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Board;
