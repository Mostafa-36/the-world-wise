import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { supabase } from "../services/supabase";
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
      // console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload.at(0)],
        currentCity: action.payload.at(0),
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

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const { data } = await supabase.from("cities").select("*");

        // const data = await res.json();
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
          const { data } = await supabase
            .from("cities")
            .select("*")
            .eq("id", id);
          dispatch({ type: "city/loaded", payload: data.at(0) });
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
        console.log(newCity);
        const { id, cityName, country, emoji, date, note, position } = newCity;
        const { data, error } = await supabase
          .from("cities")
          .insert([{ id, cityName, country, emoji, date, note, position }])
          .select();
        if (error) console.log(error);
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
        const { error } = await supabase.from("cities").delete().eq("id", id);
        if (error) throw new Error(error);

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
