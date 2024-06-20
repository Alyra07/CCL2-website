import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})(({ theme, isSelected }) => ({
  borderRadius: '50%', // Change to circular shape
  ...(isSelected && {
    backgroundColor: '#a8dadc', // Custom color for selected days
    color: '#333333',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
  }),
}));

function Day(props) {
    const { day, start, end, ...other } = props;
  
    const isSelected = day.isBetween(start, end, 'day', '[]');
  
    return (
      <CustomPickersDay
        {...other}
        day={day}
        selected={false}
        isSelected={isSelected}
      />
    );
}

export { Day };