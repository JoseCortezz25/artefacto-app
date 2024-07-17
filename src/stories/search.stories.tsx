import InputSearch from "@/components/search";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: 'Home/InputSearch',
  component: InputSearch,
  parameters: {
    layout: 'centered'
  }
  // Thi
} as Meta<typeof InputSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "¿Qué deseas buscar?",
    value: "Busqueda de prueba"
  }
};