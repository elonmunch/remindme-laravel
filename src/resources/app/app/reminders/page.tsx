import AddReminder from "./addReminder";
import UpdateReminder from "./updateReminder";
import DeleteReminder from "./deleteReminder";
import { API_BASE_URL } from "../api/constant";
import ShowReminder from "./showReminder";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Product List",
};

type Reminder = {
  id: number;
  attributes: {
    title: string;
    description: string;
    remind_at: Date;
    event_at: Date;
  };
}

type ReminderApiResponse = {
  reminders: Reminder[];
};

async function getReminders(access_token: string): Promise<Reminder[]> {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  };

  const res = await fetch(API_BASE_URL+'reminder?limit=5', {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();

  // console.log(data.data.reminders);
  return data.data.reminders;
}

export default async function ReminderList() {
  const session = await getServerSession(authOptions)

  const reminders: Reminder[] = await getReminders(session?.user.access_token);
  return (
    <div className="py-10 px-10">
      <div className="py-2">
        <AddReminder />
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Reminder Name</th>
            <th>Description</th>
            <th>Remind At</th>
            <th>Event At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reminders && reminders.map &&reminders.map((reminder, index) => (
            <tr key={reminder.id}>
              <td>{index + 1}</td>
              <td>{reminder.attributes.title}</td>
              <td>{reminder.attributes.description}</td>
              <td>{new Date(reminder.attributes.remind_at).toLocaleString()}</td>
              <td>{new Date(reminder.attributes.event_at).toLocaleString()}</td>
              <td className="flex">
                <div className="mr-1">
                  <ShowReminder {...reminder} />
                </div>
                
                <div className="mr-1">
                  <UpdateReminder {...reminder}/>
                </div>

                <DeleteReminder  {...reminder}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
