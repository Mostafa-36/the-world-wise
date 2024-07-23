import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
const BASE_URL = "http://localhost:8000";
const CitiesContxt = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    function getCity(id) {
      async function get() {
        if (Number(id) === currentCity.id) return;
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();
          // console.log(data);
          dispatch({ type: "city/loaded", payload: data });
        } catch {
          console.log("errr");
          dispatch({
            type: "rejected",
            payload: "There was an error loading city...",
          });
        }
      }
      get();
    },
    [createCity.id]
  );

  function createCity(newCity) {
    async function get() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        dispatch({ type: "city/created", payload: data });
      } catch {
        console.log("errr7");
        dispatch({
          type: "rejected",
          payload: "There was an error creating the city...",
        });
      }
    }
    get();
  }

  function deleteCity(id) {
    async function get() {
      dispatch({ type: "loading" });
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        dispatch({ type: "city/deleted", payload: id });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error deleting the city...",
        });
      }
    }
    get();
  }

  return (
    <CitiesContxt.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContxt.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContxt);
  // console.log(context);
  if (context === undefined) {
    throw new Error("cities context was used outside the cities provider");
  }
  return context;
}

export { CitiesProvider, useCities };
