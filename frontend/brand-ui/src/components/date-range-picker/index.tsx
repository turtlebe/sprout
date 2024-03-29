import DateFnsUtils from '@date-io/date-fns';
import { alpha, withStyles } from '@plentyag/brand-ui/src/material-ui/core';
import {
  DatePicker,
  DatePickerProps,
  MuiPickersUtilsProvider,
  useUtils,
} from '@plentyag/brand-ui/src/material-ui/pickers';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

const dataTestIds = {
  datePickerRoot: 'date-range-picker-root',
};
export { dataTestIds as dataTestIdsDateRangePicker };

// note: code taken from: https://codesandbox.io/s/laughing-boyd-zo5h0
// ToDo: replace with material ui component when they have one, should be soon...
// see discussion: https://github.com/mui-org/material-ui-pickers/issues/364

export interface DateRangeValue {
  begin: Date;
  end: Date;
}
export interface DateRangePicker extends Omit<DatePickerProps, 'onChange'> {
  classes?: any;
  value: DateRangeValue;
  onChange: (values: DateRangeValue) => void;
  emptyLabel?: string;
  autoOk?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  // open: openForward,
}

function DateRangePickerInternal({
  classes,
  value,
  onChange,
  labelFunc,
  format,
  emptyLabel,
  autoOk,
  onOpen,
  onClose,
  open: openForward,
  ...props
}) {
  const [begin, setBegin] = useState<Date | undefined>(value && value.begin);
  const [end, setEnd] = useState<Date | undefined>(value && value.end);
  const [prevBegin, setPrevBegin] = useState<Date | undefined>(value && value.begin);
  const [prevEnd, setPrevEnd] = useState<Date | undefined>(value && value.end);
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  const [hover, setHover] = useState<Date | undefined>(undefined);
  const [accepted, setAccepted] = useState<boolean>(false);
  const utils = useUtils();

  const endOrHover = end || hover || new Date(NaN);
  const min = begin && begin < endOrHover ? begin : endOrHover;
  const max = begin && begin > endOrHover ? begin : endOrHover;

  const [open, setOpen] = useState(false);

  const isOpen = openForward !== undefined ? openForward : open;

  useEffect(() => {
    //Only way to get to this state is is openForward is used
    if (isOpen && accepted && !prevBegin && !prevEnd) {
      setAccepted(false);
      setPrevBegin(begin);
      setPrevEnd(end);
      return;
    }
    //Closed without accepting, reset to prev state, don't find onChange
    if (!isOpen && !accepted) {
      setBegin(prevBegin);
      setEnd(prevEnd);
      setHover(undefined);
      setHasClicked(false);
    }
    //Auto ok and hasn't been accepted, but has all the items set, accept and close.
    //This will also triger the on change event by setting isOpen to false
    if (isOpen && autoOk && !accepted && begin && end && hasClicked) {
      setAccepted(true);
      onClose ? onClose() : setOpen(false);
    }
    if (accepted && begin && end && !isOpen && hasClicked) {
      setHasClicked(false);
      onChange({ begin, end });
      onClose ? onClose() : setOpen(false);
    }
  }, [begin, end, autoOk, accepted, isOpen, prevBegin, hasClicked, prevEnd]);

  // eslint-disable-next-line max-params
  function renderDay(day, selectedDate, dayInCurrentMonth, dayComponent) {
    return React.cloneElement(dayComponent, {
      onClick: e => {
        setHasClicked(true);
        e.stopPropagation();
        if (!begin) {
          setBegin(day);
        } else if (!end) {
          if (utils.isBeforeDay(day, begin)) {
            setEnd(begin);
            setBegin(day);
          } else {
            setEnd(day);
          }
          if (autoOk) {
            setPrevBegin(undefined);
            setPrevEnd(undefined);
          }
        } else {
          setBegin(day);
          setEnd(undefined);
        }
      },
      onMouseEnter: () => requestAnimationFrame(() => setHover(day)),
      onFocus: () => requestAnimationFrame(() => setHover(day)),
      className: clsx(classes.day, {
        [classes.hidden]: dayComponent.props.hidden,
        [classes.current]: dayComponent.props.current,
        [classes.isDisabled]: dayComponent.props.disabled,
        [classes.focusedRange]:
          (utils.isAfterDay(day, min) && utils.isBeforeDay(day, max)) ||
          (utils.isSameDay(day, min) && !utils.isSameDay(day, max)) ||
          (utils.isSameDay(day, max) && !utils.isSameDay(day, min)),
        [classes.focusedFirst]: utils.isSameDay(day, min) && !utils.isSameDay(day, max),
        [classes.focusedLast]: utils.isSameDay(day, max) && !utils.isSameDay(day, min),
        [classes.beginCap]: utils.isSameDay(day, min),
        [classes.endCap]: utils.isSameDay(day, max),
      }),
    });
  }

  const formatDate = date => utils.format(date, format || utils.dateFormat);

  function label(begin: Date, end: Date) {
    if (begin.getTime() === end.getTime()) {
      return `${formatDate(begin)}`;
    }
    return `${formatDate(begin)} - ${formatDate(end)}`;
  }
  return (
    <DatePicker
      data-testid={dataTestIds.datePickerRoot}
      {...props}
      value={begin}
      renderDay={renderDay}
      open={isOpen}
      onOpen={() => {
        setAccepted(false);
        setPrevBegin(begin);
        setPrevEnd(end);
        onOpen ? onOpen() : setOpen(true);
      }}
      onAccept={() => {
        if (!begin || !end) {
          if (begin && hover && utils.isBeforeDay(begin, hover)) {
            setEnd(hover);
          } else {
            setEnd(begin);
            setBegin(hover);
          }
        }
        setPrevBegin(undefined);
        setPrevEnd(undefined);
        // if (!autoOk) {
        setAccepted(true);
        // }
      }}
      onClose={() => {
        onClose ? onClose() : setOpen(false);
      }}
      onChange={() => {}}
      labelFunc={(date, invalid) =>
        !isOpen
          ? labelFunc
            ? labelFunc([begin, end], invalid)
            : date && begin && end
            ? label(begin, end)
            : emptyLabel || ''
          : prevBegin && prevEnd
          ? labelFunc
            ? labelFunc([prevBegin, prevEnd], invalid)
            : label(prevBegin, prevEnd)
          : emptyLabel || ''
      }
      DialogProps={{ className: classes.dateRangePickerDialog }}
    />
  );
}

export const styles = theme => {
  const focusedRangeColor = alpha(theme.palette.primary.main, 0.3);
  const focusedRangeGradient = `linear-gradient(to right, ${focusedRangeColor}, ${focusedRangeColor})`;
  const transparentRangeGradient = 'linear-gradient(to right, rgba(0,0,0,0.0), rgba(0,0,0,0.0))';
  return {
    dateRangePickerDialog: {
      '& .MuiPickersCalendar-transitionContainer': {
        minHeight: 218,
        marginTop: 10,
      },
    },
    day: {
      width: 40,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: 0,
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightMedium,
      padding: 0,
      transition: 'none',
      '&::after': {
        borderRadius: '100%',
        bottom: 0,
        boxSizing: 'border-box',
        content: '""',
        height: 36,
        width: 36,
        left: 0,
        margin: 'auto',
        position: 'absolute',
        right: 0,
        top: 0,
        transform: 'scale(0)',
        zIndex: 2,
      },
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        '&::after': {
          backgroundColor: theme.palette.background.paper,
          border: `2px solid ${theme.palette.primary.main}`,
          bottom: -2,
          left: -2,
          height: 36,
          width: 36,
          right: -2,
          top: -2,
          boxSizing: 'content-box',
          transform: 'scale(1)',
        },
      },
      '& > .MuiIconButton-label': {
        zIndex: 3,
      },
    },
    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },
    current: {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
    focusedRange: {
      color: theme.palette.primary.contrastText,
      background: `${focusedRangeGradient} no-repeat 0/20px 40px, ${focusedRangeGradient} no-repeat 20px 0/20px 40px`,
      fontWeight: theme.typography.fontWeightMedium,
      width: 40,
      marginRight: 0,
      marginLeft: 0,
      borderRadius: 0,
    },
    dayDisabled: {
      pointerEvents: 'none',
      color: theme.palette.text.hint,
    },
    beginCap: {
      '&::after': {
        transform: 'scale(1)',
        backgroundColor: theme.palette.primary.main,
      },
    },
    endCap: {
      '&::after': {
        transform: 'scale(1)',
        backgroundColor: theme.palette.primary.main,
      },
    },
    focusedFirst: {
      background: `${transparentRangeGradient} no-repeat 0/20px 40px,${focusedRangeGradient} no-repeat 20px 0/20px 40px`,
    },
    focusedLast: {
      background: `${focusedRangeGradient} no-repeat 0/20px 40px,${transparentRangeGradient} no-repeat 20px 0/20px 40px`,
    },
  };
};

// @ts-ignore
const StyledDateRangePicker = withStyles(styles, { name: 'DateRangePicker' })(DateRangePickerInternal);

export const DateRangePicker: React.FC<DateRangePicker> = props => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StyledDateRangePicker {...props} />
    </MuiPickersUtilsProvider>
  );
};
