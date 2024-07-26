import Message from "@/components/message";
import { SourceType, User } from "@/lib/types";
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
    },
    badge: {
      control: {
        type: "select"
      },
      options: Object.keys(SourceType)
    }
  },
  args: {
    badge: SourceType.NormalAnswer
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

export const AIMessageWithInternet: Story = {
  args: {
    role: User.AI,
    content: 'Este es un mensaje de prueba',
    badge: SourceType.Internet
  }
};

export const AIMessageWithWikipedia: Story = {
  args: {
    role: User.AI,
    content: 'Este es un mensaje de prueba',
    badge: SourceType.Wikipedia
  }
};