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

  return (
    <article className="w-full border shadow-sm px-5 py-6 rounded-lg flex gap-5">
      <div className="w-[30%]">
        <div className="mb-4">
          <h2 className="font-bold text-[40px]">{kelvinToCelcius(weather.main!.temp)} °C</h2>
          <h3 className="text-muted-foreground text-[18px]">{weather.name}</h3>
        </div>
        <div className="mb-4">
          <p>
            {weather.weather?.[0].main}
          </p>
          <p>
            {weather.weather?.[0].description}
          </p>
        </div>
      </div>

      <div>
        <p><b>Sensación termica:</b> {kelvinToCelcius(weather.main!.feels_like)}</p>
        <div className="w-full flex gap-2 mt-2">
          <p><b>Max:</b> {kelvinToCelcius(weather.main!.temp_max)} °C</p>
          <p><b>Min:</b> {kelvinToCelcius(weather.main!.temp_min)} °C</p>
        </div>
      </div>
    </article>
  );
};

export default WeatherCard;