<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

function createAdmin(): User
{
    $adminRole = Role::firstOrCreate([
        'name' => 'admin',
        'guard_name' => 'web',
    ]);

    $admin = User::factory()->create();
    $admin->assignRole($adminRole);

    return $admin;
}

test('only administrators can access user and role pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/users')->assertForbidden();
    $this->actingAs($user)->get('/roles')->assertForbidden();

    $admin = createAdmin();

    $this->actingAs($admin)
        ->get('/users')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('users/index'));

    $this->actingAs($admin)
        ->get('/roles')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('roles/index'));
});

test('administrators can create users and assign roles', function () {
    $admin = createAdmin();
    $operator = Role::create(['name' => 'operador', 'guard_name' => 'web']);

    $response = $this->actingAs($admin)->post('/users', [
        'first_name' => 'Ana',
        'last_name' => 'Pérez',
        'dni' => '12345678',
        'email' => 'ana@example.com',
        'password' => 'password123',
        'roles' => [$operator->id],
    ]);

    $response->assertRedirect('/users');
    $user = User::where('dni', '12345678')->firstOrFail();

    expect($user->first_name)->toBe('Ana')
        ->and($user->hasRole('operador'))->toBeTrue()
        ->and(Hash::check('password123', $user->password))->toBeTrue();
});

test('administrators can manage roles but cannot change or delete the admin role', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->post('/roles', ['name' => 'operador'])
        ->assertRedirect('/roles');

    $role = Role::where('name', 'operador')->firstOrFail();

    $this->actingAs($admin)
        ->put("/roles/{$role->id}", ['name' => 'supervisor'])
        ->assertRedirect('/roles');

    expect(Role::where('name', 'supervisor')->exists())->toBeTrue();

    $this->actingAs($admin)->delete("/roles/{$role->id}")->assertRedirect('/roles');
    expect(Role::whereKey($role->id)->exists())->toBeFalse();

    $adminRole = Role::where('name', 'admin')->firstOrFail();
    $this->actingAs($admin)->put("/roles/{$adminRole->id}", ['name' => 'root'])->assertForbidden();
    $this->actingAs($admin)->delete("/roles/{$adminRole->id}")->assertRedirect('/roles');
    expect(Role::where('name', 'admin')->exists())->toBeTrue();
});

test('the last administrator cannot be deleted or have the admin role removed', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->delete("/users/{$admin->id}")
        ->assertSessionHasErrors('user');

    $this->actingAs($admin)
        ->put("/users/{$admin->id}", [
            'first_name' => $admin->first_name,
            'last_name' => $admin->last_name,
            'dni' => $admin->dni,
            'email' => $admin->email,
            'roles' => [],
        ])
        ->assertSessionHasErrors('roles');

    expect($admin->fresh()->hasRole('admin'))->toBeTrue();
});
