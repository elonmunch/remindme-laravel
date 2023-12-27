"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { API_BASE_URL } from "../api/constant";


export default function AddReminder( access_token : any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [remindAt, setRemindAt] = useState<Dayjs | null>(dayjs());
  const [eventAt, setEventAt] = useState<Dayjs | null>(dayjs());
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleSubmit() {
    // e.preventDefault();
    console.log(API_BASE_URL);

    setIsMutating(true);
    console.log(remindAt);
    const res = await fetch(API_BASE_URL+"reminder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": 'application/vnd.api+json',
        "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify({
        title: title,
        description: description,
        remind_at: remindAt?.format('YYYY-MM-DD HH:mm:ss'),
        event_at: eventAt?.format('YYYY-MM-DD HH:mm:ss')
      }),
    });

    if (!res.ok) {
      // throw new Error(`HTTP error! Status: ${res.status}`);
      console.log(res);
    } else{
      setIsMutating(false);

    setTitle("");
    setDescription("");
    setRemindAt(null);
    setEventAt(null);
    router.refresh();
    setModal(false);
    }
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button className="btn" onClick={handleChange}>
        Add New
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
          <h3 className="font-bold text-lg">Add New Reminder</h3>
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
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input w-full input-bordered"
                placeholder="description"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Remind At</label>
              <DateTimePicker  
                onChange={(e) => setRemindAt(e)}
                value={remindAt} 
                className="input w-full input-bordered" />
            </div>
            <div className="form-control">
              <label className="label font-bold">Event At</label>
              <DateTimePicker  
                onChange={(e) => setEventAt(e)}
                value={eventAt} 
                className="input w-full input-bordered" />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleChange}>
                Close
              </button>
              {!isMutating ? (
                <button onClick={handleSubmit} className="btn btn-primary">
                  Save
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Saving...
                </button>
              )}
            </div>
        </div>
      </div>
      </LocalizationProvider>
    </div>
  );
}