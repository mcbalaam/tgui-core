import {
  type ReactNode,
  type RefObject,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addScrollableNode, removeScrollableNode } from '../common/events';
import { canRender, classes } from '../common/react';
import { computeBoxClassName, computeBoxProps } from '../common/ui';
import type { BoxProps } from './Box';
import { Icon } from './Icon';

type Props = Partial<{
  /** Buttons to render aside the section title. */
  buttons: ReactNode;
  /** id to assosiate with the parent div element used by this section, for uses with procs like getElementByID */
  container_id: string;
  /** If true, allows collapsing the sections by clicking on the title box **/
  collapsible: boolean;
  /** If true, fills all available vertical space. */
  fill: boolean;
  /** If true, removes all section padding. */
  fitted: boolean;
  /** If true, fills the area without forcing height to 100% */
  flexGrow: boolean;
  /** If true, removes the section top padding */
  noTopPadding: boolean;
  /** @member Callback function for the `scroll` event */
  onScroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /** Shows or hides the scrollbar. */
  scrollable: boolean;
  /** Shows or hides the horizontal scrollbar. */
  scrollableHorizontal: boolean;
  /** If true, filly the area except for -3rem */
  stretchContents: boolean;
  /** Title of the section. */
  title: ReactNode;
  /** If true, indicates the initial collapsed state */
  collapsed: boolean;
}> &
  BoxProps;

/**
 * ## Section
 * Section is a surface that displays content and actions on a single topic.
 *
 * They should be easy to scan for relevant and actionable information.
 * Elements, like text and images, should be placed in them in a way that
 * clearly indicates hierarchy.
 *
 * Sections can now be nested, and will automatically font size of the
 * header according to their nesting level. Previously this was done via `level`
 * prop, but now it is automatically calculated.
 *
 * Section can also be titled to clearly define its purpose.
 *
 * ```tsx
 * <Section title="Cargo">Here you can order supply crates.</Section>
 * ```
 *
 * If you want to have a button on the right side of an section title
 * (for example, to perform some sort of action), there is a way to do that:
 *
 * ```tsx
 * <Section title="Cargo" buttons={<Button>Send shuttle</Button>}>
 *   Here you can order supply crates.
 * </Section>
 * ```
 */
export const Section = forwardRef(
  (props: Props, forwardedRef: RefObject<HTMLDivElement>) => {
    const {
      buttons,
      children,
      className,
      collapsible,
      collapsed: initialCollapsed,
      container_id = '',
      fill,
      fitted,
      flexGrow,
      noTopPadding,
      onScroll,
      scrollable,
      scrollableHorizontal,
      stretchContents,
      title,
      ...rest
    } = props;

    const [isCollapsed, setIsCollapsed] = useState(initialCollapsed || false);
    const [isAnimating, setIsAnimating] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const internalRef = useRef<HTMLDivElement>(null);
    const nodeRef = forwardedRef || internalRef;

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName === 'max-height') {
        setIsAnimating(false);
      }
    };

    useEffect(() => {
      // Don't use early returns here as we're in useEffect
      if (nodeRef?.current) {
        if (scrollable || scrollableHorizontal) {
          addScrollableNode(nodeRef.current);
        }
      }

      return () => {
        if (nodeRef?.current) {
          removeScrollableNode(nodeRef.current);
        }
      };
    }, []);

    const handleTitleClick = () => {
      if (collapsible && !isAnimating) {
        setIsAnimating(true);
        setIsCollapsed(!isCollapsed);
      }
    };

    const hasTitle = canRender(title) || canRender(buttons);


    return (
      <div
        className={classes([
          'Section',
          fill && 'Section--fill',
          fitted && 'Section--fitted',
          scrollable && 'Section--scrollable',
          scrollableHorizontal && 'Section--scrollableHorizontal',
          flexGrow && 'Section--flex',
          isCollapsed && 'Section--collapsed',
          collapsible && 'Section--collapsible',
          className,
          computeBoxClassName(rest),
        ])}
        {...computeBoxProps(rest)}
      >
 {hasTitle && (
          <div
            className="Section__title"
            onClick={handleTitleClick}
            onKeyDown={
              collapsible
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTitleClick();
                    }
                  }
                : undefined
            }
            role={collapsible ? 'button' : undefined}
            tabIndex={collapsible ? 0 : undefined}
          >
            {collapsible && (
              <Icon name="angle-down" className="Section__collapseIcon" />
            )}
            <span className="Section__titleText">{title}</span>
            <div className="Section__buttons">{buttons}</div>
          </div>
        )}
<div
  ref={contentRef}
  className="Section__rest"
  onTransitionEnd={handleTransitionEnd}
  style={{
    maxHeight: collapsible
      ? isCollapsed
        ? '0'
        : `${contentRef.current?.scrollHeight}px`
      : undefined,
  }}
>
          <div
            ref={contentRef}
            className={classes([
              'Section__content',
              stretchContents && 'Section__content--stretchContents',
              noTopPadding && 'Section__content--noTopPadding',
            ])}
            onScroll={onScroll}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
