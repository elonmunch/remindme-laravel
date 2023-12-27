<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReminderRequest;
use App\Http\Resources\ReminderResource;
use App\Models\Reminder;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = ReminderResource::collection(
            Reminder::limit($request->limit)->get()
        );
        

        return $this->success([
            'reminders' => $data,
            'limit' => $request->limit
         ], 'SUCCESS');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReminderRequest $request)
    {
        $request->validated($request->all());

        $data = Reminder::create([
            'title' => $request->title,
            'description' => $request->description,
            'remind_at' => $request->remind_at,
            'event_at' => $request->event_at,
        ]);

        return $this->success([
            new ReminderResource($data),
         ], 'SUCCESS');
    }

    /**
     * Display the specified resource.
     */
    public function show(Reminder $reminder)
    {
        return $this->success([
            new ReminderResource($reminder),
         ], 'SUCCESS');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reminder $reminder)
    {
        $reminder->update($request->all());

        return $this->success([
            new ReminderResource($reminder),
         ], 'SUCCESS');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reminder $reminder)
    {
        $reminder->delete();

        return $this->success("", 'SUCCESS');
    }
}
