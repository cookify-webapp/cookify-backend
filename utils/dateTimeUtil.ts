import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const dateTimeNowTz = (tz: string = 'Asia/Bangkok') => dayjs().tz(tz);
