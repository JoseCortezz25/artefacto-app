import Translator, { TranslatorProps } from "@/components/translator";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: 'Home/Translator',
  component: Translator,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    fromLang: {
      control: {
        type: 'text'
      }
    },
    toLang: {
      control: {
        type: 'text'
      }
    },
    inputText: {
      control: {
        type: 'text'
      }
    },
    translatedText: {
      control: {
        type: 'text'
      }
    }
  }
} satisfies Meta<TranslatorProps>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fromLang: 'Español',
    toLang: 'English',
    inputText: 'Hola a todos. Estoy muy contento de verte aquí!',
    translatedText: "Hello, everyone. I'm so glad to see you here!"
  }
};


