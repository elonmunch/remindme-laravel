"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import { API_BASE_URL } from "../api/constant";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSession } from "next-auth/react";

type Reminder = {
    id: number;
    attributes: {
      title: string;
      description: string;
      remind_at: Date;
      event_at: Date;
    };
}

export default function UpdateReminder(reminder: Reminder, access_token: any) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(reminder.attributes.title);
  const [description, setDescription] = useState(reminder.attributes.description);
  const [remindAt, setRemindAt] = useState<Dayjs | null>(dayjs(reminder.attributes.remind_at));
  const [eventAt, setEventAt] = useState<Dayjs | null>(dayjs(reminder.attributes.event_at));
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();

    setIsMutating(true);

    await fetch(API_BASE_URL+`reminder/${reminder.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": 'application/vnd.api+json',
        "Authorization": `Bearer ${session?.user.access_token}`
      },
      body: JSON.stringify({
        title: title,
        description: description,
        remind_at: remindAt?.format('YYYY-MM-DD HH:mm:ss'),
        event_at: eventAt?.format('YYYY-MM-DD HH:mm:ss'),
      }),
    });

    setIsMutating(false);

    router.refresh();
    setModal(false);
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button className="btn btn-info btn-sm" onClick={handleChange}>
        Edit
      </button>

      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit {reminder.attributes.title}</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control">
              <label className="label font-bold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full input-bordered"
                placeholder="Reminder Name"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input w-full input-bordered"
                placeholder="Description"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Remind At</label>
              <DateTimePicker
                value={remindAt}
                onChange={(e) => setRemindAt(e)}
                className="input w-full input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Event At</label>
              <DateTimePicker
                value={eventAt}
                onChange={(e) => setEventAt(e)}
                className="input w-full input-bordered"
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleChange}>
                Close
              </button>
              {!isMutating ? (
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Updating...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      </LocalizationProvider>
    </div>
  );
}