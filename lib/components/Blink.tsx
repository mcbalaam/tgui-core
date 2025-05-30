import { Component, type PropsWithChildren } from 'react';

type Props = Partial<{
  /**
   * The interval between blinks, in milliseconds.
   */
  interval: number;

  /**
   * The time to wait before blinking again, in milliseconds.
   */
  time: number;
}> &
  PropsWithChildren;

type State = {
  hidden: boolean;
};

const DEFAULT_BLINKING_INTERVAL = 1000;
const DEFAULT_BLINKING_TIME = 1000;

/**
 * ## Blink
 *
 * A component that blinks its children at a specified interval.
 *
 * - [View documentation on tgui core](https://tgstation.github.io/tgui-core/?path=/docs/components-blink--docs)
 */
export class Blink extends Component<Props, State> {
  interval: NodeJS.Timeout;
  timer: NodeJS.Timeout;

  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
  }

  createTimer() {
    const {
      interval = DEFAULT_BLINKING_INTERVAL,
      time = DEFAULT_BLINKING_TIME,
    } = this.props;

    clearInterval(this.interval);
    clearTimeout(this.timer);

    this.setState({
      hidden: false,
    });

    this.interval = setInterval(() => {
      this.setState({
        hidden: true,
      });

      this.timer = setTimeout(() => {
        this.setState({
          hidden: false,
        });
      }, time);
    }, interval + time);
  }

  componentDidMount() {
    this.createTimer();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.interval !== this.props.interval ||
      prevProps.time !== this.props.time
    ) {
      this.createTimer();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timer);
  }

  render() {
    return (
      <span
        style={{
          visibility: this.state.hidden ? 'hidden' : 'visible',
        }}
      >
        {this.props.children}
      </span>
    );
  }
}
