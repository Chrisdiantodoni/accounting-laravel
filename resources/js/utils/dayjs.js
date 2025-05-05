import dayjs from "dayjs";
import { isNull } from "lodash";

export const dayJsFormatDate = (day) => {
    if (day) {
        return dayjs(day).format("DD MMM YYYY") || "-";
    } else {
        return "-";
    }
};

export const dayjsFormatInputDate = (day) => {
    return dayjs(day).format("YYYY-MM-DD");
};

export const dayjsFormatDateTime = (day) => {
    if (isNull(day)) {
        return;
    }
    return dayjs(day).format("DD MMM YYYY HH:mm:ss");
};
