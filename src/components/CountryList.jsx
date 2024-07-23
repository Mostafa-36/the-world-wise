import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on map" />
    );
  //   console.log(cities);

  const countries = cities.reduce((arr, city) => {
    console.log(arr);
    console.log(city);
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country }];
    } else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {[...countries].map((country, index) => (
        <CountryItem country={country} key={index} />
      ))}
    </ul>
  );
}

export default CountryList;
