import { Steps } from "@/lib/types";
import { Meta, StoryObj } from "@storybook/react";
import WeatherCard, { WeatherGeneral } from "@/components/weather-card";

const meta = {
  title: 'Home/WeatherCard',
  component: WeatherCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'dark', value: '#1A202C' },
        { name: 'light', value: '#fff' }
      ]
    }
  },
  argTypes: {
    variant: {
      control: {
        type: "select"
      },
      options: Object.values(Steps)
    }
  }
} as Meta<typeof WeatherCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockWeather: WeatherGeneral = {
  coord: {
    lon: -74.006,
    lat: 40.7143
  },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01d"
    }
  ],
  base: "stations",
  main: {
    temp: 281.52,
    feels_like: 278.99,
    temp_min: 280.15,
    temp_max: 283.71,
    pressure: 1016,
    humidity: 53
  },
  visibility: 16093,
  wind: {
    speed: 1.5,
    deg: 350
  },
  clouds: {
    all: 1
  },
  dt: 1560350645,
  sys: {
    type: 1,
    id: 5122,
    message: 0.0139,
    country: "US",
    sunrise: 1560343627,
    sunset: 1560396563
  },
  timezone: -14400,
  id: 5128581,
  name: "New York",
  cod: 200
};

export const Default: Story = {
  args: {
    weather: mockWeather
  }
};