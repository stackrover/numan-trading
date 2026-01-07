<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'page_id',
        'data',
    ];

    protected $casts = [
        'data' => 'object',
    ];

    protected $hidden = [];

    public function hydrateMedia()
    {
        if (!$this->page || !$this->data) {
            return $this;
        }

        // 1. Get all fields of type 'upload' for this page
        $imageFields = $this->page->blocks()
            ->with('fields')
            ->get()
            ->flatMap(function ($block) {
                return $block->fields->where('type', 'upload');
            });

        if ($imageFields->isEmpty()) {
            return $this;
        }

        // 2. Collect all media IDs from the document data
        $mediaIds = [];
        $data = json_decode(json_encode($this->data), true);

        foreach ($imageFields as $field) {
            foreach ($data as $blockSlug => $blockData) {
                if (isset($blockData[$field->name])) {
                    $val = $blockData[$field->name];
                    if (is_numeric($val)) {
                        $mediaIds[] = $val;
                    } elseif (is_array($val) && isset($val['type']) && $val['type'] === 'media' && isset($val['id'])) {
                        $mediaIds[] = $val['id'];
                    } elseif (is_object($val) && isset($val->type) && $val->type === 'media' && isset($val->id)) {
                        $mediaIds[] = $val->id;
                    }
                }
            }
        }

        if (empty($mediaIds)) {
            return $this;
        }

        // 3. Fetch all media records
        $mediaRecords = Media::whereIn('id', array_unique($mediaIds))->get()->keyBy('id');

        // 4. Replace IDs with Media objects
        foreach ($imageFields as $field) {
            foreach ($data as $blockSlug => $blockData) {
                if (isset($blockData[$field->name])) {
                    $val = $blockData[$field->name];
                    $id = null;

                    if (is_numeric($val)) {
                        $id = $val;
                    } elseif (is_array($val) && isset($val['type']) && $val['type'] === 'media' && isset($val['id'])) {
                        $id = $val['id'];
                    } elseif (is_object($val) && isset($val->type) && $val->type === 'media' && isset($val->id)) {
                        $id = $val->id;
                    }

                    if ($id && isset($mediaRecords[$id])) {
                        $data[$blockSlug][$field->name] = $mediaRecords[$id];
                    }
                }
            }
        }

        $this->data = (object) $data;
        return $this;
    }

    /* Relations  */
    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
