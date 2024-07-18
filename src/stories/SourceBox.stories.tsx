import SourceBox from "@/components/source-box";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: 'Home/SourceBox',
  component: SourceBox,
  parameters: {
    layout: 'centered'
  }

} satisfies Meta<typeof SourceBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Source Box",
    label: "This is a source box"
  }
};