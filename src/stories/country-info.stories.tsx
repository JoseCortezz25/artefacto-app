import { Meta, StoryObj } from "@storybook/react";
import CountryInfo from "@/components/country-info";

const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px'
    }
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px'
    }
  },
  iphone12: {
    name: 'iPhone 12 Pro Max',
    styles: {
      width: '428px',
      height: '926px'
    }
  }
};

const meta = {
  title: "Common / Country Info",
  component: CountryInfo,
  argTypes: {
    country: {
      control: {
        type: "object"
      }
    }
  },
  parameters: {
    viewport: {
      viewports: customViewports, // newViewports would be an ViewportMap. (see below for examples)
      defaultViewport: 'someDefault'
    }
  }
} satisfies Meta<typeof CountryInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

const countryData = {
  name: {
    common: "Colombia",
    official: "Republic of Colombia"
  },
  capital: ["Bogotá"],
  region: "Americas",
  subregion: "South America",
  languages: { spa: "Spanish" },
  population: 50882884,
  currencies: { COP: { name: "Colombian peso", symbol: "$" } },
  flags: {
    svg: "https://flagcdn.com/co.svg",
    alt: "The flag of Colombia is composed of three horizontal bands of yellow, blue and red, with the yellow band twice the height of the other two bands."
  },
  idd: {
    root: "+5",
    suffixes: [
      "7"
    ]
  }
};

export const Default: Story = {
  args: {
    country: countryData
  }
};