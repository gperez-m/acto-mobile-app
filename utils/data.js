import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

export function showDate(publishedAt = new Date()) {
  const now = dayjs();
  const diff = now.diff(publishedAt, 'day');
  if (diff >= 5) {
    return dayjs(publishedAt).format('ll');
  }
  return dayjs().to(dayjs(publishedAt));
}
