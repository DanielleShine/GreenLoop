import { format } from "date-fns";

function formatDateTime(datetime) {
  return format(new Date(datetime), "MMMM dd, yyyy");
}

export default formatDateTime;
