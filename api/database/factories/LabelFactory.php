<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Label>
 */
class LabelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'text' => fake()->sentence(6, true),
            'color' => $this->faker->randomElement(['#1ebffa', '#7a92ff', '#ff8c61', '#42f5e7']),
            'card_id' => fake()->numberBetween(1, 5),
        ];
    }
}
