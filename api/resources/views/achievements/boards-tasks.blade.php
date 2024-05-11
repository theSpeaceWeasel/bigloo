
@foreach($tasks as $task)
    <div>
        <h3>{{ $task->text }}</h3>
        <p>{{ $task->completed }}</p>
        <!-- You can display more task details here -->
    </div>
@endforeach
