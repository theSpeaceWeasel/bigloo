export interface ILabel {
  id?: number;
  color: string;
  text: string;
}

export interface ITask {
  id: number;
  completed: boolean;
  text: string;
}

export interface ICard {
  id: number;
  title: string;
  labels: ILabel[];
  date: string;
  tasks: ITask[];
  description?: string;
}

export interface IBoard {
  id: number;
  title: string;
  cards: ICard[];
}
