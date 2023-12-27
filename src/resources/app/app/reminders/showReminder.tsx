"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import { API_BASE_URL } from "../api/constant";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Reminder = {
    id: number;
    attributes: {
      title: string;
      description: string;
      remind_at: Date;
      event_at: Date;
    };
}

export default function ShowReminder(reminder: Reminder) {
  const [modal, setModal] = useState(false);

//   const router = useRouter();



  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
        <button className="btn btn-success btn-sm" onClick={handleChange}>
            Show
        </button>

        <input
            type="checkbox"
            checked={modal}
            onChange={handleChange}
            className="modal-toggle"
        />

        <div className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{reminder.attributes.title} Detail</h3>

                <table className="table w-full">
                    <tbody>
                        <tr>
                            <td>Title</td>
                            <td>:</td>
                            <td>{reminder.attributes.title}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>:</td>
                            <td>{reminder.attributes.description}</td>
                        </tr>
                        <tr>
                            <td>Remind At</td>
                            <td>:</td>
                            <td>{dayjs(reminder.attributes.remind_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                        </tr>
                        <tr>
                            <td>Event At</td>
                            <td>:</td>
                            <td>{dayjs(reminder.attributes.event_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="modal-action">
                <button type="button" className="btn" onClick={handleChange}>
                    Close
                </button>
                </div>
            </div>
        </div>
    </div>
  );
}