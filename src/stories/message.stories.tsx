import Message from "@/components/message";
import { User } from "@/lib/types";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Chat / Message",
  component: Message,
  argTypes: {
    role: {
      control: {
        type: "select"
      },
      options: Object.keys(User)
    },
    content: {
      control: {
        type: "text"
      }
    }
  }
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    role: User.User,
    content: 'Hola  ¿cómo estás?'
  }
};

export const AIMessage: Story = {
  args: {
    role: User.AI,
    content: '¡Hola! ¿Qué puedo ayudarte a encontrar?'
  }
};
