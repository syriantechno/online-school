<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** @deprecated use ParentChildController@index for parents */
class MyChildrenController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return app(ParentChildController::class)->index($request);
    }
}
