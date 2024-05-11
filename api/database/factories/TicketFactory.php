<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title'=>fake()->sentence(6, true),
            'description'=>fake()->sentences(4, true),
            'category'=>$this->faker->randomElement(['Q1', 'Q2', 'Q3', 'Q4']),
            'priority'=>fake()->numberBetween(1, 5),
            'user_id'=>fake()->numberBetween(1, 5),
        ];
    }
}
