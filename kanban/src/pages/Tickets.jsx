import TicketCard from "../components/TicketCard"
import { useGetTicketsQuery } from '../services/ticket';
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from 'react-router-dom';



const Tickets = () => {

  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams();
  const ticketSearch = searchParams.get("search") || "";
  const filter = searchParams.get("sorting") || "";
  const handleInputChange = (e) => {
    // setSearchParams({ search: e.target.value });
    const value = e.target.value;
    if (value.trim() === "") {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      setSearchParams(params);
    } else {
      setSearchParams({ search: value }, { replace: true });
    }
  };





  console.log(user);
  const {
    data: tickets = [],
    refetch: refetchTickets,
    // isLoading,
    // isFetching,
    // isError,
    // error,
  } = useGetTicketsQuery({ userId: user.id, search: ticketSearch ?? null, sorting: filter ?? null }, {
    refetchOnMountOrArgChange: true,
    // Ensure data is refetched on mount
  });
  //with user.id

  console.log(tickets.data)
  // console.log(Array.isArray(tickets.data));

  const filterByPriority = (filterDirection) => {
    setSearchParams({ sorting: filterDirection }, { replace: true });
  }

  const uniqueCategories = [
    ...new Set(tickets.data?.map(({ category }) => category).sort())
  ]
  console.log(uniqueCategories)
  return (

    <div className="dashboard">

      <div className="filtering_container">
        <button onClick={() => filterByPriority('desc')}>⭸</button>
        <button onClick={() => filterByPriority('asc')}>⭷</button>
        <input value={ticketSearch}
          type="text"
          id="search-bar"
          placeholder="Search for a ticket..."
          className="searchBar"
          name="search"
          onChange={handleInputChange}
        />
      </div>

      <h1>Your Tickets</h1>
      <div className="ticket-container">
        {tickets.data && uniqueCategories?.map((uniqueCategory, categoryIndex) => (
          <div key={categoryIndex}>
            <h3>{uniqueCategory}</h3>
            {tickets.data.filter(ticket => ticket.category === uniqueCategory).map((filteredTicket, i) => (
              <TicketCard
                key={i}
                id={i}
                color={filteredTicket.color}
                ticket={filteredTicket}
                refetch={refetchTickets}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tickets