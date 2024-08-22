type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Coord = {
  lon: number;
  lat: number;
};

type Main = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};

type Wind = {
  speed: number;
  deg: number;
};

type Clouds = {
  all: number;
};

type Sys = {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
};

export type WeatherGeneral = {
  coord?: Coord;
  weather?: Weather[];
  base?: string;
  main?: Main;
  visibility?: number;
  wind?: Wind;
  clouds?: Clouds;
  dt?: number;
  sys?: Sys;
  timezone?: number;
  id?: number;
  name?: string;
  cod?: number;
};

export type WeatherProps = {
  weather: WeatherGeneral;
};

const WeatherCard = ({ weather }: WeatherProps) => {
  const kelvinToCelcius = (temp: number) => {
    const newTemp = temp - 273.15;
    return Math.round(newTemp);
  };

  const getCurrentTime = () => {
    const date = new Date();
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = date.toLocaleString('es-ES', options);
    return formattedDate;
  };

  return (
    <article className="w-full max-w-[80%] bg-neutral-100/50 rounded-xl px-5 py-6 flex gap-5">
      <div className="w-[65%]">
        <div className="mb-4">
          <h2 className="font-bold text-[48px] leading-[48px]">{kelvinToCelcius(weather.main!.temp)} °C</h2>
          <h3 className="text-muted-foreground text-[18px] font-semibold">{weather.name}</h3>
        </div>

        <div>
          <p><b>Visibilidad:</b> {weather.visibility} metros</p>
          <p><b>Humedad:</b> {weather.main!.humidity} %</p>
          <p><b>Viento:</b> {weather.wind!.speed} m/s</p>
        </div>
      </div>

      <div>
        <h3 className="text-[20px] font-bold">Clima</h3>
        <p>{getCurrentTime()}</p>
        <p className="capitalize">{weather.weather?.[0].description}
        </p>
        <p>Sensación termica de {kelvinToCelcius(weather.main!.feels_like)} °C</p>
      </div>
    </article>
  );
};

export default WeatherCard;