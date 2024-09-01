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
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type WeatherProps = {
  weather: WeatherGeneral;
};

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Droplets, Wind, Thermometer, Clock, Sun, CloudSun, Cloudy, Cloud, CloudHail, CloudRain, CloudLightning, Snowflake, CloudFog } from "lucide-react";

const kelvinToCelsius = (kelvin: number) => Math.round(kelvin - 273.15);

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

export default function WeatherCard({ weather }: WeatherProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white">
        <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between items-center">
          <h2 className="text-xl font-bold">Clima Actual en {weather.name}</h2>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-xl">{getCurrentTime()}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-9">
          <div className="flex items-center">
            {weather.weather[0].icon === "01d" && <Sun className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "02d" && <CloudSun className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "03d" && <Cloud className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "04d" && <Cloudy className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "09d" && <CloudHail className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "10d" && <CloudRain className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "11d" && <CloudLightning className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "13d" && <Snowflake className="size-[46px] mr-4" />}
            {weather.weather[0].icon === "50d" && <CloudFog className="size-[46px] mr-4" />}

            <div>
              <p className="text-6xl font-bold">{kelvinToCelsius(weather.main?.temp)}°C</p>
              <p className="text-2xl capitalize">{weather.weather[0].description}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xl">Sensación térmica</p>
            <p className="text-3xl font-semibold">{kelvinToCelsius(weather.main.feels_like)}°C</p>
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col md:grid grid-cols-2 gap-8 p-6 bg-gradient-to-b from-blue-100 to-white">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Visibilidad</p>
              <p className="text-xl font-semibold">{weather.visibility / 1000} km</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Droplets className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Humedad</p>
              <p className="text-xl font-semibold">{weather.main.humidity}%</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Wind className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Viento</p>
              <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Thermometer className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Temperatura Maxima</p>
              <p className="text-xl font-semibold">{kelvinToCelsius(weather.main?.temp_max)}°C</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}