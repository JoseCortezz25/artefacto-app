import { Steps } from "@/app/page";
import InputSearch from "@/components/search";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: 'Home/InputSearch',
  component: InputSearch,
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
} as Meta<typeof InputSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "¿Qué deseas buscar?",
    value: "Busqueda de prueba",
    variant: Steps.Search
  }
};

export const InputChat: Story = {
  args: {
    placeholder: "¿Qué deseas buscar?",
    value: "Busqueda de prueba",
    variant: Steps.Chat
  }
};