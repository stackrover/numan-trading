<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EnquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Enquiry::with('product');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate($request->input('limit', 15)));
    }

    /**
     * Store a newly created resource in storage (Public Access).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
            'product_id' => 'nullable|exists:products,id',
        ]);

        if (empty($validated['subject'])) {
            $validated['subject'] = isset($validated['product_id']) ? 'Product Inquiry' : 'General Inquiry';
        }

        $enquiry = Enquiry::create($validated);
        return response()->json($enquiry, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Enquiry $enquiry)
    {
        if ($enquiry->status === 'unread') {
            $enquiry->update(['status' => 'read']);
        }
        return response()->json($enquiry);
    }

    /**
     * Reply to an enquiry.
     */
    public function reply(Request $request, $id)
    {
        $enquiry = Enquiry::findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        // In a real app, you would send an email here
        // Mail::to($enquiry->email)->send(new EnquiryReply($validated['message']));

        $enquiry->update([
            'status' => 'replied',
            'replied_at' => now(),
        ]);

        return response()->json([
            'message' => 'Reply sent successfully',
            'enquiry' => $enquiry
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enquiry $enquiry)
    {
        $enquiry->delete();
        return response()->json(null, 204);
    }
}
