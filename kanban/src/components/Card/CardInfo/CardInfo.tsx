import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, List, Tag, Trash, Type } from "react-feather";
import { colorsList } from "../../../Helper/Util";
import Modal from "../../Modal/Modal";
import CustomInput from "../../CustomInput/CustomInput";

import "./CardInfo.css";
import { ICard, ILabel, ITask } from "../../../Interfaces/Kanban";
import Chip from "../../Common/Chip";
import { useAuth } from "../../../context/AuthContext";
import {
  useUpdateCardTitleMutation,
  useUpdateCardDescriptionMutation,
  useAddLabelToCardMutation,
  useAddTaskToCardMutation,
  useUpdateCardTaskMutation,
  useUpdateDueDateForCardMutation,
  useDeleteLabelFromCardMutation,
  useDeleteTaskFromCardMutation,
} from "../../../services/card";

interface CardInfoProps {
  onClose: () => void;
  card: ICard;
  boardId: number;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
  refetchBoards: () => void;
}

function CardInfo(props: CardInfoProps) {
  const { onClose, card, boardId, updateCard, refetchBoards } = props;

  const [selectedColor, setSelectedColor] = useState("");
  const [cardValues, setCardValues] = useState<ICard>({
    ...card,
  });

  const [updateCardTitle, { isLoading }] = useUpdateCardTitleMutation();
  const [updateCardDescription] = useUpdateCardDescriptionMutation();
  const [addLabelToCard] = useAddLabelToCardMutation();
  const [addTaskToCard] = useAddTaskToCardMutation();
  const [updateCardTask] = useUpdateCardTaskMutation();
  const [updateDueDateForCard] = useUpdateDueDateForCardMutation();
  const [deleteLabelFromCard] = useDeleteLabelFromCardMutation();
  const [deleteTaskFromCard] = useDeleteTaskFromCardMutation();

  const { setCardTaskUpdated }: any = useAuth();

  const updatingTitle = (title, cardId) => {
    // console.log(cardId);
    updateCardTitle({ title, cardId, boardId });
  };

  const updatingDescription = (description: string, cardId: number) => {
    // console.log(cardId);
    updateCardDescription({ description, cardId, boardId });
  };

  const updateTitle = (value: string) => {
    // console.log(value, card.id);
    updatingTitle(value, card.id);

    // setCardValues({ ...cardValues, title: value });
  };

  const updateDesc = (value: string) => {
    updatingDescription(value, card.id);
  };

  const addLabel = (label: ILabel, cardId: number) => {
    addLabelToCard({ label, cardId, boardId });
    setSelectedColor("");
  };

  const removeLabel = (label: ILabel) => {
    deleteLabelFromCard({ labelId: label.id, boardId });
  };

  const addingTask = (value, cardId) => {
    const task = {
      text: value,
      completed: false,
    };
    addTaskToCard({ task, cardId, boardId });
  };

  const addTask = (value: string) => {
    addingTask(value, card.id);
  };

  const removeTask = (id: number) => {
    deleteTaskFromCard({ taskId: id, boardId });
  };

  const updateTask = (id: number, value: boolean) => {
    updateCardTask({ taskId: id, completed: value, boardId });
    setCardTaskUpdated(true);
  };

  const calculatePercent = () => {
    if (!cardValues.tasks?.length) return 0;
    const completed = cardValues.tasks?.filter(
      (item) => item.completed
    )?.length;
    return (completed / cardValues.tasks?.length) * 100;
  };

  const updateDate = (date: string) => {
    if (!date) return;
    const cardId = card.id;
    const formattedDueDate = new Date(date).toISOString().substr(0, 10);
    // console.log(date);
    updateDueDateForCard({ date: formattedDueDate, cardId, boardId });
  };

  useEffect(() => {
    if (updateCard) updateCard(boardId, cardValues.id, cardValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardValues]);

  const calculatedPercent = calculatePercent();

  return (
    <Modal onClose={onClose}>
      <div className="cardinfo">
        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Type />
            <p>Title</p>
          </div>
          <CustomInput
            defaultValue={card.title}
            text={card.title}
            placeholder="Enter Title"
            onSubmit={updateTitle}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <List />
            <p>Description</p>
          </div>
          <CustomInput
            defaultValue={card.description}
            text={card.description || "Add a Description"}
            placeholder="Enter description"
            onSubmit={updateDesc}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Calendar />
            <p>Date</p>
          </div>
          <input
            type="date"
            defaultValue={card.date}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDate(event.target.value)}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Tag />
            <p>Labels</p>
          </div>
          <div className="cardinfo-box-labels">
            {cardValues.labels?.map((item, index) => (
              <Chip key={index} item={item} removeLabel={removeLabel} />
            ))}
          </div>
          <ul>
            {colorsList.map((item, index) => (
              <li
                key={index}
                style={{ backgroundColor: item }}
                className={selectedColor === item ? "li-active" : ""}
                onClick={() => setSelectedColor(item)}
              />
            ))}
          </ul>
          <CustomInput
            text="Add Label"
            placeholder="Enter label text"
            onSubmit={(value: string) =>
              addLabel({ color: selectedColor, text: value }, card.id)
            }
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <CheckSquare />
            <p>Tasks</p>
          </div>
          <div className="cardinfo-box-progress-bar">
            <div
              className="cardinfo-box-progress"
              style={{
                width: `${calculatedPercent}%`,
                backgroundColor: calculatedPercent === 100 ? "limegreen" : "",
              }}
            />
          </div>
          <div className="cardinfo-box-task-list">
            {cardValues.tasks?.map((item) => (
              <div key={item.id} className="cardinfo-box-task-checkbox">
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  onChange={(event) =>
                    updateTask(item.id, event.target.checked)
                  }
                />
                <p className={item.completed ? "completed" : ""}>{item.text}</p>
                <Trash onClick={() => removeTask(item.id)} />
              </div>
            ))}
          </div>
          <CustomInput
            text={"Add a Task"}
            placeholder="Enter task"
            onSubmit={addTask}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
