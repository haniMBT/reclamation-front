<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordResetCode extends Model
{
    use HasFactory;

    protected $table = 'password_reset_codes';

    protected $fillable = [
        'email',
        'code',
    ];

    protected $dates = [
        'created_at',
    ];

    // Pas de timestamp updated_at
    public $timestamps = false;

    protected $casts = [
        'created_at' => 'datetime',
    ];
}