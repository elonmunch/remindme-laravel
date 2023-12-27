"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../api/constant";
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

export default function DeleteReminder(reminder: Reminder) {
  const { data: session } = useSession();


  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleDelete(reminderId: number) {
    setIsMutating(true);

    const options = {
        method: 'DELETE',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${session?.user.access_token}`
        }
      };

    await fetch(API_BASE_URL+`reminder/${reminderId}`, options);

    setIsMutating(false);

    router.refresh();
    setModal(false);
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button className="btn btn-error btn-sm" onClick={handleChange}>
        Delete
      </button>

      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are sure to delete {reminder.attributes.title} ?
          </h3>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleChange}>
              Close
            </button>
            {!isMutating ? (
              <button
                type="button"
                onClick={() => handleDelete(reminder.id)}
                className="btn btn-primary"
              >
                Delete
              </button>
            ) : (
              <button type="button" className="btn loading">
                Deleting...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}