<?php

namespace App\Http\Controllers;

use App\Models\Banjar;
use Illuminate\Http\Request;
use Illuminate\Routing\ControllerDispatcher;

class BanjarController extends ControllerDispatcher
{
    public function index() {
        return Banjar::all();
    }

    public function show($id) {
        return Banjar::findOrFail($id);
    }

    public function update(Request $request, $id) {
        $banjar = Banjar::findOrFail($id);
        $banjar->update($request->all());
        return response()->json(['message' => 'Data berhasil disimpan']);
    }
}