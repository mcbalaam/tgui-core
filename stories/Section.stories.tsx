import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Section } from '../lib/components/Section';

type StoryProps = ComponentProps<typeof Section>;

export default {
  component: Section,
  title: 'Components/Section',
} satisfies Meta<StoryProps>;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
  args: {
    children: (
      <>
        It's impossible to change the selected channel while there's any message
        typed in, requiring you to either delete all of the text, press
        Backspace again, then type the intended channel key and start again, or
        manually click the target channel button to swap to Say and type the
        intended channel key at the front. Bit of a regression, I feel it'd be
        good to just always allow erasing channel selection by Backspacing the
        start of the message
      </>
    ),
    title: 'Collapsible Section',
    collapsible: true,
  },
};

export const Comparison: Story = {
  render: () => (
    <>
      <Section title="Normal Section">
        It's impossible to change the selected channel while there's any message
        typed in, requiring you to either delete all of the text, press
        Backspace again, then type the intended channel key and start again, or
        manually click the target channel button to swap to Say and type the
        intended channel key at the front. Bit of a regression, I feel it'd be
        good to just always allow erasing channel selection by Backspacing the
        start of the message
      </Section>
      <Section title="Collapsible Section" collapsible>
        It's impossible to change the selected channel while there's any message
        typed in, requiring you to either delete all of the text, press
        Backspace again, then type the intended channel key and start again, or
        manually click the target channel button to swap to Say and type the
        intended channel key at the front. Bit of a regression, I feel it'd be
        good to just always allow erasing channel selection by Backspacing the
        start of the message
      </Section>
      <Section title="Second Collapsible Section" collapsible>
        <Section title="Nested Collapsible Section" collapsible>
          <Section title="Nested Collapsible Section 2" collapsible>
            It's impossible to change the selected channel while there's any
            message typed in, requiring you to either delete all of the text,
            press Backspace again.
          </Section>
        </Section>
      </Section>
    </>
  ),
};
