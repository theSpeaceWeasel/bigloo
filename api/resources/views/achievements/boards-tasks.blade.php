<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tasks</title>
    <style>
        body {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
th {
    color: #28224b;
    font-size: 12px;
    font-family: Roboto;
    font-weight: 700;
    line-height: 18px;
    word-wrap: break-word;
    font-family: sans-serif;
}
td {
    color: #666;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.04px;
    word-wrap: break-word;
}
tr {
    border: 1px solid rgba(0, 0, 0, 0.12);
}
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 50%;
    border-radius: 4px;
    margin: auto;
    transition: 0.7s;
}
td,
th {
    border-top: 1px solid #ddd;
    text-align: left;
    padding: 8px;
}
.dot {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 10px;
}
.dot.green {
    background: #00c853;
}
.dot.red {
    background: #d30b33;
}


    </style>
</head>
<body>

<table id="myTable">
  <thead>
    <tr>
      <th>Status</th>
      <th>Task's Name</th>
      <th>Card's Name</th>
      <th>Card's Description</th>
    </tr>
  </thead>
  <tbody>
   @foreach ($tasks as $task)
   <tr>
    <td><span class="
        @if($task->completed)
            dot green
        @else
            dot red
        @endif
        ">
        </span>
    </td>
    <td>{{$task->text}} </td>
    <td>{{$task->card_title}} </td>
    <td>{{$task->card_description}}</td>
  </tr>
   @endforeach
  </tbody>
</table>

</body>
</html>
