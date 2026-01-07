<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Team::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeamRequest $request)
    {
        $validatedData = $request->validated();

        $team = Team::create($validatedData);

        return response()->json($team, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        return response()->json($team);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeamRequest $request, Team $team)
    {
        $validatedData = $request->validated();

        $team->update($validatedData);

        return response()->json($team);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $team->delete();

        return response()->json(['message' => 'Team member deleted successfully']);
    }
}
