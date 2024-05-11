import { useState } from "react"
import { useGetBoardsQuery, useCreateBoardMutation } from "../services/board";



const Test = () => {
    const [createBoard] = useCreateBoardMutation();
    const {
        data: boards = [],
        // isLoading,
        // isFetching,
        // isError,
        // error,
    } = useGetBoardsQuery();
    const [inputText, setInputText] = useState('');
    const submit_handler = (e) => {
        e.preventDefault()
        const token = decodeURIComponent(
            document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1]
        );
        createBoard(
            {
                title: inputText,
            },
            token
        );
    }
    console.log(boards);
    return (
        <div style={{ marginLeft: 200 }}>
            <form onSubmit={submit_handler}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                    autoFocus
                />
                <button type="submit">Add Board</button>
            </form>
        </div>
    )
}

export default Test
